<script setup>
  defineProps({
    title: String,
    description: String,
    tags: Array // 这里的类型是 Array，对应 C++ 的 vector 或 Python 的 list
  })
</script>

<template>
  <div class="project-item">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    
    <div class="tags">
      <span v-for="tag in tags" :key="tag" class="tag">
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.project-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px; /* 卡片之间的间距 */
  transition: transform 0.2s; /* 简单的动画效果 */
}

/* 鼠标悬停时稍微浮起，更有交互感 */
.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.tags {
  margin-top: 10px;
}

.tag {
  display: inline-block;
  background-color: #eee;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-right: 5px;
}
</style>