

<script setup>
  import DotMatrixCapture from './DotMatrixCapture.vue'

  // defineProps 是 Vue 的一个宏（Macro）。
  // 对于 C/C++ 程序员：
  // 这相当于定义函数的形参： void UserProfile(string name, string bio, string avatar)
  // 子组件声明：我有这三个属性，父组件必须传给我，我才能显示。
  defineProps({
    name: String,
    bio: String,
    avatar: String
  })
</script>

<template>
  <!--
    鼠标移到卡片上：整张卡片先轻微放大，同时溶解成点阵；移开还原。
    mode="hover" 让点阵只在悬停时出现（组件默认的规则是"只要能看到就点阵"，
    这里显式覆盖成悬停触发）。缩放放在最外层容器上，
    这样文字和点阵画布会一起放大，不会出现只有一半变形的割裂感。
  -->
  <DotMatrixCapture
    class="profile-dot"
    mode="hover"
    :pitch="2.4"
    :dot-size="0.86"
    :capture-r="80"
    :ring-r="30"
    :keep-background="true"
  >
    <div class="profile-card">
      <img :src="avatar" alt="头像" class="avatar" />

      <div class="info">
        <h2>{{ name }}</h2>
        <p>{{ bio }}</p>
      </div>
    </div>
  </DotMatrixCapture>
</template>

<style scoped>
/* 悬停时轻微放大。
   加在最外层容器（点阵包装组件的根元素）上，文字和点阵画布会一起放大；
   如果只加在 .profile-card 上，点阵画布不会跟着变，看起来会"裂开"。 */
.profile-dot {
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: center center;
}

.profile-dot:hover {
  transform: scale(1.04);
}

.profile-card {
  display: flex; /* 弹性布局，让头像和文字并排显示 */
  align-items: center;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px var(--glass-shadow);
  max-width: 500px;
  margin: 0 auto; /* 居中 */
  transition: all 0.3s ease;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%; /* 圆形头像 */
  margin-right: 20px;
  object-fit: cover;
  border: 2px solid var(--glass-border);
}

.info h2 {
  margin: 0;
  font-size: 1.5em;
  font-weight: 700; 
  /* 白天是深灰 #2c3e50，晚上自动变纯白 #fff */
  color: var(--text-primary); 
}

.info p {
  margin: 5px 0 0;
  line-height: 1.5; /* 增加行高，阅读更舒服 */
  color: var(--text-secondary); 
}
</style>
