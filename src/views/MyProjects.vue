<script setup>
import { ref } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import botPicture from '../assets/bot.png'
import fightGame1 from '../assets/fightGame1.png'
import homepage from '../assets/homepage.png'

// --- 核心数据：项目列表 ---
// ref([...]) 里面是一个数组，数组里每个花括号 {} 就是一个项目
const allProjects = ref([
  {
    id: 1,
    title: "QQ Bot与 插件",
    date: "2025-11",
    desc: "基于 Napcat协议 的 QQ 机器人插件，实现了自动回复，对话好感度，消息管理与群管理功能。",
    // 图片记得换成你 assets 里的 import 或者网络图片
    image: botPicture,  
    techStack: ["Python", "Napcat","WebSocket"]
  },
  {
    id: 2,
    title: "C++ 2D 游戏以及简单引擎",
    date: "2025-09",
    desc: "和同学合作开发的游戏项目，使用 Qt 作为图形库。",
    image: fightGame1,
    techStack: ["C++", "Qt"]
  },
  {
    id: 3,
    title: "个人主页 (This Site)",
    date: "2025-12",
    desc: "使用 Vue 3 + Vite 构建的现代化个人主页。",
    image:homepage,
    techStack: ["Vue3", "Vite"]
  }
  // 👇 如果要加第 4 个项目，在这里加逗号，然后复制上面的结构即可
])

// --- 状态管理 (保持不变) ---
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
          
          <p class="intro">{{ selectedProject.desc }}</p>
          
          <hr />
          
          <div class="body-text">
            <p>🚧 详细的项目文档、代码片段、演示视频将在这里展示...</p>
          </div>
        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
.projects-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 🛠️ 新增：因为删掉了标题，给顶部加一点呼吸空间，不然卡片贴顶了 */
  padding-top: 10px; 
}

/* 网格布局 */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px; /* 稍微加大一点间距 */
  padding-bottom: 40px;
}

/* --- 详情页样式 --- */
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
  background: none; border: none; font-size: 1rem; color: #555; cursor: pointer; font-weight: bold; transition: color 0.3s;
}
.back-btn:hover { color: #42b883; }

.detail-content {
  background: rgba(255,255,255,0.5);
  padding: 30px;
  border-radius: 20px;
  /* 详情页也加个小阴影 */
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.detail-cover {
  width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 25px;
}
.meta-row {
  display: flex; gap: 20px; align-items: center; margin: 15px 0; color: #666;
}
.tag {
  background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 5px;
}
.body-text {
  margin-top: 30px; line-height: 1.8; color: #444;
}

/* 切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>