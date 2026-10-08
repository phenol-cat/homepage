/**
 * 点阵磁环特效 (Dot Matrix Ring)
 *
 * 来源：learn_vue/dotMatrix.html 里的 DotRingEffect，移植时做了几处改造：
 *
 * 1. 背景支持 transparent —— 原版是铺满整屏并自己画底色，这里要叠在玻璃面板上，
 *    不能再盖住背景图，所以默认不画任何底色；
 * 2. 鼠标事件绑定到传入的宿主元素，而不是 window —— 原版整页都在响应，
 *    放到页面里会和其他交互打架；
 * 3. 空闲优化 —— 鼠标不在区域内且没有点被捕获时直接跳过扫描，静止时不空转；
 * 4. 支持 reduced-motion —— 用户关闭动画时只静态渲染一次，不跑动画循环；
 * 5. 采样上限可配置 —— 原版是给整屏图像用的，点阵字需要更细的网格。
 *
 * 核心原理：
 *  - 把源图像高质量缩放进 cols x rows 的小网格，每个格子取平均颜色 → 一个点；
 *  - 鼠标半径内的点被"捕获"，按 Morton(Z-order) 颜色索引排序后，
 *    均匀铺在鼠标周围的圆环上，形成一条颜色连贯的色带；
 *  - 鼠标离开后，点按弹簧曲线飞回原位。
 */

const TAU = Math.PI * 2
const LUM_STRENGTH = 0.42 // 暗点稍微放大、亮点稍微缩小，增强轮廓识别度

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const quant8 = (v) => Math.min(255, Math.round(v / 32) * 32)

function dist2(ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  return dx * dx + dy * dy
}

// 颜色空间的 Z-order（Morton）索引：把 R/G/B 的比特交错成一个整数。
// 索引相邻 ≈ 颜色在 RGB 空间相邻，所以按它排序得到的是连贯色带，
// 不会像按色相排序那样在明暗变化处出现突兀的跳变。
const MORTON = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let v = 0
    for (let b = 0; b < 8; b++) v |= ((i >> b) & 1) << (b * 3)
    t[i] = v
  }
  return t
})()

const mortonKey = (r, g, b) => MORTON[r] | (MORTON[g] << 1) | (MORTON[b] << 2)

export class DotMatrixEffect {
  /**
   * @param {HTMLElement} host   承载鼠标事件的容器（通常是画布的父元素）
   * @param {HTMLCanvasElement} canvas
   * @param {object} opts  { cols, dotSize, captureR, ringR, maxCols, maxDots }
   * @param {object} cbs   { onStats(dotCount) }
   */
  constructor(host, canvas, opts = {}, cbs = {}) {
    this.host = host
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.opts = {
      cols: 200,
      dotSize: 0.9,
      captureR: 130,
      ringR: 54,
      maxCols: 420,
      maxDots: 30000,
      ...opts
    }
    this.cbs = cbs

    // 静态点阵层：所有"未被捕获"的点一次性画到这张离屏画布上
    this.base = document.createElement('canvas')
    this.bctx = this.base.getContext('2d')

    this.source = null
    this.dots = []
    this.groups = [] // 按量化后的颜色分组，减少 fillStyle 切换
    this.bins = [] // 每帧捕获点的临时分组
    this.captured = []
    this.orderDirty = true // 需要按颜色重新排序并分配环上角度
    this.resortAccum = 0 // 距离下次"每秒重排"的累计时间

    this.width = 0
    this.height = 0
    this.dpr = 1
    this.cell = 1

    this.mouseX = 0
    this.mouseY = 0
    this.mouseOn = false
    this.mouseWasOn = false

    this.dirty = true // 源图 / 尺寸 / 密度变化 → 下一帧重建点阵
    this.baseDirty = true
    this.hasPainted = false
    this.usedDotSize = -1
    this.avgLum = 128
    this.lastCols = -1
    this.lastW = -1
    this.lastH = -1
    this.paused = false
    this._raf = 0
    this._lastT = 0

    this._onPointerMove = (e) => {
      const rect = this.canvas.getBoundingClientRect()
      this.mouseX = e.clientX - rect.left
      this.mouseY = e.clientY - rect.top
      this.mouseOn = true
    }
    this._onPointerLeave = () => {
      this.mouseOn = false
    }

    host.addEventListener('pointermove', this._onPointerMove, { passive: true })
    host.addEventListener('pointerleave', this._onPointerLeave)
    host.addEventListener('pointercancel', this._onPointerLeave)

    this._resize()
  }

