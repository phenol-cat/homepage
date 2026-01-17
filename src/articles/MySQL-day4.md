---
title: "MySQL-day4"
date: "2026-1-16"
desc: "MySQL的约束"
tags: [ "MySQL","date是开始学一个知识点的日期"]
---

## 约束constraint
### 主键约束
#### 概念
MySQL主键约束是一个列或多个列的组合，其值能唯一的标识表中的每一行，方便再RDBMS中尽快地找到某一行。  
主键约束相当于唯一约束+非空约束的组合，主键约束列不允许重复，也不允许出现空值。  
每个表最多只允许一个主键。  
主键约束的关键字是：*primary key*  
当创建主键的约束时，系统会默认在所有的列和列组合上键对应的唯一索引。  
#### 操作
|操作|代码|
|:---|:---|
|添加单列主键|在定义字段时在后面添加*primary key*，如*studentID int primary key;*|
|添加多列联合主键|*constraint 主键名字 primary key(字段1，字段2,...);  ***只能**写在所有字段定义之后|
|添加主键（建表后）|*alter table 表名 add primary key (字段名);*|
|删除主键|*alter table drop primary key;*(只有一个主键所以不用指定)| 
### 自增长约束 (AUTO_INCREMENT)

| 操作 | 语法 / 代码 | 说明 |
| :--- | :--- | :--- |
| **建表时设置** | *id INT PRIMARY KEY AUTO_INCREMENT;* | 最常用的写法，通常配合主键使用。 |
| **建表后添加** | *ALTER TABLE 表名 MODIFY id INT AUTO_INCREMENT;* | 前提：id 字段必须已经是主键或有索引。 |
| **删除自增长** | *ALTER TABLE 表名 MODIFY id INT;* | 其实就是重新定义字段，把*AUTO_INCREMENT*去掉即可。 |
| **设置起始值** | *ALTER TABLE 表名 AUTO_INCREMENT = 100;* | 让下一次插入的 ID 直接从 100 开始 (比如用于分段 ID)。 |
| **触发方式** | *INSERT INTO 表 VALUES (NULL, '张三');* <br> 或 *INSERT INTO 表 (name) VALUES ('张三');* | 插入 *NULL*、*0* 或 **不指定该字段**，都会触发自增。 |

> **注意事项：**
> 1. 一张表**只能有一个**自增长字段。
> 2. 该字段的数据类型必须是**整数** (如 INT, BIGINT)。
> 3. 该字段必须包含在**索引**中 (通常是 PRIMARY KEY)。
> 4. **DELETE** 删除数据后，自增序号**不会**重置；**TRUNCATE** 清空表后，自增序号**会**重置为 1。


