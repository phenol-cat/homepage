<script setup>
// 接收父组件传来的朋友信息对象
const props = defineProps({
  friend: {
    type: Object,
    required: true,
    // 数据结构预期: { name, avatar, intro, link }
  }
})
</script>

<template>
  <a :href="friend.link" target="_blank" class="friend-card">
    
    <div class="avatar-wrapper">
      <img v-if="friend.avatar" :src="friend.avatar" :alt="friend.name" class="avatar" loading="lazy" />
      <div v-else class="avatar-placeholder">{{ friend.name[0] }}</div>
    </div>

    <div class="info">
      <h3 class="name">{{ friend.name }}</h3>
      <p class="intro">{{ friend.intro || '这个人很懒，什么也没写。' }}</p>
    </div>

    <div class="visit-btn">
      访问主页 →
    </div>

  </a>
</template>

<style scoped>
/* --- 卡片整体容器 (它本身是个 <a> 标签) --- */
.friend-card {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  text-align: center;  /* 文字居中 */
  text-decoration: none; /* 去掉链接下划线 */
  
  /* 玻璃拟态风格 */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px; /* 更大的圆角 */
  padding: 30px 25px;
  
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* 更有弹性的过渡曲线 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  height: 100%; /* 撑满网格高度 */
}

/* 悬停特效：上浮 + 变亮 + 阴影 */
.friend-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
}

/* --- 1. 头像区域 --- */
.avatar-wrapper {
  margin-bottom: 20px;
  position: relative;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  /* 给头像加一个精致的白圈和阴影 */
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

/* 悬停时头像微微旋转放大 */
.friend-card:hover .avatar {
  transform: scale(1.05) rotate(3deg);
}

/* 默认头像占位 */
.avatar-placeholder {
  width: 90px; height: 90px; border-radius: 50%;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: white; font-weight: bold;
  border: 4px solid rgba(255, 255, 255, 0.9);
}

/* --- 2. 信息区域 --- */
.info {
  flex: 1; /* 占满中间空间，把按钮挤到底部 */
  width: 100%;
}

.name {
  margin: 0 0 10px 0;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 700;
}

.intro {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 25px 0;
  
  /* 限制最多显示 3 行，多余省略 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- 3. 底部按钮装饰 --- */
.visit-btn {
  padding: 10px 30px;
  /* 使用 Vue 绿到深色的渐变 */
  background: linear-gradient(135deg, #42b883, #2c3e50);
  color: white;
  border-radius: 30px; /* 胶囊形状 */
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
  transition: all 0.3s;
}

/* 悬停时按钮变宽一点点 */
.friend-card:hover .visit-btn {
  padding: 10px 35px;
  box-shadow: 0 6px 15px rgba(66, 184, 131, 0.5);
}
</style>