#!/usr/bin/env sh

# 发生错误时终止
set -e

# 1. 构建
npm run build

# 2. 进入构建文件夹
cd dist

# 3. 提交
git init
git checkout -B main
git add -A
git commit -m 'deploy'

# 4. 推送到 gh-pages 分支
git push -f https://github.com/phenol-cat/homepage.git main:gh-pages

cd -