  dispose() {
    cancelAnimationFrame(this._raf)
    this._raf = 0
    this.host.removeEventListener('pointermove', this._onPointerMove)
    this.host.removeEventListener('pointerleave', this._onPointerLeave)
    this.host.removeEventListener('pointercancel', this._onPointerLeave)
  }

  /** 更换图像源（可以是 Image、Canvas），下一帧重建点阵 */
  setSource(src) {
    this.source = src
    this.dirty = true
  }

  /** 启动动画循环（reduced-motion 场景下不要调用） */
  start() {
    if (this._raf) return
    this._lastT = 0
    this._raf = requestAnimationFrame((t) => this._tick(t))
  }

  /** 只渲染一次静态点阵，不进入动画循环 */
  renderStatic() {
    this._resize()
    this.ctx.clearRect(0, 0, this.width, this.height)
    this._buildDots(Math.round(this.opts.cols || 200))
    this._buildBase()
    this.ctx.drawImage(this.base, 0, 0, this.width, this.height)
    this.hasPainted = true
  }

  /** 容器尺寸变化时调用 */
  resize() {
    if (this._resize()) {
      if (!this._raf) this.renderStatic()
    }
  }

  /* ---------- 尺寸 ---------- */
  _resize() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    if (w < 2 || h < 2) return false
    if (w === this.width && h === this.height) return false

