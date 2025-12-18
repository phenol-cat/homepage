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
  background: rgba(255, 255, 255, 0.8); /* 半透明白 */
  padding: 15px;
  border-radius: 12px;
}

button {
  background: transparent;
  border: none;
  padding: 12px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  color: #555;
}

button:hover {
  background-color: rgba(0,0,0,0.05);
}

/* 选中状态的高亮样式 */
button.active {
  background-color: #42b883;
  color: white;
  font-weight: bold;
}
</style>