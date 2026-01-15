---
title: "MySQL-day3"
date: "2026-1-15"
desc: "MySQL基本语法"
tags: [ "MySQL","去医院复查了，回来就这个日子了"]
---

## DML(数据操作语言)
DML全称data manipulation language ,对数据库进行增（insert）删（delete）改（update）。  
### 基本语法

|语法格式|   |
|:---|:---|
|向表中插入部分数据|insert into 表（列名1 , 列名2 , 列名3...）values（值1,值2,值3...）;|
| |值和列一一对应,values可以一次添加多个值|
| |也可以不全部赋值|
|一次插入所有数据|insert into 表 values(值1,值2,值3...)|
| |(值4,值5,值6...)...;|

