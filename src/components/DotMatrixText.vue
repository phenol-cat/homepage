<script setup>
/**
 * DotMatrixText.vue — 点阵字
 *
 * 思路：不直接显示文字，而是先把文字画到一张离屏画布上，
 * 再交给 DotMatrixEffect 采样成点阵。鼠标划过时，
 * 附近半径内的点会被吸到光标周围的圆环上（磁环效果）。
 *
 * 几个关键设计：
 * 1. 字号、字重、字体从 CSS 继承 —— 父元素怎么写样式，点阵字就长什么样；
 *    颜色默认跟随全站的 --text-primary（也可以用 --dot-text-color 覆盖），
 *    深浅主题切换时会自动重画；
 * 2. 点间距不用固定像素，而是按"字形高度方向上有几个点"来算，
 *    所以标题在手机上被缩小后，点阵密度依然保持一致，字不会糊掉；
 * 3. 真实文字保留在一个视觉隐藏的 span 里，读屏软件和搜索引擎拿到的仍是正常文本。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DotMatrixEffect from '../lib/dotRingEffect'

const props = defineProps({
  text: { type: String, required: true },
  /** 字形高度方向上的点阵行数：越小越"点阵"、越大越接近普通文字 */
  dotRows: { type: Number, default: 20 },
  /** 点的大小系数 */
  dotSize: { type: Number, default: 0.92 },
  /** 鼠标捕获半径：进入这个范围的点会被吸走 */
  captureR: { type: Number, default: 130 },
  /** 圆环半径：被吸走的点最终排在这个半径的圆上 */
  ringR: { type: Number, default: 54 },
  /** 是否启用磁环交互 */
  interactive: { type: Boolean, default: true }
})

const hostEl = ref(null)
const canvasEl = ref(null)

let fx = null
let resizeObserver = null
let themeObserver = null
let intersectionObserver = null
let still = false // 是否需要保持静止（用户关闭了动画效果）

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 读取当前应该用的文字颜色。
 *
 * 这里有个容易踩的坑：不能直接读计算样式里的 color。
 * 全站给文字加了 0.3s 的颜色过渡，而且宿主元素的 color 是从标题那里"继承"来的，
 * 所以主题切换的一瞬间读到的是过渡途中的中间色 —— 点阵会被画成上一种主题的颜色，
 * 并且因为之后没有别的事件触发重绘，它就永久错在那里了。
 *
 * 自定义属性（CSS 变量）不参与过渡，读它就能立刻拿到目标色。
 * 默认复用全站的文字色变量，也可以用 --dot-text-color 单独指定。
 */
function readTextColor() {
  const cs = getComputedStyle(hostEl.value)
  return (
    cs.getPropertyValue('--dot-text-color').trim() ||
    cs.getPropertyValue('--text-primary').trim() ||
    cs.color
  )
}

/** 把文字画成一张与容器等大的透明画布，超出宽度时自动缩小字号 */
function paintText(width, height) {
  const cs = getComputedStyle(hostEl.value)
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const weight = cs.fontWeight
  const family = cs.fontFamily
  const cssSize = parseFloat(cs.fontSize) || 40
  const color = readTextColor()
  const cssSpacing = parseFloat(cs.letterSpacing) || 0

  const cv = document.createElement('canvas')
  cv.width = Math.max(1, Math.round(width * dpr))
  cv.height = Math.max(1, Math.round(height * dpr))
  const ctx = cv.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  // 逐字绘制：canvas 的 fillText 不支持 letter-spacing，
  // 自己按字符推进才能让点阵字和 CSS 里写的字间距一致
  const chars = Array.from(props.text)
  const applyFont = (size) => {
    ctx.font = `${weight} ${size}px ${family}`
  }
  const measure = (size, spacing) => {
    applyFont(size)
    let total = 0
    for (const ch of chars) total += ctx.measureText(ch).width
    return total + spacing * Math.max(0, chars.length - 1)
  }

  // 先按 CSS 里的字号量一次，太宽就整体等比缩小（含字间距），
  // 避免窄屏把标题撑出容器
  const avail = Math.max(40, width - 24)
  let size = cssSize
  let spacing = cssSpacing
  const raw = measure(size, spacing) || 1
  if (raw > avail) {
    const k = avail / raw
    size *= k
    spacing *= k
  }

  const totalWidth = measure(size, spacing)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color

  let x = (width - totalWidth) / 2
  const y = height / 2
  for (const ch of chars) {
    ctx.fillText(ch, x, y)
    x += ctx.measureText(ch).width + spacing
  }

  return { canvas: cv, size }
}

function render() {
  if (!hostEl.value || !canvasEl.value) return
  const w = hostEl.value.clientWidth
  const h = hostEl.value.clientHeight
  if (w < 2 || h < 2) return

  const { canvas, size } = paintText(w, h)
  // 点间距由字号决定：字号 / 行数，保证任何尺寸下点阵密度都一致
  const pitch = Math.max(1, size / props.dotRows)
  const cols = Math.round(w / pitch)

  // 圆环半径不超过容器一半高度，否则环会被上下裁掉
  const ringR = Math.min(props.ringR, Math.max(20, h / 2 - 8))
  const captureR = Math.max(ringR + 24, props.captureR)

  if (!fx) {
    still = !props.interactive || prefersReducedMotion()
    fx = new DotMatrixEffect(
      hostEl.value,
      canvasEl.value,
      {
        cols,
        dotSize: props.dotSize,
        captureR,
        ringR,
        maxDots: 32000,
        maxCols: 520
      }
    )
    fx.setSource(canvas)
    if (still) fx.renderStatic()
    else fx.start()
    return
  }

  fx.opts.cols = cols
  fx.opts.dotSize = props.dotSize
  fx.opts.captureR = captureR
  fx.opts.ringR = ringR
  fx.setSource(canvas)
  if (still) fx.renderStatic()
}

onMounted(() => {
  render()

  // 容器尺寸变化（窗口缩放、侧边栏折叠等）
  resizeObserver = new ResizeObserver(() => render())
  resizeObserver.observe(hostEl.value)

  // 主题切换时文字颜色变了，需要重画面布
  themeObserver = new MutationObserver(() => render())
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  // 字体真正加载完成后字形宽度会变，需要按最终字形重新排一次
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => render())
  }

  // 只要能看到才跑动画：滚出视口就暂停渲染循环，不在看不见的地方空转
  if (fx && !still) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fx.start()
        else fx.pause()
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(hostEl.value)
  }
})

onBeforeUnmount(() => {
  if (fx) {
    fx.dispose()
    fx = null
  }
  if (resizeObserver) resizeObserver.disconnect()
  if (themeObserver) themeObserver.disconnect()
  if (intersectionObserver) intersectionObserver.disconnect()
})
</script>

<template>
  <span ref="hostEl" class="dot-text">
    <canvas ref="canvasEl" class="dot-text__canvas" aria-hidden="true"></canvas>
    <span class="sr-only">{{ text }}</span>
  </span>
</template>

<style scoped>
.dot-text {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;

  /* 宿主本身不显示文字（文字画在 canvas 上），颜色过渡对它没有意义，
     关掉可以少一点无谓的样式计算 */
  transition: none;
}

.dot-text__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  /* 画布只负责显示，鼠标事件交给外层容器统一处理 */
  pointer-events: none;
}
</style>
