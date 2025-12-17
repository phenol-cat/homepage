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
  /* 卡片基础样式 */
  background: rgba(255, 255, 255, 0.5); /* 半透明白 */
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  overflow: hidden; /* 保证图片圆角不溢出 */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  /* 初始阴影 */
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  
  display: flex;
  flex-direction: column;
}

/* 悬停效果：上浮 + 阴影加深 + 边框变亮 */
.project-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  border-color: rgba(255, 255, 255, 0.8);
}

/* --- 图片区域 --- */
.card-image {
  width: 100%;
  height: 160px; /* 固定高度，保证整齐 */
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例填充 */
  transition: transform 0.5s ease;
}

/* 图片放大效果 */
.project-card:hover .card-image img {
  transform: scale(1.1);
}

/* 遮罩层文字 */
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
  flex-grow: 1; /* 撑满剩余高度 */
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
  color: #333;
  margin: 0;
}

.date {
  font-size: 0.8rem;
  color: #888;
}

.description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
  
  /* 限制显示两行，多余的省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  margin-top: auto; /* 把标签推到底部 */
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: rgba(66, 184, 131, 0.1); /* Vue绿的浅色背景 */
  color: #42b883;
  border-radius: 6px;
  font-weight: 600;
}
</style>