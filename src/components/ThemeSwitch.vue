<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SvgIcon from './SvgIcon.vue'

const isDark = ref(false)

// 系统是否处于深色模式（当用户没有手动选择过主题时，跟随系统）
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

function applyTheme(dark) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
}

// 切换逻辑
const toggleTheme = () => {
  applyTheme(!isDark.value)
  // 一旦用户手动切换过，就记住这个选择，不再跟随系统
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 系统主题发生变化时的回调：只有用户没手动设置过，才跟着系统走
function handleSystemChange(e) {
  if (!localStorage.getItem('theme')) applyTheme(e.matches)
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  applyTheme(saved === 'dark' || (!saved && systemDark.matches))
  systemDark.addEventListener('change', handleSystemChange)
})

onUnmounted(() => systemDark.removeEventListener('change', handleSystemChange))
</script>

<template>
  <button
    class="theme-btn"
    type="button"
    @click="toggleTheme"
    :title="isDark ? '切换到浅色主题' : '切换到深色主题'"
    :aria-label="isDark ? '切换到浅色主题' : '切换到深色主题'"
    :aria-pressed="isDark"
  >
    <SvgIcon :name="isDark ? 'moon' : 'sun'" :size="20" />
  </button>
</template>

<style scoped>
.theme-btn {
  /* 使用变量，这样按钮自己也会随主题变色 */
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 10px var(--glass-shadow);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  /* 图标颜色跟随主题文字色 */
  color: var(--text-primary);
  width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s;
}
.theme-btn:hover { transform: scale(1.1); background: var(--glass-border); }
</style>