    this.width = w
    this.height = h
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)

    for (const [cv, ctx] of [
      [this.canvas, this.ctx],
      [this.base, this.bctx]
    ]) {
      cv.width = Math.round(w * this.dpr)
      cv.height = Math.round(h * this.dpr)
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    }
    this.dirty = true
    this.baseDirty = true
    return true
  }

  /* ---------- 点阵采样 ---------- */
  _buildDots(colsTarget) {
    const w = this.width
    const h = this.height
    const aspect = w / h
    const maxDots = this.opts.maxDots

    let cols = clamp(Math.round(colsTarget), 24, this.opts.maxCols)
    // 根据画布比例限制总点数（防止超宽画布把点数撑爆）
    const colsCap = Math.floor(Math.sqrt(maxDots * aspect))
    cols = Math.min(cols, Math.max(24, colsCap))

    const rows = Math.max(1, Math.round((h * cols) / w))
    const stepX = w / cols
    const stepY = h / rows
    this.cell = Math.min(stepX, stepY)

    // 把源图 "contain" 缩进 cols x rows 的小画布，
    // 每个像素天然就是对应格子里的平均颜色（用浏览器的高质量缩放）
    const sw = this.source.naturalWidth || this.source.width
    const sh = this.source.naturalHeight || this.source.height
    const tmp = document.createElement('canvas')
    tmp.width = Math.max(1, cols)
    tmp.height = Math.max(1, rows)
    const tctx = tmp.getContext('2d', { willReadFrequently: true })
    tctx.imageSmoothingEnabled = true
    tctx.imageSmoothingQuality = 'high'
    const scale = Math.min(cols / sw, rows / sh)
    const dw = sw * scale
    const dh = sh * scale
    tctx.clearRect(0, 0, cols, rows)
    tctx.drawImage(this.source, (cols - dw) / 2, (rows - dh) / 2, dw, dh)

    const data = tctx.getImageData(0, 0, cols, rows).data
    const dots = []
    const groupMap = new Map() // colorKey -> group index
    const groups = []
    let lumSum = 0
    let lumCount = 0

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 4
        const a = data[i + 3] / 255
        if (a < 0.09) continue // 完全透明处不画点

        const R = data[i]
        const G = data[i + 1]
        const B = data[i + 2]
        const lum = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255
        lumSum += lum
        lumCount++

        // 暗一点的区域点更大、亮一点的区域点更小 → 保留明暗轮廓
        const sizeK = clamp(1 - LUM_STRENGTH * (lum - 0.55), 0.68, 1.35)

        // 颜色量化后分组，渲染时同组只需一次 fillStyle
        const qR = quant8(R)
        const qG = quant8(G)
        const qB = quant8(B)
        const qA = a > 0.9 ? 3 : a > 0.6 ? 2 : a > 0.28 ? 1 : 0
        const groupKey = ((qA << 24) | (qR / 32) << 16) | ((qG / 32) << 8) | qB / 32
        const alpha = qA === 3 ? 1 : qA === 2 ? 0.72 : qA === 1 ? 0.42 : 0.12
        let gi = groupMap.get(groupKey)
        if (gi === undefined) {
          gi = groups.length
          groups.push({
            color: 'rgba(' + qR + ',' + qG + ',' + qB + ',' + alpha + ')',
            list: []
          })
          groupMap.set(groupKey, gi)
        }

        const x = (c + 0.5) * stepX
        const y = (r + 0.5) * stepY
        const dot = {
          x,
          y,
          px: x,
          py: y,
          key: mortonKey(R, G, B),
          sizeK,
          r: 1,
          cap: false,
          ringTargetA: 0,
          gi
        }
        dots.push(dot)
        groups[gi].list.push(dot)
      }
    }

    this.dots = dots
    this.groups = groups
    this.bins = this.groups.map(() => [])
    this.avgLum = lumCount ? (lumSum / lumCount) * 255 : 128
    this.baseDirty = true
    this.usedDotSize = -1
    this.orderDirty = true
    this.resortAccum = 0

    if (this.cbs.onStats) this.cbs.onStats(dots.length)
  }

  /* ---------- 静态层 ---------- */
  _computeRadii() {
    const baseR = Math.max(0.8, this.cell * 0.5 * this.opts.dotSize)
    for (let i = 0; i < this.dots.length; i++) {
      const d = this.dots[i]
      d.r = Math.max(0.8, baseR * d.sizeK)
    }
    this.usedDotSize = this.opts.dotSize
  }

  _buildBase() {
    const ctx = this.bctx
    this._computeRadii()
    ctx.clearRect(0, 0, this.width, this.height)

    const groups = this.groups
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi]
      const list = g.list
      let has = false
      ctx.beginPath()
      for (let j = 0; j < list.length; j++) {
        const d = list[j]
        if (!d.cap) {
          ctx.moveTo(d.x + d.r, d.y)
          ctx.arc(d.x, d.y, d.r, 0, TAU)
          has = true
        }
      }
      if (has) {
        ctx.fillStyle = g.color
        ctx.fill()
      }
    }
    this.baseDirty = false
  }

  /* ---------- 捕获状态 ---------- */
  _scanCaptured() {
    // 鼠标不在区域内、且没有点被捕获时，什么都不用做（静止时空转的优化）
    const on = this.mouseOn
    if (!on && this.captured.length === 0) return false

    // 用点的原始位置判断是否进入捕获半径，保证边界行为稳定
    const capR = this.opts.captureR
    const r2 = capR * capR
    const mx = this.mouseX
    const my = this.mouseY
    const dots = this.dots
    const captured = this.captured
    captured.length = 0

    let transitions = 0
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i]
      const inside = on && dist2(d.x, d.y, mx, my) <= r2
      if (d.cap !== inside) {
        d.cap = inside
        transitions++
      }
      if (inside) captured.push(d)
    }
    return transitions > 0
  }

  /* ---------- 按颜色连续排序并分配环上角度 ---------- */
  _sortAndAssignRing(captured) {
    // 按 Morton 索引升序：得到一条颜色连续过渡的色带，
    // 然后顺序铺满整个圆环（接缝处会有一次由最深色回到最浅色的跳变）
    captured.sort((A, B) => A.key - B.key)
    const n = captured.length
    const stepA = TAU / n
    for (let i = 0; i < n; i++) captured[i].ringTargetA = stepA * (i + 0.5)
  }

  /* ---------- 逐帧 ---------- */
  _tick(t) {
    this._raf = requestAnimationFrame((tt) => this._tick(tt))
    const dt = this._lastT ? Math.min(0.05, (t - this._lastT) / 1000) : 0.016
    this._lastT = t
    this._step(dt)
  }

  _step(dt) {
    if (!this.source || this.width < 2 || this.height < 2) return

    // 1) 源图 / 尺寸 / 密度变化 → 重建点阵
    const colsTarget = Math.round(this.opts.cols || 200)
    let rebuilt = false
    if (
      this.dirty ||
      colsTarget !== this.lastCols ||
      this.lastW !== this.width ||
      this.lastH !== this.height
    ) {
      this.lastCols = colsTarget
      this.lastW = this.width
      this.lastH = this.height
      this.dirty = false
      this._buildDots(colsTarget)
      rebuilt = true
    }

    // 2) 点大小变化不需要重新采样，只需重绘静态层
    if (Math.abs(this.opts.dotSize - this.usedDotSize) > 1e-4) this.baseDirty = true

    // 3) 更新捕获成员（点是否处于鼠标半径内）
    const capturedChanged = this._scanCaptured()
    if (capturedChanged) this.orderDirty = true

    // 4) 每隔 1 秒重排一次环上的点
    this.resortAccum += dt
    if (this.resortAccum >= 1) {
      this.resortAccum -= 1
      if (this.captured.length) this.orderDirty = true
    }

    if (capturedChanged) this.baseDirty = true
    const mouseStateChanged = this.mouseOn !== this.mouseWasOn
    if (this.baseDirty) this._buildBase()

    // 5) 被捕获的点：按颜色连续排序后均匀排布到鼠标圆环上
    const captured = this.captured
    const mx = this.mouseX
    const my = this.mouseY
    let moving = captured.length > 0

    if (captured.length && this.mouseOn) {
      // 排序只在这里发生：捕获集合变化时、以及每秒一次的定时重排时
      if (this.orderDirty) {
        this._sortAndAssignRing(captured)
        this.orderDirty = false
      }
      const ringR = this.opts.ringR
      const k = 1 - Math.exp(-dt * 9)

      for (let i = 0; i < captured.length; i++) {
        const d = captured[i]
        const targetA = d.ringTargetA
        const tx = mx + ringR * Math.cos(targetA)
        const ty = my + ringR * Math.sin(targetA)
        d.px += (tx - d.px) * k
        d.py += (ty - d.py) * k
      }
    }

    // 6) 未被捕获的点飞回原位
    const backK = 1 - Math.exp(-dt * 7)
    const dots = this.dots
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i]
      if (!d.cap) {
        if (Math.abs(d.px - d.x) > 0.02 || Math.abs(d.py - d.y) > 0.02) {
          moving = true
          d.px += (d.x - d.px) * backK
          d.py += (d.y - d.py) * backK
        } else {
          d.px = d.x
          d.py = d.y
        }
      }
    }

    // 7) 真正绘制（没有变化就跳过，避免空转）
    this.mouseWasOn = this.mouseOn
    // 注意 rebuilt：换图（比如切换深浅主题）后静态层是新画的，
    // 但最终画布上还是旧像素，必须补一次合成，否则点阵不更新
    if (
      this.hasPainted &&
      !rebuilt &&
      !moving &&
      !capturedChanged &&
      !mouseStateChanged &&
      !this.baseDirty
    ) {
      return
    }

    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.drawImage(this.base, 0, 0, this.width, this.height)

    // 环上的点同样按颜色分组绘制
    const bins = this.bins
    const groups = this.groups
    for (let gi = 0; gi < bins.length; gi++) bins[gi].length = 0
    for (let i = 0; i < captured.length; i++) {
      const d = captured[i]
      bins[d.gi].push(d)
    }

    for (let gi = 0; gi < groups.length; gi++) {
      const bin = bins[gi]
      if (!bin.length) continue
      const g = groups[gi]
      ctx.fillStyle = g.color
      ctx.beginPath()
      for (let j = 0; j < bin.length; j++) {
        const d = bin[j]
        ctx.moveTo(d.px + d.r, d.py)
        ctx.arc(d.px, d.py, d.r, 0, TAU)
      }
      ctx.fill()
    }

    this.hasPainted = true
  }
}

export default DotMatrixEffect
