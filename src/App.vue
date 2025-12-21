<script setup>
  import { ref, shallowRef } from 'vue'
  
  // 组件导入
  import UserProfile from './components/UserProfile.vue'
  import SideMenu from './components/SideMenu.vue'
  import BackToTop from './components/BackToTop.vue'
  import ThemeSwitch from './components/ThemeSwitch.vue'
  import ZenButton from './components/ZenButton.vue'
  
  // 视图导入
  import MyProjects from './views/MyProjects.vue'
  import MyArticles from './views/MyArticles.vue'
  import WelcomePage from './views/WelcomePage.vue'
  import AboutMe from './views/AboutMe.vue'
  import MyFriends from './views/MyFriends.vue'

  import avatarImage from './assets/avatar.png'

  /* --- 状态管理 --- */
  const showWelcome = ref(true)
  const isZenMode = ref(false) // 沉浸模式状态

  function enterMainPage() { showWelcome.value = false }
  function backToWelcome() { showWelcome.value = true }
  
  // 切换沉浸模式
  function toggleZenMode() { 
    isZenMode.value = !isZenMode.value 
  }

  /* --- 数据 --- */
  const myName = ref('三硝基猫猫酚')
  const myBio = ref('即使现在看不到进步，也要相信“我是一个随时间变化的指数函数”')
  const myAvatar = ref(avatarImage)

  const tabs = { 'about': AboutMe, 'projects': MyProjects, 'articles': MyArticles, 'friends': MyFriends }
  const currentTabId = ref('about')
  const currentView = shallowRef(AboutMe)

  function switchTab(id) {
    currentTabId.value = id
    currentView.value = tabs[id]
    if (scrollRef.value) scrollRef.value.scrollTop = 0
  }

  const scrollRef = ref(null)
  const showBackTop = ref(false)
  function handleScroll(e) { showBackTop.value = e.target.scrollTop > 300 }
  function scrollToTop() { scrollRef.value.scrollTo({ top: 0, behavior: 'smooth' }) }
</script>

<template>
  <div class="global-background"></div>

  <div class="viewport-container" :class="{ 'zen-active': isZenMode }">
    
    <Transition name="fade">
      <div 
        v-if="!showWelcome && !isZenMode" 
        class="back-home-trigger" 
        @click="backToWelcome" 
        title="返回欢迎页"
      >
        <div class="indicator-line"></div>
      </div>
    </Transition>

    <aside class="sidebar-panel">
      <div class="profile-area hide-in-zen">
        <UserProfile :name="myName" :bio="myBio" :avatar="myAvatar" />
      </div>
      
      <div class="menu-area hide-in-zen">
        <SideMenu :active-tab="currentTabId" @change-tab="switchTab" />
      </div>

      <div class="footer-area">
        <div class="button-group">
          <ThemeSwitch />
          <ZenButton :active="isZenMode" @click="toggleZenMode" />
        </div>
        
        <p class="hide-in-zen">© 2025 Personal Page</p>
      </div>
    </aside>

    <main class="content-area hide-in-zen">
      <div class="glass-window">
        <div class="scroll-container" ref="scrollRef" @scroll="handleScroll">
          <Transition name="fade" mode="out-in">
            <component :is="currentView" />
          </Transition>
        </div>
        <BackToTop :visible="showBackTop" @click="scrollToTop" />
      </div>
    </main>
  </div>

  <Transition name="slide-up">
    <WelcomePage v-if="showWelcome" @enter="enterMainPage" />
  </Transition>
</template>

<style>
body { margin: 0; padding: 0; overflow: hidden; font-family: 'Inter', sans-serif; }
</style>

<style scoped>
/* =========================================
   1. 基础布局
   ========================================= */
.global-background {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
  background-image: url('./assets/background.jpg');
  background-size: cover; background-position: center;
}
.global-background::before {
  content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: var(--bg-overlay); z-index: 1; transition: background 0.3s;
}

.viewport-container {
  width: 100vw; height: 100vh;
  display: grid;
  grid-template-columns: 400px 1fr;
  transition: all 0.5s ease;
}

/* =========================================
   2. 侧边栏 (修复排版问题)
   ========================================= */
.sidebar-panel {
  height: 100%; 
  display: flex; 
  flex-direction: column; /* 垂直排列 */
  padding: 60px 30px; 
  box-sizing: border-box;
  transition: background-color 0.5s ease;
}

.profile-area { margin-bottom: 40px; }

/* ⭐ 关键：让菜单区占据剩余空间，把页脚顶到底部 */
.menu-area { 
  flex-grow: 1; 
}

/* 底部区域 */
.footer-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

/* ⭐ 关键：按钮组并排 */
.button-group {
  display: flex;
  flex-direction: row; /* 横向排列 */
  gap: 20px;           /* 间距 */
  align-items: center;
}

.footer-area p { 
  font-size: 0.8rem; text-align: center; margin-top: 5px;
  color: rgba(255, 255, 255, 0.6); 
}

/* =========================================
   3. 动画与内容区
   ========================================= */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(-80%); opacity: 0; }

.back-home-trigger {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 100;
  width: 120px; height: 40px; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: top 0.3s ease;
}
.indicator-line {
  width: 60px; height: 6px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.back-home-trigger:hover .indicator-line { width: 80px; height: 8px; background: rgba(255, 255, 255, 0.9); box-shadow: 0 0 15px rgba(255,255,255,0.6); }

.content-area {
  height: 100vh; display: flex; align-items: center; justify-content: center; padding-right: 40px;
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.glass-window {
  width: 100%; height: calc(100vh - 80px);
  background: var(--glass-bg); backdrop-filter: blur(24px); border-radius: 40px; 
  border: 1px solid var(--glass-border); 
  box-shadow: 0 20px 50px var(--glass-shadow); 
  overflow: hidden; position: relative;
  transition: all 0.3s ease;
}
.scroll-container { height: 100%; overflow-y: auto; padding: 50px; box-sizing: border-box; scrollbar-width: none; }
.scroll-container::-webkit-scrollbar { width: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* =========================================
   🧘‍♂️ 4. 沉浸模式 (Zen Mode) 逻辑
   ========================================= */

/* 1. 隐藏被标记的元素 (Profile, Menu, Content, Text) */
.zen-active .hide-in-zen {
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

/* 正常状态下恢复显示 */
.hide-in-zen {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s ease;
}

/* 2. Zen模式下侧边栏背景变透明 */
.zen-active .sidebar-panel {
  background: transparent;
  box-shadow: none;
}

/* 手机适配 */
@media (max-width: 900px) {
  .viewport-container { grid-template-columns: 1fr; overflow: auto; }
  .sidebar-panel { height: auto; padding: 40px 20px; background: rgba(0,0,0,0.2); }
  .content-area { height: auto; padding: 20px; display: block; }
  .glass-window { height: auto; min-height: 500px; border-radius: 20px; }
  .zen-active .footer-area { position: fixed; bottom: 30px; right: 30px; }
}
</style>