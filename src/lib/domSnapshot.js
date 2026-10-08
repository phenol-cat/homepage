/**
 * domSnapshot.js — 把一段真实的 DOM 拍成一张画布
 *
 * 为什么需要它：
 * 点阵特效的输入是一张"图像"。文字可以自己画到画布上，
 * 但任意 Vue 组件是 DOM（flex 布局、圆角、图片……），浏览器没有直接
 * "把元素变成画布"的接口。这里用的是业界通用的做法（html2canvas /
 * dom-to-image 同一思路）：
 *
 *   克隆 DOM → 把计算样式内联 → 图片转成内嵌数据
 *   → 塞进 <svg><foreignObject> → 当成图片画到 canvas 上
 *
 * 几个必须处理的坑：
 * 1. 样式表不会跟着走。SVG 作为图片渲染时读不到页面里的 CSS，
 *    所以每个元素的计算样式都必须内联成 style 属性；
 * 2. 外部图片不会加载。foreignObject 里如果还是 http(s) 地址的 <img>，
 *    渲染时是空白，必须先把图片转成 data URL 内嵌进去；
 * 3. 不能带背景和阴影。我们想要的是"卡片内容变成点阵"，
 *    如果连卡片底色一起采样，会得到一整片实心点，反而看不出东西。
 */

/** 需要从计算样式里搬运的属性（刻意不包含 background / box-shadow / border） */
const INLINE_PROPS = [
  // 布局
  'display',
  'position',
  'box-sizing',
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'margin',
  'padding',
  'flex',
  'flex-direction',
  'flex-wrap',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'align-items',
  'align-self',
  'justify-content',
  'gap',
  'row-gap',
  'column-gap',
  'order',
  // 文字
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-align',
  'text-transform',
  'text-decoration-line',
  'white-space',
  'word-break',
  'overflow-wrap',
  'vertical-align',
  'color',
  // 形状
  'border-radius',
  'overflow',
  'object-fit',
  'object-position',
  'opacity',
  'transform',
  'transform-origin',
  'list-style'
]

/** 这些标签不参与快照 */
const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'LINK',
  'META',
  'NOSCRIPT',
  'TEMPLATE',
  'IFRAME',
  'CANVAS',
  'VIDEO',
  'AUDIO'
])

/**
 * 把带透明度的颜色转成不透明（只改 alpha，保留原来的深浅）。
 * 支持 rgb()/rgba() 和 #rrggbbaa，其余格式原样返回。
 */
function toOpaque(color) {
  const value = (color || '').trim()
  if (!value) return ''

  const rgba = value.match(/^rgba?\(([^)]+)\)$/i)
  if (rgba) {
    const parts = rgba[1].split(/[,/\s]+/).filter(Boolean)
    if (parts.length >= 3) {
      return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`
    }
  }

  const hex = value.match(/^#([0-9a-f]{8})$/i)
  if (hex) return `#${hex[1].slice(0, 6)}`

  return value
}

/** 把 <img> 的地址换成内嵌的 data URL */
async function inlineImage(img) {
  const src = img.getAttribute('src')
  if (!src || src.startsWith('data:')) return
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    img.setAttribute('src', dataUrl)
  } catch (e) {
    // 拿不到图片（跨域、404）就退化成空白，不让整个快照失败
    console.warn('[domSnapshot] 图片内嵌失败，已跳过:', src, e)
  }
}

/**
 * 递归克隆元素，并把计算样式内联到克隆体的 style 上。
 * 返回克隆后的根节点（图片都已经是 data URL）。
 */
