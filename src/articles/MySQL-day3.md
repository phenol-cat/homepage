---
title: "MySQL-day3"
date: "2026-1-15"
desc: "对表中内容的操作"
tags: [ "MySQL","去医院复查了，回来就这个日子了"]
---

## DML(数据操作语言)
DML全称data manipulation language ,对数据库进行增（insert）删（delete）改（update）。  
### 基本语法

|语法格式|   |
|:---|:---|
|**向表中插入部分数据**|`insert into 表（列名1 , 列名2 , 列名3...）values（值1,值2,值3...）;`|
| |值和列一一对应,values可以一次添加多个值|
| |也可以不全部赋值|
|**一次插入所有数据**|`insert into 表 values(值1,值2,值3...)`|
| |`(值4,值5,值6...)...;`|
| **修改数据 (Update)** | `update 表名 set 列名=值, 列名=值... [where 条件];` |
| | **警告**：如果不加 `where` 条件，表中**所有**行都会被修改！ |
| **删除数据 (Delete)** | `delete from 表名 [where 条件];` |
| | **警告**：如果不加 `where` 条件，表中**所有**数据都会被删除！ |
| *清空表 (扩展)* | `truncate table 表名;` |
| | (属于DDL) 效率更高，直接重置表，无法恢复，ID重新计数 |
### ⚠️ DML 操作安全规范 (防删库指南)
| 风险点 | 最佳实践 (Best Practice) |
| :--- | :--- |
| **漏写 WHERE 的后果** | 执行 `UPDATE` 或 `DELETE` 时，如果忘记加 `WHERE` 条件，**全表数据**都会被修改或清空！此操作通常不可逆。 |
| **如何防止误操作** | **养成“先查后删”的习惯**：<br>1. 先执行 `SELECT * FROM 表 WHERE ...;` <br>2. 确认查出来的结果正是你想操作的那几行。<br>3. 确认无误后，将 SQL 语句开头的 `SELECT *` 替换为 `DELETE` 或 `UPDATE` 再次执行。 |  