<script setup>
  /* =========================================
     1. 导入依赖
     ========================================= */
  import { ref, shallowRef } from 'vue'
  
  // 组件导入
  import UserProfile from './components/UserProfile.vue'
  import SideMenu from './components/SideMenu.vue'
  
  // 视图导入
  import MyProjects from './views/MyProjects.vue'
  import MyArticles from './views/MyArticles.vue'
  import MySocials from './views/MySocials.vue'
  import WelcomePage from './views/WelcomePage.vue'

  // 图片资源导入
  // 确保 assets 文件夹里有这两个文件
  import avatarImage from './assets/avatar.png'
  // 背景图在 style 里引用，这里不需要 import

  /* =========================================
     2. 欢迎页逻辑 (Welcome State)
     ========================================= */
  const showWelcome = ref(true)

  function enterMainPage() {
    showWelcome.value = false
  }

  function backToWelcome() {
    showWelcome.value = true
  }

  /* =========================================
     3. 主页数据 (Main Page Data)
     ========================================= */
  const myName = ref('三硝基猫猫酚')
  const myBio = ref('即使现在看不到进步，也要相信“我是一个随时间变化的指数函数”')
  const myAvatar = ref(avatarImage)

  /* =========================================
     4. 标签页切换逻辑 (Tab Switching)
     ========================================= */
  const tabs = {
    'projects': MyProjects,
    'articles': MyArticles,
    'socials':  MySocials
  }

  const currentTabId = ref('projects')
  const currentView = shallowRef(MyProjects)

  function switchTab(id) {
    currentTabId.value = id
    currentView.value = tabs[id]
  }
</script>

<template>
  <div class="global-background"></div>

  <div class="viewport-container">
    
    <Transition name="fade">
      <div 
        v-if="!showWelcome" 
        class="back-home-trigger" 
        @click="backToWelcome" 
        title="返回欢迎页"
      >
        <div class="indicator-line"></div>
      </div>
    </Transition>

    <aside class="sidebar-panel">
      <div class="profile-area">
        <UserProfile :name="myName" :bio="myBio" :avatar="myAvatar" />
      </div>
      <div class="menu-area">
        <SideMenu :active-tab="currentTabId" @change-tab="switchTab" />
      </div>
      <div class="footer-area">
        <p>© 2025 Personal Page</p>
      </div>
    </aside>

    <main class="content-area">
      <div class="glass-window">
        <div class="scroll-container">
          <Transition name="fade" mode="out-in">
            <component :is="currentView" />
          </Transition>
        </div>
      </div>
    </main>
  </div>

  <Transition name="slide-up">
    <WelcomePage v-if="showWelcome" @enter="enterMainPage" />
  </Transition>

</template>

<style>
/* 全局重置 */
body {
  margin: 0; padding: 0; overflow: hidden; font-family: 'Inter', sans-serif;
}
</style>

<style scoped>
/* =========================================
   1. 基础布局与背景
   ========================================= */
.global-background {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
  /* 确保 assets 文件夹下有 background.jpg */
  background-image: url('./assets/background.jpg');
  background-size: cover;
  background-position: center;
}

.viewport-container {
  width: 100vw; height: 100vh;
  display: grid;
  grid-template-columns: 400px 1fr;
  /* 确保没有其他元素干扰 grid 布局 */
}

/* =========================================
   2. 幕布动画 (Slide Up Transition)
   ========================================= */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1); 
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-80%); 
  opacity: 0;
}

/* =========================================
   3. 顶部导航：极简几何手柄 (新)
   ========================================= */
.back-home-trigger {
  position: absolute; /* 绝对定位，相对于 viewport-container */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  
  width: 120px; height: 40px;
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
  transition: top 0.3s ease;
}

/* 几何长条 */
.indicator-line {
  width: 60px; height: 6px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 交互效果 */
.back-home-trigger:hover .indicator-line {
  width: 80px; height: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 15px rgba(255,255,255,0.6);
}
.back-home-trigger:active .indicator-line {
  transform: scale(0.95); opacity: 0.8;
}

/* =========================================
   4. 左侧栏 & 右侧栏
   ========================================= */
.sidebar-panel {
  height: 100%; display: flex; flex-direction: column; padding: 60px 30px; box-sizing: border-box;
}
.profile-area { margin-bottom: 40px; }
.menu-area { flex-grow: 1; }
.footer-area p { font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); text-align: center; }

.content-area {
  height: 100vh; display: flex; align-items: center; justify-content: center; padding-right: 40px;
}
.glass-window {
  width: 100%; height: calc(100vh - 80px);
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(24px); border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); overflow: hidden; position: relative;
}
.scroll-container { height: 100%; overflow-y: auto; padding: 50px; box-sizing: border-box; }
.scroll-container::-webkit-scrollbar { width: 8px; }
.scroll-container::-webkit-scrollbar-track { background: transparent; }
.scroll-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }

/* 内部内容淡入淡出 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* 手机适配 */
@media (max-width: 900px) {
  .viewport-container { grid-template-columns: 1fr; overflow: auto; }
  .sidebar-panel { height: auto; padding: 40px 20px; background: rgba(0,0,0,0.2); }
  .content-area { height: auto; padding: 20px; display: block; }
  .glass-window { height: auto; min-height: 500px; border-radius: 20px; }
}
</style>