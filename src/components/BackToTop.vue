<script setup>
// 接收父组件的指令：显示还是隐藏
defineProps({
  visible: Boolean
})

// 告诉父组件：我被点了
defineEmits(['click'])
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="visible" 
      class="back-top-btn" 
      @click="$emit('click')"
      title="回到顶部"
    >
      ↑
    </button>
  </Transition>
</template>

<style scoped>
.back-top-btn {
  /* ⭐ 绝对定位：相对于父容器（glass-window）定位 */
  position: absolute;
  bottom: 30px;
  right: 30px;
  
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #42b883;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.4);
  z-index: 100; /* 保证浮在内容上面 */
  
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.back-top-btn:hover {
  transform: translateY(-3px);
  background: #33a06f;
  box-shadow: 0 8px 16px rgba(66, 184, 131, 0.6);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>