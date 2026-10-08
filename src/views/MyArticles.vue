<script setup>
import { ref } from 'vue'
import ArticleCard from '../components/ArticleCard.vue' // 引入新写的卡片
import SvgIcon from '../components/SvgIcon.vue'
import MarkdownIt from 'markdown-it'
import fm from 'front-matter'

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

// 文章里的图片路径是按 "/homepage/..." 写的，这里统一替换成当前部署路径，
// 以后换仓库名只需要改 vite.config.js 里的 base，不用再逐篇改文章。
const base = import.meta.env.BASE_URL
const renderMarkdown = (body) => md.render(body).split('/homepage/').join(base)

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
      renderedHtml: renderMarkdown(body)
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
          <SvgIcon name="inbox" :size="32" />
          <span>暂无文章，请在 src/articles/ 下创建 .md 文件</span>
        </div>
      </div>

      <div v-else class="article-detail">
        <button class="back-btn" type="button" @click="closeArticle">
          <SvgIcon name="arrow-left" :size="16" />
          <span>返回文章列表</span>
        </button>
        
        <div class="paper-content">
          <header class="article-header">
            <h1>{{ selectedArticle.title }}</h1>
            <div class="meta">
              <span class="meta-item">
                <SvgIcon name="calendar" :size="15" />
                {{ selectedArticle.date }}
              </span>
              <span v-if="selectedArticle.tags" class="meta-item">
                <SvgIcon name="tag" :size="15" />
                {{ selectedArticle.tags.join(', ') }}
              </span>
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
/* =========================================
   1. 基础布局
   ========================================= */
.articles-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

/* 列表布局 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 50px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.empty-tip { 
  text-align: center; 
  /* 颜色变量化 */
  color: var(--text-secondary); 
  margin-top: 50px;
  /* 图标在上、文字在下，居中排列 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* =========================================
   2. 详情页样式
   ========================================= */
.article-detail {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
}

.back-btn {
  align-self: flex-start;
  margin-bottom: 20px;
  /* 背景换成玻璃边框色 (半透明白) */
  background: var(--glass-border); 
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  /* 文字颜色变量化 */
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;

  /* 图标与文字居中对齐 */
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover { 
  /* 悬停高亮 */
  background: var(--text-highlight); 
  color: #fff;
}

/* ⭐ 核心：仿纸张/玻璃容器 */
.paper-content {
  /* ❌ 原来是: background: rgba(255, 255, 255, 0.9); */
  /* ✅ 改为: 玻璃背景变量 (白天白，晚上黑) */
  background: var(--glass-bg);
  
  /* 加上边框，让夜间模式轮廓更清晰 */
  border: 1px solid var(--glass-border);
  
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 5px 20px var(--glass-shadow);
  
  /* 文字颜色变量化 */
  color: var(--text-primary);
  
  /* 添加过渡，切换时不生硬 */
  transition: all 0.3s ease;
}

.article-header h1 { 
  margin: 0 0 15px 0; 
  font-size: 2.2rem; 
  color: var(--text-primary); /* 变量 */
}

.meta { 
  color: var(--text-secondary); /* 变量 */
  font-size: 0.9rem; 
  display: flex; 
  gap: 20px; 
  flex-wrap: wrap;
}

/* 每个元信息（日期 / 标签）的图标与文字对齐 */
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.divider { 
  border: 0; 
  height: 1px; 
  /* 分割线变量 */
  background: var(--glass-border); 
  margin: 30px 0; 
}

/* =========================================
   3. 动画 (保持不变)
   ========================================= */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }

/* =========================================
   4. Markdown 样式复用 (与 ProjectCard 统一)
   ========================================= */
:deep(.markdown-body) { 
  line-height: 1.8; 
  font-size: 1.05rem; 
  color: var(--text-primary); /* 变量 */
}

:deep(.markdown-body h2) { 
  font-size: 1.5rem; 
  margin: 30px 0 15px; 
  border-bottom: 1px solid var(--glass-border); /* 变量 */
  padding-bottom: 10px; 
  color: var(--text-primary); /* 变量 */
}

:deep(.markdown-body p) { 
  margin-bottom: 18px; 
  text-align: justify; 
}

:deep(.markdown-body code) { 
  /* 通用半透明灰背景 */
  background: rgba(128, 128, 128, 0.15); 
  padding: 2px 5px; 
  border-radius: 4px; 
  color: #c0392b; /* 代码红色保留，夜间也清晰 */
}

/* 夜间模式微调代码颜色 */
:global(html.dark) :deep(.markdown-body code) {
  color: #ff7b72;
}

:deep(.markdown-body img) { 
  max-width: 100%; 
  border-radius: 8px; 
  display: block; 
  margin: 20px auto; 
  box-shadow: 0 4px 12px var(--glass-shadow); /* 变量 */
}

:deep(.markdown-body blockquote) { 
  border-left: 4px solid var(--text-highlight); 
  /* 引用块背景改为侧边栏同款半透明色 */
  background: var(--sidebar-bg); 
  margin: 20px 0; 
  padding: 10px 20px; 
  color: var(--text-secondary); /* 变量 */
}

/* --- Figure 组合样式 --- */
:deep(.markdown-body figure) {
  margin: 30px 0;
  text-align: center;
  display: block;
}

:deep(.markdown-body figure img) {
  max-width: 100%; 
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--glass-shadow); /* 变量 */
  margin-bottom: 10px;
}

:deep(.markdown-body figcaption) {
  font-size: 0.9rem;
  color: var(--text-secondary); /* 变量 */
  font-style: italic;
  line-height: 1.5;
  margin-top: 5px;
}
</style>
