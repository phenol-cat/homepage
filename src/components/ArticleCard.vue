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
  width: 100%;
  
  /* 背景色使用变量 */
  background: var(--glass-bg); 
  backdrop-filter: blur(10px);
  padding: 20px 30px;
  border-radius: 12px;
  
  /* 边框颜色换成变量 (注意你原来的 glass--border 多写了个横杠，这里我修正为单杠) */
  border: 1px solid var(--glass-border); /* ⬅️ 修改 (修正拼写并确保变量一致) */
  
  /* 阴影颜色换成变量 */
  box-shadow: 0 4px 6px var(--glass-shadow); /* ⬅️ 修改 */
  
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0;
}

/* 悬停效果 */
.article-card:hover {
  /* 悬停背景：使用玻璃边框变量 (它通常是一个半透明的亮色)，或者定义一个新的 hover 变量 */
  /* 这里用 glass-border 代替纯白，能在黑夜模式下产生微微发光的效果 */
  background: var(--glass-border); /* ⬅️ 修改 */
  
  transform: translateX(10px);
  
  /* 悬停阴影也加深 */
  box-shadow: 0 8px 15px var(--glass-shadow); /* ⬅️ 修改 */
}

/* --- 左侧日期 --- */
.date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  min-width: 60px;
  
  /* 次要文字颜色 */
  color: var(--text-secondary); /* ⬅️ 修改 (原 #999) */
  
  font-family: monospace;
  
  /* 右边框颜色 */
  border-right: 2px solid var(--glass-border); /* ⬅️ 修改 (原 rgba...0.05) */
  
  padding-right: 20px;
}

.day { 
  font-size: 1.5rem; 
  font-weight: bold; 
  
  /* 主要文字颜色 */
  color: var(--text-primary); /* ⬅️ 修改 (原 #333) */
  
  line-height: 1; 
}

.month { font-size: 0.9rem; }
.year { font-size: 0.8rem; opacity: 0.6; }

/* --- 中间信息 --- */
.info-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  
  /* 主要文字颜色 */
  color: var(--text-primary); /* ⬅️ 修改 (原 #2c3e50) */
  
  font-weight: 600;
}

.desc {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  
  /* 次要文字颜色 */
  color: var(--text-secondary); /* ⬅️ 修改 (原 #666) */
  
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  font-size: 0.8rem;
  
  /* 高亮颜色 (Vue绿) */
  color: var(--text-highlight); /* ⬅️ 修改 (原 #42b883，也可以不改，因为绿色黑白通吃) */
  
  display: flex;
  gap: 10px;
}

/* --- 右侧箭头 --- */
.arrow-box {
  font-size: 1.5rem;
  
  /* 默认颜色：使用次要文字色，或者是玻璃边框色(很淡) */
  color: var(--text-secondary); /* ⬅️ 修改 (原 #ddd) */
  
  transition: all 0.3s;
  padding-left: 20px;
}

.article-card:hover .arrow-box {
  /* 悬停变色：Vue绿 */
  color: var(--text-highlight); /* ⬅️ 修改 (原 #42b883) */
  
  transform: translateX(5px);
}
</style>