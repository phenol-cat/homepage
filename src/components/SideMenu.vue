<script setup>
  import SvgIcon from './SvgIcon.vue'

  // 定义 props：接收当前选中的是哪个 tab，以及一个切换函数
  defineProps({
    activeTab: String
  })
  
  // 定义事件：告诉父组件“我被点击了”
  const emit = defineEmits(['change-tab'])

  const menuItems = [
    { id: 'about',    label: '关于我',   icon: 'user' },
    { id: 'projects', label: '项目展示', icon: 'code' },
    { id: 'articles', label: '学习笔记', icon: 'book' },
    { id: 'friends',  label: '友情链接', icon: 'users' }
  ]
</script>

<template>
  <nav class="menu-list">
    <button 
      v-for="item in menuItems" 
      :key="item.id"
      type="button"
      :class="{ active: activeTab === item.id }"
      :aria-current="activeTab === item.id ? 'page' : undefined"
      @click="emit('change-tab', item.id)"
    >
      <SvgIcon :name="item.icon" :size="18" />
      <span class="label">{{ item.label }}</span>
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

  /* 图标与文字横向排列 */
  display: flex;
  align-items: center;
  gap: 12px;
  
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

.label { line-height: 1; }

button:hover {
  /* 原来用的是和菜单容器同样的背景色，悬停时几乎看不出变化 */
  background-color: var(--glass-bg-hover);
}

/* 选中状态的高亮样式 */
button.active {
  background-color: #42b883;
  color: white;
  font-weight: bold;
}
</style>
