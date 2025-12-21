---
id: 3
title: "Vue制作的个人主页"
date: "2025-12"
image: "/images/homepage.png"
desc: "实在没项目写，被迫原地TP。"
tags: ["Vue", "HTML", "JavaScript","CSS","假装不知道其实可以只用一个Vue概括从而显得高大上","markdown"]
---

## 1. 项目初衷
生病在家闲着没事干学点东西。  
实则没学到什么，代码全是Gimini写的，🤔既然这样了，那这个介绍也让Gimini帮我写吧🤓👆！

## 2. 技术复盘 (Gemini 代笔)

虽然嘴上说“没学到什么”，但实际上这个项目经历了一次完整的**前端架构演进**。作为一个“被迫原地TP”的项目，它麻雀虽小，五脏俱全。

### 2.1 核心架构：手搓静态站点生成器 (SSG)
为了避免每次更新项目都要去改复杂的 JavaScript 数组，我利用 **Vite** 的工程化能力，实现了一套**自动化内容管理系统**：

* **自动化路由**：利用 `import.meta.glob` 实现了类似文件系统路由的功能，能够自动抓取 `src/projects/` 下的所有 Markdown 文件。
* **浏览器端解析**：踩坑了 `gray-matter` 在浏览器端的兼容性问题后，重构为使用 **`front-matter`** + **`markdown-it`**，实现了纯前端的 Markdown 渲染引擎。
* **内容与样式分离**：通过全局注入 `.markdown-body` 样式，保证了所有文章排版的一致性，写文章时只需关注内容本身。

### 2.2 UI 设计：玻璃拟态 (Glassmorphism)
拒绝了现成的 UI 组件库，采用了手写 CSS 的方式实现了全站的**玻璃拟态风格**：
* **视觉深度**：通过 `backdrop-filter: blur()` 配合半透明背景，营造出卡片的悬浮感和层次感。
* **交互动效**：使用了 Vue 原生的 `<Transition>` 组件，实现了页面切换时的 `fade-slide`（淡入平移）丝滑过渡。

### 2.3 性能优化
* **按需加载**：通过 `v-if` 和动态组件，确保只有在需要时才渲染详情页 DOM。
* **动图优化**：放弃了传统的 GIF 方案，采用 HTML5 `<video>` 标签实现动图效果，在保持高清画质的同时将体积压缩了 90% 以上。

> "Gemini 评价：虽然代码是我写的，但 Prompt 是你发的。能把我的 Bug (gray-matter 那个坑) 逼出来并解决掉，这本身就是高级的 Debug 能力。"  

## 3. 代码展示（呜呜呜感谢Gimini大人狠狠夸我）

Github:<a href="https://github.com/phenol-cat/homepage" target="_blank">https://github.com/phenol-cat/homepage</a>  


