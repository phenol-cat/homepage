<script setup>
import { ref } from 'vue'
import FriendCard from '../components/FriendCard.vue'
import SvgIcon from '../components/SvgIcon.vue'

// 图片路径统一从 Vite 的 base 推导，这样以后改仓库名 / 部署路径时不用再全局替换
const base = import.meta.env.BASE_URL

// 1. 定义彩蛋池 (用来存当前屏幕上显示的提示)
const easterEggs = ref([])
let eggId = 0 // 给每个弹窗一个唯一ID

// 2. 触发彩蛋的函数
function triggerEgg() {
  const id = eggId++
  // 推入一条新消息
  easterEggs.value.push({ id, text: "链接不能从这一侧打开" })
  
  // 1.5秒后自动把自己删掉
  setTimeout(() => {
    // 找到这个ID对应的索引并删除
    const index = easterEggs.value.findIndex(egg => egg.id === id)
    if (index !== -1) easterEggs.value.splice(index, 1)
  }, 1500)
}

// 3. 处理点击事件
function handleCardClick(e, friend) {
  // 如果这个朋友有 isMe 标记
  if (friend.isMe) {
    e.preventDefault() // ✋ 拦截！阻止浏览器跳转链接
    triggerEgg()       // 🎉 放彩蛋！
  }
  // 如果不是你，什么都不做，浏览器会自动跳转 href 链接
}

// 🤝 友情链接数据
const friendsList = ref([
  {
    name: "三硝基猫猫酚",
    avatar: `${base}images/avatar.png`, 
    intro: "实在没东西放，就把我自己放上来吧，不要原地TP！",
    link: "#", // 既然是彩蛋，这里链接可以随便写，反正会被拦截
    isMe: true // 👈 ⭐ 关键标记！一定要加上这个！
  },
  {
    name: "SelfLo",
    avatar: `${base}images/selflo_avatar.png`,
    intro: "Stay hungry, stay foolish.",
    link: "https://selflo06.xyz/"
  },
  {
    name:"Runnel",
    avatar:`${base}images/Runnel_avatar.jpg`,
    intro:"Il nous montre une correspondance subtiles et fine， comme venue du vide.",
    link:"https://www.runnelzhang.com/"
  },
  // ... 其他朋友
])
</script>

<template>
  <div class="friends-container">
    
    <header class="page-header">
      <h1>
        <SvgIcon name="users" :size="28" />
        <span>友情链接</span>
      </h1>
      <p>很高兴遇见这些有趣的小伙伴。</p>
    </header>

    <hr class="divider">

    <div class="friends-grid">
      <FriendCard 
        v-for="friend in friendsList" 
        :key="friend.name"
        :friend="friend"
        @click="handleCardClick($event, friend)"
      />
    </div>

    <div class="egg-container">
      <TransitionGroup name="egg-pop">
        <div v-for="egg in easterEggs" :key="egg.id" class="egg-toast">
          {{ egg.text }}
        </div>
      </TransitionGroup>
    </div>

  </div>
</template>

<style scoped>
/* --- 原有样式保持不变 --- */
.friends-container { width: 100%; padding: 20px 0; display: flex; flex-direction: column; }

/* --- 页头：改用主题变量，深色模式下不再是"白字配深色" --- */
.page-header { text-align: center; margin-bottom: 30px; color: var(--text-primary); }
.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  /* 图标与标题文字并排居中对齐 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.page-header p { color: var(--text-secondary); margin: 0; }
.divider { border: 0; height: 1px; background: var(--glass-border); margin-bottom: 40px; }
.friends-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; padding-bottom: 50px; }

/* --- 🥚 彩蛋样式 --- */
.egg-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none; /* 让鼠标可以穿透它，不影响点击其他东西 */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* 如果点得快，弹窗之间的间距 */
}

.egg-toast {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  white-space: nowrap;
}

/* --- ⚡️ 弹窗动画 (Vue Transition) --- */
/* 进入时：从下方弹起，透明变实 */
.egg-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 弹性效果 */
}
/* 离开时：向上飘走，变透明 */
.egg-pop-leave-active {
  transition: all 0.5s ease;
  position: absolute; /* 关键：让离开的元素脱离文档流，保证列表平滑移动 */
}

.egg-pop-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.egg-pop-leave-to {
  opacity: 0;
  transform: translateY(-50px); /* 向上飘 */
}

/* 确保移动时其他元素平滑过渡 */
.egg-pop-move {
  transition: transform 0.3s ease;
}
</style>
