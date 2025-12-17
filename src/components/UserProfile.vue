<script setup>
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
  <div class="profile-card">
    <img :src="avatar" alt="头像" class="avatar" />
    
    <div class="info">
      <h2>{{ name }}</h2>
      <p>{{ bio }}</p>
    </div>
  </div>
</template>

<style scoped>
/* scoped 意味着这里的 CSS 只对当前组件生效，不会污染其他组件 */
/* 这就像 C++ 的 private 成员，外部无法访问 */

.profile-card {
  display: flex; /* 弹性布局，让头像和文字并排显示 */
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* 简单的阴影 */
  max-width: 500px;
  margin: 0 auto; /* 居中 */
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%; /* 圆形头像 */
  margin-right: 20px;
  object-fit: cover;
}

.info h2 {
  margin: 0;
  font-size: 1.5em;
  color: #333;
}

.info p {
  margin: 5px 0 0;
  color: #666;
}
</style>