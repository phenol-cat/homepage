<script setup>
  import { ref, shallowRef } from 'vue'
  
  // 组件导入
  import UserProfile from './components/UserProfile.vue'
  import SideMenu from './components/SideMenu.vue'
  import BackToTop from './components/BackToTop.vue'
  import ThemeSwitch from './components/ThemeSwitch.vue'
  import ZenButton from './components/ZenButton.vue'
  import SvgIcon from './components/SvgIcon.vue'
  
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

  // 侧边栏收起状态。这里同步读取 localStorage 而不是放到 onMounted 里，
  // 否则每次刷新都会先按展开态渲染一帧再收起，看起来像闪了一下。
  const readCollapsed = () => {
    try {
      return localStorage.getItem('sidebar') === 'collapsed'
    } catch (e) {
      return false
    }
  }
  const isCollapsed = ref(readCollapsed())

  function enterMainPage() { showWelcome.value = false }
  function backToWelcome() { showWelcome.value = true }
  
  // 切换沉浸模式
  function toggleZenMode() { 
    isZenMode.value = !isZenMode.value 
  }

  // 收起 / 展开侧边栏。收起后不是完全消失，而是只留下头像和图标菜单。
  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
    // 记住选择，刷新后保持原样
    try {
      localStorage.setItem('sidebar', isCollapsed.value ? 'collapsed' : 'expanded')
    } catch (e) {
      /* 隐私模式下 localStorage 可能不可用，忽略即可 */
    }
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

  <div
    class="viewport-container"
    :class="{ 'zen-active': isZenMode, 'sidebar-collapsed': isCollapsed }"
  >
    
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
      <!-- 收起 / 展开开关 -->
      <button
        class="sidebar-toggle hide-in-zen"
        type="button"
        @click="toggleSidebar"
        :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
        :aria-label="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
        :aria-expanded="!isCollapsed"
      >
        <SvgIcon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" :size="18" />
      </button>

      <!--
        两层结构：展开层固定 340px 宽，收起时被外层裁掉而不是自己重排，
        这样窄下去的过程是"滑走"而不是文字挤成一团。
      -->
      <div class="sidebar-stack">
        <div class="sidebar-layer sidebar-layer--full">
          <div class="sidebar-layer-inner hide-in-zen">
            <div class="profile-area">
              <UserProfile :name="myName" :bio="myBio" :avatar="myAvatar" />
            </div>

            <div class="menu-area">
              <SideMenu :active-tab="currentTabId" @change-tab="switchTab" />
            </div>
          </div>
        </div>

        <div class="sidebar-layer sidebar-layer--rail">
          <div class="sidebar-layer-inner hide-in-zen">
            <img class="rail-avatar" :src="myAvatar" alt="头像" />
            <SideMenu collapsed :active-tab="currentTabId" @change-tab="switchTab" />
          </div>
        </div>
      </div>

      <div class="footer-area">
        <div class="button-group">
          <ThemeSwitch />
          <ZenButton :active="isZenMode" @click="toggleZenMode" />
        </div>
        
        <p class="hide-in-zen footer-copy">© 2025 三硝基猫猫酚 · Made with Vue</p>
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
body { margin: 0; padding: 0; overflow: hidden; font-family: var(--font-sans); }
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
  /* 侧边栏两种宽度。收起后右侧内容要保持展开时的尺寸，
     所以把内容区宽度上限锁在"展开态可用宽度"，让它只挪位不撑大。 */
  --sidebar-expanded: 400px;
  --sidebar-collapsed: 112px;
  --content-gap: 40px;
  --content-max: calc(100vw - var(--sidebar-expanded) - var(--content-gap));

  width: 100vw; height: 100vh;
  display: flex;
}

/* =========================================
   2. 侧边栏
   ========================================= */
.sidebar-panel {
  position: relative;
  flex: none;                 /* 宽度自己说了算，不参与伸缩 */
  width: var(--sidebar-expanded);
  height: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  padding: 60px 30px;
  box-sizing: border-box;
  /* 收起时把展开层裁掉，而不是让它跟着变窄重排 */
  overflow: hidden;
  transition: width 0.45s cubic-bezier(0.25, 0.8, 0.25, 1),
              padding 0.45s cubic-bezier(0.25, 0.8, 0.25, 1),
              background-color 0.5s ease;
}

/* 收起 / 展开按钮：展开时在右上角，收起后落到窄轨中线 */
.sidebar-toggle {
  position: absolute;
  top: 16px; right: 20px;
  z-index: 5;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: right 0.45s cubic-bezier(0.25, 0.8, 0.25, 1),
              transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1),
              background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}
