<template>
  <div class="about-content-area">
      
    <header class="header-section">
      <h1 class="name">你好，我是三硝基猫猫酚！</h1>
    </header>

    <article class="article-body">
      <p>我是2024级南京大学智能科学与技术学院的一名学生</p>
      <h2 class="section-title">关于“人如其名”</h2>
      
      <p>
        我知道这个网名看起来很奇怪，其实这是我高中时起的。
      </p>

      <p>
        因为我很喜欢化学，也很喜欢猫猫。有一天上课发呆突然来了灵感，想搞一个有点技术含量、听起来很凶猛但又带点可爱的名字，于是诞生了初版——“三硝基甲猫猫”（TNT，炸药猫）。
      </p>

      <p>
        后来我发现<strong>“苦味酸” (三硝基苯酚)</strong> 其实更适合我的性格：
      </p>

      <ul class="simple-list">
        <li><strong>苦</strong>：没头脑且不高兴的苦；</li>
        <li><strong>酸</strong>：比较自卑，羡慕别人的酸；</li>
        <li><strong>爆</strong>：脾气不好，易燃易爆；</li>
        <li><strong>萌</strong>：但是...又稍微带点可爱。</li>
      </ul>

      <p>
        因此，这个名字就一直沿用至今（虽然但是英文不太好翻译，简化为了phenol_cat）。
      </p>
    </article>

    <header class="section">
      <h1 class="section-title">关于我</h1>
    </header>

    <article class="article-body">
      <p>
        微微社恐，笔电男大，游戏死宅，<s>变态兽耳娘控</s> , <s>谁家小孩</s>, 怎么说都好，这些都是我。
      </p>
      <p>
        经历了一些不幸后，我反而对自己的未来有了更清晰的规划，在接下来的日子里我会学习一些新技能,不虚度光阴，脚踏实地度过每一天。
      </p>
      <p>其实我也希望我学的东西能让我到社会上稍微有点竞争力啦...</p>
    </article>

    <header class="section">
      <h1 class="section-title">如果你想找我玩</h1>
    </header>

    <article class="article-body">
      <p>我的GitHub主页是:</p>
      <a href="https://github.com/phenol-cat" target="_blank">https://github.com/phenol-cat</a>
      <p>我的B站主页是:</p>
      <a href="https://space.bilibili.com/522695854" target="_blank">https://space.bilibili.com/522695854</a>
      <p>我的邮箱是:</p>
      <a >241880512@smail.nju.edu.cn</a>
      <p>顺嘴一提，我的steam好友码是<a>1776774789</a>，战网是<a>风笛#51501</a>，欢迎来找我玩喵</p>
    </article>
  </div>
</template>

<style scoped>
/* 核心控制区 
   限制内容的最大宽度，防止在大屏上文字拉得太长导致阅读困难。
   margin: 0 auto 实现水平居中。
*/
.about-content-area {
  max-width: 800px;
  margin: 0 auto;
  /* 不需要任何背景色和阴影了，直接透出底层的毛玻璃 */
}

/* --- 头部样式 --- */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  /* 底部加一条非常淡的分割线，增加仪式感 */
  border-bottom: 1px solid rgba(0,0,0,0.05); 
  padding-bottom: 30px;
}

.name {
  font-size: 2.5rem; /* 字体稍微加大一点 */
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-weight: 700;
  letter-spacing: 1px;
}

.university {
  font-size: 1.1rem;
  color: #606c76; /* 稍微深一点的灰色，增加质感 */
  font-weight: 400;
  margin: 0;
}

/* --- 正文样式 --- */
.article-body {
  color: #34495e;
}

.section-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 25px;
  font-weight: 600;
}

p {
  line-height: 1.8; /* 保持舒适的行高 */
  margin-bottom: 22px;
  font-size: 1.05rem;
  /* 两端对齐，让文字块在视觉上更整齐、学院派 */
  text-align: justify; 
}

/* 加粗文字样式：仅加粗，无背景色 */
strong {
  font-weight: 700;
  color: #2c3e50;
}

/* 列表样式：极简引用风格 */
.simple-list {
  padding-left: 0;
  margin: 25px 0 35px 0;
  /* 左侧一条细线，不喧宾夺主 */
  border-left: 3px solid rgba(0,0,0,0.1); 
  margin-left: 5px;
}

.simple-list li {
  margin-bottom: 12px;
  line-height: 1.7;
  list-style-type: none;
  padding-left: 20px; /* 文字离左边的线稍微远一点 */
}
</style>