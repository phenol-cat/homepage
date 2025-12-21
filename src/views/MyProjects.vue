<script setup>
import { ref } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import MarkdownIt from 'markdown-it'
import fm from 'front-matter' 

// 1. 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 2. 自动读取 .md 文件 (使用 front-matter)
const mdFiles = import.meta.glob('../projects/*.md', { 
  query: '?raw', 
  import: 'default', 
  eager: true 
})

const allProjects = ref([])

for (const path in mdFiles) {
  try {
    const rawContent = mdFiles[path]
    // 解析 Front-matter
    const { attributes, body } = fm(rawContent)
    
    allProjects.value.push({
      ...attributes, // 包含 id, title, image, tags 等
      renderedHtml: md.render(body) // 渲染正文
    })
  } catch (e) {
    console.error(`解析文件 ${path} 出错:`, e)
  }
}

// 排序：ID 大的在前面
allProjects.value.sort((a, b) => (b.id || 0) - (a.id || 0))

// --- 交互逻辑 ---
const selectedProject = ref(null)

function openProject(project) {
  selectedProject.value = project
}

function closeProject() {
  selectedProject.value = null
}
</script>

<template>
  <div class="projects-container">
    
    <Transition name="fade-slide" mode="out-in">
      
      <div v-if="!selectedProject" class="project-grid">
        <ProjectCard 
          v-for="project in allProjects" 
          :key="project.id" 
          :project="project"
          @click="openProject(project)"
        />
        
        <div v-if="allProjects.length === 0" class="empty-tip">
          还没有项目... 请在 src/projects/ 下添加 .md 文件
        </div>
      </div>

      <div v-else class="project-detail">
        <div class="detail-nav">
          <button class="back-btn" @click="closeProject">← 返回列表</button>
        </div>

        <div class="detail-content">
          <img v-if="selectedProject.image" :src="selectedProject.image" class="detail-cover" />
          
          <h1>{{ selectedProject.title }}</h1>
          
          <div class="meta-row">
            <span class="date">📅 {{ selectedProject.date }}</span>
            <div class="tags">
              <span v-for="t in selectedProject.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>

          <hr class="divider" />
          
          <div class="markdown-body" v-html="selectedProject.renderedHtml"></div>
        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
/* =========================================
   1. 基础布局
   ========================================= */
.projects-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

/* ⭐ 找回你的网格布局！ */
.project-grid {
  display: grid;
  /* 响应式：最小 260px，自动填满 */
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  padding-bottom: 40px;
}

.empty-tip {
  color: #fff;
  text-align: center;
  grid-column: 1 / -1;
  padding-top: 50px;
}

/* =========================================
   2. 详情页样式
   ========================================= */
.project-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  /* 防止详情页太长导致滚动体验不好，加点底部留白 */
  padding-bottom: 60px;
}

.detail-nav {
  margin-bottom: 20px;
}

.back-btn {
  background: rgba(0, 0, 0, 0);
  border: 2px solid rgba(255,255,255,0.5);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #42b883;
  border-color: #42b883;
}

/* 详情页玻璃卡片 */
.detail-content {
  background: rgba(255, 255, 255, 0.85); /* 稍微不透明一点，为了看清文字 */
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  color: #333;
}

.detail-cover {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

h1 { margin: 0 0 10px 0; color: #2c3e50; font-size: 2rem; }

.meta-row { display: flex; gap: 20px; align-items: center; margin-bottom: 20px; color: #666;}

.tag { background: #6666662e; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; color: #555; }

.divider { border: 0; height: 1px; background: rgba(0,0,0,0.1); margin: 30px 0; }

/* =========================================
   3. 核心动画：淡化滑动 (Fade Slide)
   ========================================= */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease; /* 0.4秒丝滑过渡 */
}

/* 进入前：透明 + 向右偏移 */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

/* 离开后：透明 + 向左偏移 */
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* =========================================
   4. Markdown 正文排版 (Typography)
   ========================================= */
:deep(.markdown-body) {
  line-height: 1.8;
  color: #333;
  font-size: 1.05rem;
}

:deep(.markdown-body h2) {
  font-size: 1.5rem;
  margin-top: 30px;
  margin-bottom: 15px;
  color: #2c3e50;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 0.3em;
}

:deep(.markdown-body h3) {
  font-size: 1.25rem;
  margin-top: 24px;
  margin-bottom: 12px;
  color: #42b883; /* Vue Green */
  border-left: 4px solid #42b883;
  padding-left: 10px;
}

:deep(.markdown-body p) {
  margin-bottom: 16px;
  text-align: justify;
}

:deep(.markdown-body img) {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: block;
  margin: 20px auto; /* 图片居中 */
}

:deep(.markdown-body code) {
  background-color: rgba(27,31,35,0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
  color: #d63200;
}

:deep(.markdown-body blockquote) {
  margin: 20px 0;
  padding: 10px 20px;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  background-color: rgba(0,0,0,0.02);
  font-style: italic;
}
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