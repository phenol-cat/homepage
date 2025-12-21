---
id: 1
title: "QQ Bot 插件系统"
date: "2025-11"
image: "/images/bot.png"
tags: ["Python", "Napcat","WebSocket"]
desc: "基于 Python 的 QQ 机器人插件，实现了自动回复与定时发送指定图片，好感度对话等功能。"
---

## 1. 项目初衷
其实就是想写一个跟群友调情的小bot，顺便学一下互联网通讯，调用api之类的怎么搞。  
从名字劝🦌猫猫也能看出来不是什么正经bot（
<img src="/images/bot_image2.png" width="50%">
## 2. 效果展示
主要使用python，监听napcat传来的消息，检测关键词判断是否需要回复，然后根据好感度系统调用api进行特定回复或者调用功能模块。  
<img src="/images/bot_image1.png" width="50%">
每个群可以单独配置某一项功能是否打开。  
(其实实现的功能很少，也就发发涩图，打招呼根据好感度固定回复，还有给某个人一直贴糖，不过框架在这里，还可以写)   
## 3. 代码展示
代码没什么好看的，很乱，也没什么有用的  
<a href="https://github.com/phenol-cat/myQQBot" target="_blank">但是如果你想看的话</a>  
在这里推荐一下Napcat，其实只要配置好了这个，写bot很简单的！  
<a href="https://github.com/NapNeko/NapCatQQ" target="_blank">Napcat的Github页面</a>