async function cloneWithInlineStyles(source, opts) {
  const clone = source.cloneNode(false)

  if (source.nodeType === Node.TEXT_NODE) return clone
  if (source.nodeType !== Node.ELEMENT_NODE) return null
  if (SKIP_TAGS.has(source.tagName)) return null

  const cs = getComputedStyle(source)
  const style = []
  for (const prop of INLINE_PROPS) {
    const value = cs.getPropertyValue(prop)
    if (value && value !== 'normal' && value !== 'none' && value !== 'auto') {
      style.push(`${prop}:${value}`)
    }
  }
  // 需要保留底色的场景（比如想让卡片本身也变成点阵）
  if (opts.keepBackground) {
    const bg = cs.getPropertyValue('background-color')
    // ⭐ 关键：把背景色拍成不透明。
    // 站里的卡片用的是半透明玻璃色（如 rgba(0,0,0,0.6)），
    // 如果原样采样，得到的是一层半透明暗点，叠在明亮背景图上几乎看不见。
    // 去掉透明度后，卡片才会变成一块有明确轮廓的点阵面板，内容也才衬得出来。
    const opaque = bg && bg !== 'rgba(0, 0, 0, 0)' ? toOpaque(bg) : ''
    if (opaque) style.push(`background-color:${opaque}`)
  }
  clone.setAttribute('style', style.join(';'))

  if (clone.tagName === 'IMG') await inlineImage(clone)

  const children = []
  for (const child of source.childNodes) {
    const clonedChild = await cloneWithInlineStyles(child, opts)
    if (clonedChild) children.push(clonedChild)
  }
  for (const child of children) clone.appendChild(child)

  return clone
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('SVG 快照加载失败'))
    img.src = src
  })
}

/**
 * 快照期间临时冻结整棵子树的过渡动画。
 *
 * 为什么必须这么做：站里的卡片带 `transition: all 0.3s`，
 * 主题切换时背景色/文字色都在过渡中。此时读到的计算样式是"中间色"
 * （实测会拍成 rgba(247,247,247,.7) 这种半深不浅的颜色），
 * 点阵化出来的卡片颜色就是错的，而且不会自己恢复。
 * 关掉过渡后计算样式会立刻跳到终值，拍完再还原。
 */
function freezeTransitions(root) {
  const touched = []
  const walk = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const prev = node.style.transition
    if (prev !== 'none') {
      node.style.transition = 'none'
      touched.push([node, prev])
    }
    for (const child of node.children) walk(child)
  }
  walk(root)
  // 强制一次样式重算，让正在跑的过渡立即跳到终值
  void root.offsetHeight

  return () => {
    for (const [node, prev] of touched) node.style.transition = prev
  }
}

/**
 * 把元素拍成一张 canvas 快照。
 *
 * @param {HTMLElement} el 目标元素
 * @param {object} opts
 *   - scale           渲染倍率，默认 2（保证点阵采样时有足够细节）
 *   - keepBackground  是否保留背景色，默认 false
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function elementToCanvas(el, opts = {}) {
  const scale = opts.scale || 2
  // 用布局尺寸而不是 getBoundingClientRect：
  // 后者会把祖先元素上的 transform（比如卡片悬停放大的 scale）算进去，
  // 导致快照比真实内容大一圈、点阵和内容对不齐。
  const width = Math.max(1, el.offsetWidth || Math.round(el.getBoundingClientRect().width))
  const height = Math.max(1, el.offsetHeight || Math.round(el.getBoundingClientRect().height))

  const restoreTransitions = freezeTransitions(el)
  let clone
  try {
    clone = await cloneWithInlineStyles(el, { keepBackground: !!opts.keepBackground })
  } finally {
    restoreTransitions()
  }
  if (!clone) throw new Error('该元素无法生成快照')

  // 根节点给定尺寸，forceLayout 后 foreignObject 才能正确排版
  clone.setAttribute('style', `${clone.getAttribute('style')};width:${width}px;height:${height}px`)

  // ⭐ 必须用 XMLSerializer 而不是 outerHTML：
  // outerHTML 是 HTML 序列化，<img> 这类空元素不会自闭合（写成 <img ...>），
  // 而 SVG 当图片加载时要求是严格合法的 XML，一个未闭合标签就会导致整个快照加载失败。
  // XMLSerializer 会输出 <img ... /> 并补上命名空间声明。
  const serialized = new XMLSerializer().serializeToString(clone)

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
    serialized +
    `</foreignObject></svg>`

  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  const image = await loadImage(url)

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.drawImage(image, 0, 0, width, height)
  return canvas
}

export default elementToCanvas
