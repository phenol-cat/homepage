<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

// 切换逻辑
const toggleTheme = () => {
  isDark.value = !isDark.value
  const html = document.documentElement
  
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 初始化逻辑
onMounted(() => {
  const saved = localStorage.getItem('theme')
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && sysDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <button class="theme-btn" @click="toggleTheme" title="切换主题">
    <span v-if="isDark">🌙</span>
    <span v-else>☀️</span>
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
  font-size: 1.2rem;
  width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s;
}
.theme-btn:hover { transform: scale(1.1); }
</style>