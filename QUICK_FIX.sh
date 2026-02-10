#!/bin/bash

# 快速修复 Git 大文件问题
# 这个脚本会重新初始化 Git 仓库，移除所有历史中的大文件

set -e  # 遇到错误立即退出

echo "⚠️  警告：这个操作会删除所有 Git 历史！"
echo "📦 正在备份当前代码..."
cd ..
cp -r bella-delivery-upload-ui bella-delivery-upload-ui-backup-$(date +%Y%m%d-%H%M%S)
cd bella-delivery-upload-ui

echo "🗑️  删除旧的 Git 历史..."
rm -rf .git

echo "🔄 初始化新的 Git 仓库..."
git init

echo "📝 添加 .gitignore 并提交..."
git add .gitignore
git commit -m "Initial commit: Add .gitignore"

echo "📦 添加所有项目文件（node_modules 会被自动忽略）..."
git add .
git commit -m "Add project files"

echo "✅ 完成！"
echo ""
echo "下一步："
echo "1. 检查文件是否正确添加: git status"
echo "2. 检查 node_modules 是否被忽略: git ls-files | grep node_modules"
echo "3. 连接到远程仓库: git remote add origin https://github.com/ruilinlin/bella-delivery-upload-ui.git"
echo "4. 推送代码: git push -u origin main --force"
echo ""
echo "⚠️  注意：使用 --force 会覆盖远程仓库的所有历史！"
