<script setup>
  import SvgIcon from './SvgIcon.vue'

  // 定义 props：
  // activeTab 当前选中的 tab
  // collapsed 收起模式：只显示图标，隐藏文字（用于侧边栏收起后的窄轨）
  defineProps({
    activeTab: String,
    collapsed: { type: Boolean, default: false }
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
  <nav class="menu-list" :class="{ 'menu-list--compact': collapsed }">
    <button 
      v-for="item in menuItems" 
      :key="item.id"
      type="button"
      :class="{ active: activeTab === item.id }"
      :aria-current="activeTab === item.id ? 'page' : undefined"
      :aria-label="item.label"
      :title="collapsed ? item.label : undefined"
      @click="emit('change-tab', item.id)"
    >
      <SvgIcon :name="item.icon" :size="18" />
      <span v-if="!collapsed" class="label">{{ item.label }}</span>
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

/* --- 收起模式：保留磨砂底，只把文字去掉、让图标居中 ---
   底色 / 边框沿用 .menu-list 原本的玻璃变量，收起后依然是一块磨砂面板，
   只是内容从"图标 + 文字"变成"只有图标"。
   尺寸用父级量出来的展开态数值（CSS 变量），保证收起前后上下完全对齐。 */
.menu-list--compact {
  /* 撑满窄轨宽度：父容器是 align-items:center 的列布局，
     不写宽度的话面板会缩成刚好包住按钮，比上面的头像卡片窄一截 */
  width: 100%;
  /* 间距改由父容器的 gap 控制；这里若留着基础样式的 margin-top: 20px，
     总高会超出可用空间，flex 会把面板压扁，收起前后就对不齐了 */
  margin-top: 0;
  flex: none;
  padding: var(--rail-menu-pad, 15px) 0;
  gap: var(--rail-menu-gap, 10px);
}

.menu-list--compact button {
  width: var(--rail-btn-h, 44px);
  height: var(--rail-btn-h, 44px);
  padding: 0;
  margin: 0 auto;
  justify-content: center;
  border-radius: 12px;
}

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
