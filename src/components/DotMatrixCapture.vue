<script setup>
/**
 * DotMatrixCapture.vue — 给任意 Vue 组件套上点阵特效
 *
 * 用法：把想施法的内容放进默认插槽即可，插槽内容本身不用改一行代码。
 *
 *   <DotMatrixCapture>
 *     <UserProfile :name="..." :avatar="..." />
 *   </DotMatrixCapture>
 *
 * 工作原理：
 *   1. 用 domSnapshot 把插槽渲染出的真实 DOM 拍成一张画布；
 *   2. 把这张画布交给 DotMatrixEffect 采样成点阵；
 *   3. 原始内容和点阵画布叠在一起做交叉淡入淡出。
 *
 * 默认触发方式（mode='visible'）：只要元素出现在视口里就切成点阵，
 * 滚出视口则还原成普通显示，同时停掉渲染循环，不在看不见的地方空转。
 * 另外还有 'hover'（悬停时溶解、移开还原）和 'always'（一直点阵）两种模式。
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DotMatrixEffect from '../lib/dotRingEffect'
import { elementToCanvas } from '../lib/domSnapshot'

const props = defineProps({
  /** 点间距（CSS 像素）。越小越细腻，越大越"粗点阵" */
  pitch: { type: Number, default: 3 },
  /** 点的大小系数 */
  dotSize: { type: Number, default: 0.72 },
  /** 鼠标捕获半径 */
  captureR: { type: Number, default: 120 },
  /** 圆环半径 */
  ringR: { type: Number, default: 48 },
  /** 'visible' = 只要能看到就点阵化（默认）；'hover' = 悬停时；'always' = 一直 */
  mode: { type: String, default: 'visible' },
  /** 是否把背景色也一起采样（默认只采样内容，避免糊成一片实心点） */
  keepBackground: { type: Boolean, default: false },
  /** 关闭磁环交互（只保留静态点阵外观） */
  interactive: { type: Boolean, default: true }
})

const rootEl = ref(null)
const contentEl = ref(null)
const canvasEl = ref(null)

const hovering = ref(false)
const inView = ref(false) // 是否出现在视口里（mode='visible' 时用）
const enabled = ref(false) // 快照成功后才允许点阵化，避免拍失败时内容被藏起来
const active = computed(() => {
  if (!enabled.value) return false
  if (props.mode === 'always') return true
  if (props.mode === 'hover') return hovering.value
  return inView.value
})

let fx = null
let resizeObserver = null
let themeObserver = null
let contentObserver = null
let intersectionObserver = null
let snapshotTimer = 0
let still = false
let lastSize = ''

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 等插槽里的图片都加载完成，否则快照会拍到空白 */
function waitForImages(el) {
  const images = Array.from(el.querySelectorAll('img'))
  return Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
          })
    )
  )
}

/** 重建点阵：重新拍快照 → 交给特效 */
async function rebuild() {
  const content = contentEl.value && contentEl.value.firstElementChild
  if (!content || !canvasEl.value || !rootEl.value) return

  const w = content.offsetWidth
  const h = content.offsetHeight
  if (w < 4 || h < 4) return

  await waitForImages(content)
  if (document.fonts && document.fonts.ready) await document.fonts.ready

  let snapshot
  try {
    snapshot = await elementToCanvas(content, { keepBackground: props.keepBackground })
  } catch (e) {
    // 快照失败就安静地退回普通显示，不要因为特效把页面搞坏
    console.warn('[DotMatrixCapture] 快照失败，已退回普通显示:', e)
    enabled.value = false
    return
  }
  enabled.value = true

  const cols = Math.max(16, Math.round(w / props.pitch))
  // 圆环不能超出容器高度，否则会被画布裁掉半截
  const ringR = Math.min(props.ringR, Math.max(16, h / 2 - 6))
  const captureR = Math.max(ringR + 24, props.captureR)

  if (!fx) {
    still = !props.interactive || prefersReducedMotion()
    fx = new DotMatrixEffect(rootEl.value, canvasEl.value, {
      cols,
      dotSize: props.dotSize,
      captureR,
      ringR,
      maxDots: 40000,
      maxCols: 720
    })
    fx.setSource(snapshot)
    if (still) fx.renderStatic()
    else if (active.value) fx.start()
    return
  }

  fx.opts.cols = cols
  fx.opts.dotSize = props.dotSize
  fx.opts.captureR = captureR
  fx.opts.ringR = ringR
  fx.setSource(snapshot)
  if (still) fx.renderStatic()
}

