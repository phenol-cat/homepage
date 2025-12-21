<script setup>
  // 接收父组件传来的数据
  defineProps({
    project: {
      type: Object,
      required: true
    }
  })
</script>

<template>
  <div class="project-card">
    <div class="card-image">
      <img :src="project.image" :alt="project.title" loading="lazy" />
      <div class="overlay">
        <span class="view-text">查看详情</span>
      </div>
    </div>

    <div class="card-info">
      <div class="header-row">
        <h3 class="title">{{ project.title }}</h3>
        <span class="date">{{ project.date }}</span>
      </div>
      
      <p class="description">{{ project.desc }}</p>

      <div class="tags">
        <span 
          v-for="tag in project.techStack" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  /* --- 卡片基础样式 --- */
  
  /* 背景：使用玻璃变量 (白天白，晚上黑) */
  background: var(--glass-bg); 
  
  /* 边框：使用玻璃边框变量 */
  border: 1px solid var(--glass-border); 
  
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  /* 阴影：使用变量 */
  box-shadow: 0 4px 10px var(--glass-shadow); 
  
  display: flex;
  flex-direction: column;
}

/* 悬停效果：上浮 + 变亮 + 阴影加深 */
.project-card:hover {
  transform: translateY(-5px);
  
  /* ⭐ 核心恢复：使用玻璃边框变量作为背景 */
  /* 玻璃边框变量本质是 "半透明的白" */
  /* 在白天：它比默认背景更白 */
  /* 在黑夜：它在黑色背景上叠加一层白光，让卡片"点亮"，但文字依然清晰 */
  background: var(--glass-border); /* ⬅️ 恢复变亮逻辑 */
  
  /* 悬停阴影：加深 */
  box-shadow: 0 15px 30px var(--glass-shadow);
  
  /* 边框也跟着变亮一点 */
  border-color: var(--glass-border);
}

/* --- 图片区域 --- */
.card-image {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
  /* 加上底部分割线，防止图片和白色背景融为一体 */
  border-bottom: 1px solid var(--glass-border);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* 图片放大效果 */
.project-card:hover .card-image img {
  transform: scale(1.1);
}

/* 遮罩层文字 (保持不变，因为覆盖在图片上，永远黑底白字) */
.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex; justify-content: center; align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.view-text {
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
}

.project-card:hover .overlay {
  opacity: 1;
}

/* --- 信息区域 --- */
.card-info {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
  /* 变量化：主文字颜色 */
  color: var(--text-primary); 
  margin: 0;
}

.date {
  font-size: 0.8rem;
  /* 变量化：次要文字 */
  color: var(--text-secondary); 
}

.description {
  font-size: 0.9rem;
  /* 变量化：次要文字 */
  color: var(--text-secondary); 
  
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  /* 标签背景保持淡绿，黑白通用 */
  background: rgba(66, 184, 131, 0.1); 
  /* 标签文字高亮 */
  color: var(--text-highlight); 
  border-radius: 6px;
  font-weight: 600;
}
</style>