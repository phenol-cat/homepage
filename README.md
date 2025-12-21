# ✨ My Personal Glassmorphism Homepage | 我的个人玻璃拟态主页

> "即使现在看不到进步，也要相信：我是一个随时间变化的指数函数。" 🚀

这是一个基于 **Vue 3 + Vite** 构建的现代化个人主页。项目采用了极具质感的 **Glassmorphism（玻璃拟态）** 设计风格，集成了个人介绍、项目展示、文章博客以及好友列表等功能。

这个项目不仅仅是一个静态网页，它见证了我从零开始搭建前端工程、解决部署难题、打磨 UI 细节的全过程。

## 📸 预览 (Screenshots)

*(建议：请在这里放一张你网站的截图，保存在 public/images/ 目录下，然后取消下面的注释)*

## ✨ 特性 (Features)

* **🎨 极致的玻璃拟态设计**：全站采用磨砂玻璃质感，配合动态背景，视觉效果通透且高级。
* **🌗 丝滑的日夜切换**：内置深色模式（Dark Mode），基于 CSS 变量实现，一键切换黑金/白银风格。
* **🧘‍♂️ 独创“沉浸模式” (Zen Mode)**：点击左下角画框按钮，UI 自动隐去，只留背景与呼吸，供纯粹欣赏与截图。
* **📱 响应式布局**：完美适配桌面端与移动端，侧边栏在手机端自动调整。
* **📝 Markdown 文章渲染**：文章内容支持 Markdown 编写，图片资源统一管理。
* **🚀 自动化部署**：集成了 GitHub Actions / Shell 脚本，一键打包并发布至 GitHub Pages。

## 🛠 技术栈 (Tech Stack)

* **核心框架**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup)
* **构建工具**: [Vite](https://vitejs.dev/)
* **样式处理**: Native CSS3 (Variables, Flexbox, Grid, Backdrop-filter)
* **部署托管**: GitHub Pages

## 📂 目录结构 (Directory Structure)

```text
my-personal-home/
├── public/              # 静态资源 (Vite 不处理，直接复制到根目录)
│   └── images/          # 存放文章图片、头像、背景图
├── src/
│   ├── assets/          # 编译资源 (组件内的图标等)
│   ├── components/      # 通用组件 (ProjectCard, ThemeSwitch, ZenButton 等)
│   ├── views/           # 页面视图 (AboutMe, MyArticles, MyProjects 等)
│   ├── App.vue          # 根组件 (布局入口)
│   └── main.js          # 项目入口
├── deploy.sh            # 自动部署脚本
├── vite.config.js       # Vite 配置 (包含 base 路径设置)
└── README.md            # 项目说明

```

## 🚀 快速开始 (Quick Start)

如果你想在本地运行这个项目：

1. **克隆仓库**
```bash
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名

```


2. **安装依赖**
```bash
npm install

```


3. **启动开发服务器**
```bash
npm run dev

```


打开浏览器访问 `http://localhost:5173` 即可。

## 📦 构建与部署 (Deployment)

本项目配置了自动化脚本，用于发布到 GitHub Pages。

1. **修改配置**
确保 `vite.config.js` 中的 `base` 属性与你的 GitHub 仓库名一致。
2. **一键发布**
在终端（Git Bash）运行：
```bash
sh deploy.sh

```


脚本会自动执行 `npm run build`，并将 `dist` 目录推送到远程的 `gh-pages` 分支。

## 📝 待办事项 (To-Do)

* [x] 完成基础 UI 搭建
* [x] 实现夜间模式
* [x] 增加 Zen 沉浸模式
* [ ] 撰写更多 Markdown 文章
* [ ] 优化移动端交互体验
* [ ] 添加评论功能 (Coming soon...)

## 🤝 致谢

特别感谢在这个项目开发过程中提供灵感与协助的 **AI Thought Partner (Gemini)**。是它陪我解决了 CSS 布局的难题、修复了 GitHub Pages 的 404 错误，并一起打磨出了这个可爱的网站。

---

**© 2025 三硝基猫猫酚** | Made with ❤️ and Vue.js

---

### 💡 给你的小建议：

1. **截图**：README 里最吸引人的就是图。你刚才不是正好在学“沉浸模式”吗？打开沉浸模式，截一张好看的背景图，再截一张普通模式和夜间模式的图。
2. **放置图片**：把截图放在 `public/images/` 里（比如叫 `preview.png`），然后在 README 里把 `这行的注释符号` 去掉，文件名改对即可。

快去给你的项目贴上这个漂亮的“说明书”吧！🎉