// 只在需要的时候跑动画循环：hover 模式下鼠标不在卡片上就暂停，
// 免得组件挂在页面上一直空转（静止时虽然开销很小，但也没必要）
watch(active, (isActive) => {
  if (!fx || still) return
  if (isActive) fx.start()
  else fx.pause()
})

/** 尺寸变化 / 主题变化 / 内容变化都可能让快照过期，统一走防抖重建 */
function scheduleRebuild(delay = 120) {
  clearTimeout(snapshotTimer)
  snapshotTimer = setTimeout(rebuild, delay)
}

onMounted(async () => {
  await nextTick()
  scheduleRebuild(0)

  resizeObserver = new ResizeObserver((entries) => {
    const box = entries[0] && entries[0].contentRect
    if (!box) return
    const size = `${Math.round(box.width)}x${Math.round(box.height)}`
    // ResizeObserver 首次会立即触发一次，尺寸没变就不重复拍快照
    if (size === lastSize) return
    lastSize = size
    scheduleRebuild()
  })
  resizeObserver.observe(rootEl.value)

  // 深色 / 浅色主题切换后颜色变了，快照要重拍
  // 稍微等一会儿：卡片带 0.3s 颜色过渡，太早拍会拍到中间色
  // （domSnapshot 里也会临时冻结过渡兜底，这里是双保险）
  themeObserver = new MutationObserver(() => scheduleRebuild(380))
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  // 插槽内容变化（例如父组件的数据更新）也要重拍
  contentObserver = new MutationObserver(() => scheduleRebuild(200))
  if (contentEl.value) {
    contentObserver.observe(contentEl.value, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }

  // "只要能看到就激活点阵"：用 IntersectionObserver 盯着元素有没有出现在视口里。
  // threshold 为 0 表示哪怕只露出一点也算可见；滚出去就切回普通显示，
  // active 的变化会顺带把渲染循环暂停掉（见下面的 watch）。
  if (props.mode === 'visible') {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView.value = entries[0].isIntersecting
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(rootEl.value)
  }
})

onBeforeUnmount(() => {
  clearTimeout(snapshotTimer)
  if (fx) {
    fx.dispose()
    fx = null
  }
  if (resizeObserver) resizeObserver.disconnect()
  if (themeObserver) themeObserver.disconnect()
  if (contentObserver) contentObserver.disconnect()
  if (intersectionObserver) intersectionObserver.disconnect()
})
</script>

<template>
  <div
    ref="rootEl"
    class="dm"
    :class="{ 'dm--enabled': enabled, 'dm--active': active }"
    @pointerenter="hovering = true"
    @pointerleave="hovering = false"
  >
    <div ref="contentEl" class="dm__content">
      <slot />
    </div>
    <canvas ref="canvasEl" class="dm__canvas" aria-hidden="true"></canvas>
  </div>
</template>

<style scoped>
.dm {
  position: relative;
  display: block;
  width: 100%;
}

.dm__content {
  /* 只用透明度做交叉淡入：display:none 会让快照量不到尺寸 */
  transition: opacity 0.28s ease;
}

.dm__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  /* 画布只是"皮肤"，鼠标事件要穿透给容器统一处理 */
  pointer-events: none;
  transition: opacity 0.28s ease;
}

.dm--enabled.dm--active .dm__content {
  opacity: 0;
}

.dm--enabled.dm--active .dm__canvas {
  opacity: 1;
}
</style>
