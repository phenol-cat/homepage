<script setup>
/**
 * MyProjects.vue
 * -------------------
 * 修复版：
 * 1. 修复了 contentBlocks 的层级结构
 * 2. 修复了 botDemo1/2 未定义的问题
 * 3. 补全了其他两个项目，防止页面空荡荡
 */

import { ref } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'

// 📦 1. 资源导入区域
import botImg from '../assets/bot.png' 
// 假设你还有其他图片，先在这里 import
// import gameImg from '../assets/game.jpg' 

// ⚠️ 为了防止报错，我暂时把这两个变量指向 botImg
// 等你有了真实的演示图，请取消下面两行的注释，并删除临时变量
// import botDemo1 from '../assets/bot_demo_1.png'
// import botDemo2 from '../assets/bot_demo_2.png'
const botDemo1 = botImg // (临时占位)
const botDemo2 = botImg // (临时占位)


// 📦 2. 项目数据定义
const allProjects = ref([
  {
    id: 1,
    title: "QQ Bot 插件系统",
    date: "2025-11",
    desc: "基于 Python 的 QQ 机器人插件，实现了表情包自动回复与群管理功能。",
    image: botImg, 
    techStack: ["Python", "Napcat"],
    
    // ⭐ 详情页专属内容
    // 关键修复：必须包裹在 detail 对象里！
    detail: {
      // 使用 contentBlocks 数组来实现图文混排
      contentBlocks: [
        { 
          type: 'text', 
          value: "这个项目的初衷是为了方便群管理，同时也想尝试一下异步编程。通过调用 Napcat 的 API，我实现了一套轻量级的插件系统。" 
        },
        { 
          type: 'image', 
          value: botDemo1,  // 这里使用了上面的变量
          caption: "机器人实际运行效果图" 
        },
        { 
          type: 'text', 
          value: "为了降低耦合度，我设计了基于事件分发的插件架构，如下所示：" 
        },
        { 
          type: 'image', 
          value: botDemo2, 
          caption: "系统架构示意图" 
        },
        { 
          type: 'text', 
          value: "最终，我们将群管理的维护成本降低了 80%。" 
        }
      ],
      features: [
        "支持热插拔：无需重启机器人即可加载新插件",
        "表情包互动：关键词触发 /set_msg_emoji_like",
        "群管功能：自动撤回违禁词消息"
      ],
      links: [
        { name: "GitHub 仓库", url: "https://github.com/yourname/qq-bot" },
        { name: "演示视频", url: "https://bilibili.com" }
      ]
    }
  },
  {
    id: 2,
    title: "C++ 2D 游戏引擎",
    date: "2023-09",
    desc: "和同学合作开发的游戏项目，使用 Qt 作为图形库。",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
    techStack: ["C++", "Qt"],
    
    detail: {
      // 如果没有图片，可以只放 text 块
      contentBlocks: [
        { type: 'text', value: "这是一个大作业项目。我们没有使用现成的游戏引擎，而是从零开始用 C++ 封装了物理碰撞和粒子系统。" },
        { type: 'text', value: "在这个过程中，我深刻理解了游戏循环（Game Loop）的原理以及 Qt 图形视口框架的使用。" }
      ],
      features: [
        "自定义物理引擎：支持 AABB 碰撞检测",
        "双人联机：通过 Socket 实现局域网对战"
      ],
      links: [
        { name: "查看源码", url: "#" } 
      ]
    }
  },
  {
    id: 3,
    title: "个人主页 (This Site)",
    date: "2024-01",
    desc: "使用 Vue 3 + Vite 构建的现代化个人主页。",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    techStack: ["Vue3", "Vite"],
    
    detail: {
      contentBlocks: [
         { type: 'text', value: "为了展示我的编程项目，我决定亲手打造这个个人主页。" }
      ],
      features: ["响应式设计", "平滑动画"],
      links: []
    }
  }
])

