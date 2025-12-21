<script setup>
import { ref } from 'vue'
import ArticleCard from '../components/ArticleCard.vue' // 引入新写的卡片
import MarkdownIt from 'markdown-it'
import fm from 'front-matter'

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

// 1. 读取 src/articles 下的文件
const mdFiles = import.meta.glob('../articles/*.md', { 
  query: '?raw', 
  import: 'default', 
  eager: true 
})

const allArticles = ref([])

for (const path in mdFiles) {
  try {
    const { attributes, body } = fm(mdFiles[path])
    allArticles.value.push({
      ...attributes,
      renderedHtml: md.render(body)
    })
  } catch (e) { console.error(e) }
}

// 排序：按日期倒序 (最新的在上面)
// 假设日期格式是 "2025-12-20"
allArticles.value.sort((a, b) => new Date(b.date) - new Date(a.date))

// --- 交互 ---
const selectedArticle = ref(null)
const openArticle = (item) => selectedArticle.value = item
const closeArticle = () => selectedArticle.value = null
</script>

<template>
  <div class="articles-container">
    <Transition name="fade-slide" mode="out-in">
      
      <div v-if="!selectedArticle" class="article-list">
        <ArticleCard 
          v-for="item in allArticles" 
          :key="item.title" 
          :article="item"
          @click="openArticle(item)"
        />
        
        <div v-if="allArticles.length === 0" class="empty-tip">
          📭 暂无文章，请在 src/articles/ 下创建 .md 文件
        </div>
      </div>

      <div v-else class="article-detail">
        <button class="back-btn" @click="closeArticle">← 返回文章列表</button>
        
        <div class="paper-content">
          <header class="article-header">
            <h1>{{ selectedArticle.title }}</h1>
            <div class="meta">
              <span>📅 {{ selectedArticle.date }}</span>
              <span v-if="selectedArticle.tags">🏷️ {{ selectedArticle.tags.join(', ') }}</span>
            </div>
          </header>

          <hr class="divider" />
          
          <div class="markdown-body" v-html="selectedArticle.renderedHtml"></div>
        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
.articles-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

/* 列表布局：垂直排列，带间距 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 卡片之间的距离 */
  padding-bottom: 50px;
  max-width: 900px; /* 限制列表最大宽度，太宽了不好看 */
  margin: 0 auto;   /* 居中 */
  width: 100%;
}

.empty-tip { text-align: center; color: #fff; margin-top: 50px; }

/* 详情页样式 */
.article-detail {
  width: 100%;
  max-width: 800px; /* 文章详情页稍微窄一点，利于阅读 */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
}

.back-btn {
  align-self: flex-start;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.2);
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}
.back-btn:hover { background: #42b883; }

/* 仿纸张效果的容器 */
.paper-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  color: #333;
}

.article-header h1 { margin: 0 0 15px 0; font-size: 2.2rem; color: #2c3e50; }
.meta { color: #888; font-size: 0.9rem; display: flex; gap: 20px; }
.divider { border: 0; height: 1px; background: #eee; margin: 30px 0; }

/* 动画 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); } /* 垂直位移 */
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }

/* Markdown 样式复用 */
:deep(.markdown-body) { line-height: 1.8; font-size: 1.05rem; color: #2c3e50; }
:deep(.markdown-body h2) { font-size: 1.5rem; margin: 30px 0 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
:deep(.markdown-body p) { margin-bottom: 18px; text-align: justify; }
:deep(.markdown-body code) { background: #f4f4f4; padding: 2px 5px; border-radius: 4px; color: #c0392b; }
:deep(.markdown-body img) { max-width: 100%; border-radius: 8px; display: block; margin: 20px auto; }
:deep(.markdown-body blockquote) { border-left: 4px solid #42b883; background: #f9f9f9; margin: 20px 0; padding: 10px 20px; color: #666; }
/* --- 针对 figure 组合的样式 --- */

/* 1. 让整个组合块居中，并留出上下间距 */
:deep(.markdown-body figure) {
  margin: 30px 0;
  text-align: center; /* 让图片和文字都居中 */
  display: block;
}

/* 2. 针对 figure 里面的 img */
:deep(.markdown-body figure img) {
  /* 你的 width="50%" 会生效，但这里可以设置个最大宽度兜底 */
  max-width: 100%; 
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 10px; /* 图片和文字之间的距离 */
}

/* 3. ⭐ 核心：针对备注文字 (figcaption) 的样式 */
:deep(.markdown-body figcaption) {
  font-size: 0.9rem;       /* 字号小一点 */
  color: #888;             /* 颜色灰一点 */
  font-style: italic;      /* 斜体，更有“备注”的感觉 */
  line-height: 1.5;
  margin-top: 5px;
}
</style>