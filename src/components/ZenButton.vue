<script setup>
defineProps({
  active: Boolean // 接收父组件传来的状态，决定显示“相框”还是“叉叉”
})
defineEmits(['click']) // 告诉父组件我被点了
</script>

<template>
  <button 
    class="zen-btn" 
    @click="$emit('click')" 
    :title="active ? '退出沉浸模式' : '进入沉浸模式'"
  >
    <span>{{ active ? '❌' : '🖼️' }}</span>
  </button>
</template>

<style scoped>
/* 直接复用 ThemeSwitch 的样式，保证双胞胎一样的外观 */
.zen-btn {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 10px var(--glass-shadow);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  font-size: 1.2rem;
  /* 确保宽高和 ThemeSwitch 一致 */
  width: 50px; 
  height: 50px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  transition: all 0.3s;
  
  /* 字体颜色跟随主题变量 */
  color: var(--text-primary);
}

.zen-btn:hover { 
  transform: scale(1.1); 
  background: var(--glass-border);
}
</style>