<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="article-card">
    
    <div class="date-box">
      <span class="day">{{ article.date.split('-')[2] || 'DD' }}</span>
      <span class="month">{{ article.date.split('-')[1] || 'MM' }}</span>
      <span class="year">{{ article.date.split('-')[0] || 'YYYY' }}</span>
    </div>

    <div class="info-box">
      <h3 class="title">{{ article.title }}</h3>
      <p class="desc">{{ article.desc }}</p>
      
      <div class="tags" v-if="article.tags">
        <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
      </div>
    </div>

    <div class="arrow-box">
      →
    </div>

  </div>
</template>

<style scoped>
.article-card {
  display: flex;
  align-items: center;
  /* 横板布局关键 */
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  padding: 20px 30px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0; /* 由父容器控制间距 */
}

/* 悬停效果：背景变白，整体稍微右移，阴影加深 */
.article-card:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateX(10px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
}

/* --- 左侧日期 --- */
.date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  min-width: 60px;
  color: #999;
  font-family: monospace; /* 等宽字体很有极客感 */
  border-right: 2px solid rgba(0,0,0,0.05);
  padding-right: 20px;
}

.day { font-size: 1.5rem; font-weight: bold; color: #333; line-height: 1; }
.month { font-size: 0.9rem; }
.year { font-size: 0.8rem; opacity: 0.6; }

/* --- 中间信息 --- */
.info-box {
  flex: 1; /* 占满中间剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
}

.desc {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  
  /* 限制显示 2 行，多余省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  font-size: 0.8rem;
  color: #42b883; /* Vue 绿 */
  display: flex;
  gap: 10px;
}

/* --- 右侧箭头 --- */
.arrow-box {
  font-size: 1.5rem;
  color: #ddd;
  transition: all 0.3s;
  padding-left: 20px;
}

.article-card:hover .arrow-box {
  color: #42b883;
  transform: translateX(5px);
}
</style>