.sidebar-toggle:hover {
  background: var(--glass-bg);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

/* 两层叠放：展开层 + 收起后的窄轨层 */
.sidebar-stack {
  position: relative;
  flex: 1;
  min-height: 0;
}

.sidebar-layer {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  /* 淡出用 0.15s、淡入用 0.22s 且延后 0.15s，
     这样一层退场完另一层才登场，两层不会糊在一起。
     visibility 的延迟放在最后：淡出结束后才真正隐藏，淡入时立刻可见。
     这样隐藏的那一层会彻底退出无障碍树，读屏不会念到两套一模一样的菜单，
     键盘 Tab 也不会停到看不见的按钮上。 */
  transition: opacity 0.15s ease 0s,
              transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
              visibility 0s linear 0.15s;
}

/* 展开层：宽度写死成展开时的内容宽度。
   侧边栏变窄时它只会被裁掉，不会重新排版，所以不会出现文字挤成一团的抖动。 */
.sidebar-layer--full {
  width: calc(var(--sidebar-expanded) - 60px);
  opacity: 1;
  visibility: visible;
  /* 展开时晚一点淡入，等窄轨先退场 */
  transition: opacity 0.22s ease 0.15s,
              transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
              visibility 0s linear 0s;
}
.sidebar-layer--full .sidebar-layer-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 窄轨层：只留头像和图标菜单 */
.sidebar-layer--rail {
  width: calc(var(--sidebar-collapsed) - 24px);
  opacity: 0;
  visibility: hidden;
  transform: translateX(12px);
  pointer-events: none;
  transition: opacity 0.15s ease 0s,
              transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
              visibility 0s linear 0.15s;
}
.sidebar-layer--rail .sidebar-layer-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

.rail-avatar {
  width: 48px; height: 48px;
  flex: none;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--glass-border);
  box-shadow: 0 4px 14px var(--glass-shadow);
}

/* --- 收起状态 --- */
.viewport-container.sidebar-collapsed .sidebar-panel {
  width: var(--sidebar-collapsed);
  padding: 60px 12px;
}

/* 展开层立刻淡出 */
.viewport-container.sidebar-collapsed .sidebar-layer--full {
  opacity: 0;
  visibility: hidden;
  transform: translateX(-18px);
  pointer-events: none;
  transition: opacity 0.15s ease 0s,
              transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
              visibility 0s linear 0.15s;
}

/* 窄轨稍微等一下再淡入，两段动画不糊在一起 */
.viewport-container.sidebar-collapsed .sidebar-layer--rail {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  pointer-events: auto;
  transition: opacity 0.22s ease 0.15s,
              transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
              visibility 0s linear 0s;
}

.viewport-container.sidebar-collapsed .sidebar-toggle {
  right: 50%;
  transform: translateX(50%);
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
  transition: gap 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.footer-area p { 
  font-size: 0.8rem; text-align: center; margin-top: 5px;
  color: rgba(255, 255, 255, 0.6); 
}

/* 收起后：按钮缩小让两个并排塞进窄轨，底部文字淡出（保留占位，避免跳动） */
.footer-copy { transition: opacity 0.3s ease; }

.viewport-container.sidebar-collapsed .button-group { gap: 10px; }

.viewport-container.sidebar-collapsed :deep(.theme-btn),
.viewport-container.sidebar-collapsed :deep(.zen-btn) {
  width: 38px;
  height: 38px;
}

.viewport-container.sidebar-collapsed .footer-copy { opacity: 0; }

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
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding-right: var(--content-gap);
  transition: opacity 0.5s ease, transform 0.5s ease,
              padding 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 侧边栏收起后，内容区两侧留白对称，玻璃面板就在剩余空间里居中 */
.viewport-container.sidebar-collapsed .content-area {
  padding-left: var(--content-gap);
}

.glass-window {
  width: 100%;
  /* 收起时右侧不跟着变大：宽度上限锁在展开态，只是位置移到中间 */
  max-width: var(--content-max);
  height: calc(100vh - 80px);
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
  .viewport-container { flex-direction: column; overflow: auto; }
  .sidebar-panel {
    width: 100% !important;      /* 手机端不做收起，忽略收起状态 */
    height: auto;
    padding: 40px 20px;
    background: rgba(0,0,0,0.2);
  }

  /* 把叠放的两层还原成普通文档流，并隐藏窄轨 */
  .sidebar-stack { flex: none; }
  .sidebar-layer {
    position: static;
    width: auto !important;
    height: auto;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    pointer-events: auto !important;
    transition: none;
  }
  .sidebar-layer--rail { display: none; }
  .sidebar-toggle { display: none; }

  .content-area {
    flex: none;
    height: auto;
    padding: 20px;
    display: block;
  }
  .glass-window { height: auto; min-height: 500px; border-radius: 20px; max-width: none; }
  .zen-active .footer-area { position: fixed; bottom: 30px; right: 30px; }
}
</style>
