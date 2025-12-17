<script setup>
/**
 * WelcomePage.vue
 * 欢迎页组件 - 柔光弥散风格 (Soft Glow)
 */
const emit = defineEmits(['enter'])
</script>

<template>
  <div class="welcome-container">
    <div class="content">
      <h1 class="title">你好 世界</h1>
      <p class="subtitle">Welcome to My Personal Space</p>
      
      <button class="enter-btn" @click="emit('enter')">
        进入主页
      </button>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   1. 容器布局 (Layout & Background)
   ========================================= */
.welcome-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  
  /* 背景设置：保留原图亮度，不加全屏遮罩 */
  background-image: url('../assets/welcomePage.jpg');
  background-size: cover;
  background-position: center;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* 兜底色 */
  background-color: #333; 
}

/* =========================================
   2. 内容容器
   ========================================= */
.content {
  text-align: center;
  /* 没有任何背景框，完全通透 */
}

/* =========================================
   3. 字体样式：柔光弥散风格 (Soft Glow)
   ========================================= */
.title {
  font-size: 5rem;
  margin: 0;
  color: white;
  letter-spacing: 10px;
  
  /* 字体加粗：为了让阴影有依附，字体不能太细 */
  font-weight: 700; 
  
  /* 🎨 核心魔法：多重文字阴影 */
  text-shadow: 
    /* 第一层：紧贴的深色投影，保证文字边缘清晰 */
    0 2px 10px rgba(0,0,0,0.6),
    
    /* 第二层：大范围的模糊黑影 (像云雾一样)，将文字与花哨背景隔开 */
    0 0 50px rgba(0,0,0,0.8);
}

.subtitle {
  font-size: 1.5rem;
  margin: 20px 0 60px;
  color: rgba(255,255,255,0.95);
  font-weight: 500;
  
  /* 副标题也加一点阴影，保证可读性 */
  text-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

/* =========================================
   4. 按钮样式：磨砂质感
   ========================================= */
.enter-btn {
  padding: 15px 45px;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  
  /* 按钮背景：半透明黑 + 模糊，呼应阴影风格 */
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  color: white;
  border: 1px solid rgba(255,255,255,0.3); /* 淡淡的边框 */
  
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 1px;
}

.enter-btn:hover {
  background: white;
  color: black;
  transform: scale(1.05);
  border-color: white;
  /* 悬停时去掉按钮的模糊，变成实心白 */
  backdrop-filter: none;
}
</style>