// 📦 3. 交互逻辑
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
      </div>

      <div v-else class="project-detail">
        
        <div class="detail-nav">
          <button class="back-btn" @click="closeProject">
            ← 返回列表
          </button>
        </div>

        <div class="detail-content">
          
          <img :src="selectedProject.image" class="detail-cover" />
          
          <h1>{{ selectedProject.title }}</h1>
          <div class="meta-row">
            <span class="date">📅 {{ selectedProject.date }}</span>
            <div class="tags">
              <span v-for="t in selectedProject.techStack" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
          
          <div class="section-block" v-if="selectedProject.detail?.contentBlocks">
            <h3>💡 项目介绍</h3>
          
            <div v-for="(block, index) in selectedProject.detail.contentBlocks" :key="index" class="content-item">
              
              <p v-if="block.type === 'text'" class="intro-text">
                {{ block.value }}
              </p>
              
              <div v-else-if="block.type === 'image'" class="intro-image-wrapper">
                <img :src="block.value" class="intro-image" />
                <span v-if="block.caption" class="image-caption">{{ block.caption }}</span>
              </div>
              
            </div>
          </div>
          
          <hr class="divider" />
          
          <div class="section-block" v-if="selectedProject.detail?.features">
            <h3>核心功能</h3>
            <ul class="feature-list">
              <li v-for="(feat, index) in selectedProject.detail.features" :key="index">
                {{ feat }}
              </li>
            </ul>
          </div>

          <div class="action-area" v-if="selectedProject.detail?.links && selectedProject.detail.links.length > 0">
            <a 
              v-for="link in selectedProject.detail.links" 
              :key="link.name"
              :href="link.url"
              target="_blank" 
              class="link-btn"
            >
              {{ link.name }} ↗
            </a>
          </div>
          
        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
/* =========================================
   1. 容器与网格布局
   ========================================= */
.projects-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px; /* 顶部留白 */
}

.project-grid {
  display: grid;
  /* 自动响应式布局：最窄 260px，自动换行 */
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  padding-bottom: 40px; /* 底部留白防止遮挡 */
}

/* =========================================
   2. 详情页布局框架
   ========================================= */
.project-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-nav {
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #555;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.3s;
}
.back-btn:hover {
  color: #42b883; /* 悬停变 Vue 绿 */
}

.detail-content {
  background: rgba(255,255,255,0.6); /* 详情页背景稍白一点，方便阅读 */
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 40px; /* 防止底部贴边 */
}

.detail-cover {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 25px;
}

/* =========================================
   3. 详情页排版细节
   ========================================= */
h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.meta-row {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
  color: #666;
}

.tag {
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 5px;
  color: #555;
}

.section-block {
  margin: 25px 0;
}

.section-block h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 12px;
  border-left: 4px solid #42b883; /* 左侧绿色装饰条 */
  padding-left: 10px;
}

.intro-text {
  line-height: 1.8;
  color: #555;
  font-size: 1rem;
}

.divider {
  border: 0;
  height: 1px;
  background: rgba(0,0,0,0.1);
  margin: 30px 0;
}

/* 功能列表样式 */
.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  color: #444;
  line-height: 1.6;
}

.feature-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #42b883;
  font-weight: bold;
}

/* 链接按钮样式 */
.action-area {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}

.link-btn {
  text-decoration: none;
  padding: 10px 24px;
  background: #333;
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: inline-block;
}

.link-btn:hover {
  background: #42b883;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 184, 131, 0.3);
}

/* =========================================
   4. 动画效果
   ========================================= */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

/* --- 图文混排样式 --- */

/* 给每个块之间加点间距 */
.content-item {
  margin-bottom: 20px;
}

/* 文字块样式 */
.intro-text {
  line-height: 1.8;
  color: #555;
  font-size: 1rem;
  margin: 0; /* 清除默认边距，由 content-item 控制 */
}

/* 图片容器 */
.intro-image-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 图片居中 */
  margin: 25px 0;
}

/* 插入的图片本身 */
.intro-image {
  max-width: 100%;       /* 不超过容器宽度 */
  border-radius: 12px;   /* 圆角 */
  box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* 漂亮的阴影 */
  border: 1px solid rgba(255,255,255,0.5);
  transition: transform 0.3s;
}

/* 鼠标悬停微放大 */
.intro-image:hover {
  transform: scale(1.02);
}

/* 图片下方的小字说明 */
.image-caption {
  font-size: 0.85rem;
  color: #888;
  margin-top: 10px;
  font-style: italic;
}
</style>