<script setup>
  // 定义 props：接收当前选中的是哪个 tab，以及一个切换函数
  defineProps({
    activeTab: String
  })
  
  // 定义事件：告诉父组件“我被点击了”
  const emit = defineEmits(['change-tab'])

  const menuItems = [
    { id: 'about' ,   label: '🍭 关于我' },
    { id: 'projects', label: '🍔 项目展示' },
    { id: 'articles', label: '🍖 学习笔记' },
    { id: 'friends',  label: '💕 友情链接'}
  ]
</script>

<template>
  <nav class="menu-list">
    <button 
      v-for="item in menuItems" 
      :key="item.id"
      :class="{ active: activeTab === item.id }"
      @click="emit('change-tab', item.id)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  background: var(--glass-bg);
  padding: 15px;
  border-radius: 12px;
}

button {
  /* 布局 */
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  border-radius: 8px;
  
  /* 字体 */
  font-size: 1rem;
  color: var(--text-primary);
  
  /* 样式重置 */
  background: transparent;
  border: none;
  cursor: pointer;
  
  /* 只保留颜色的过渡，去掉位置移动 */
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: var(--glass-bg);
}

/* 选中状态的高亮样式 */
button.active {
  background-color: #42b883;
  color: white;
  font-weight: bold;
}
</style>