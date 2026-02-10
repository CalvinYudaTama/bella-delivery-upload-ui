# 清理 Git 历史中的大文件

## 当前状态
- ✅ `.gitignore` 已更新并提交
- ❌ `node_modules` 仍在 Git 历史中（包括 123.90 MB 的大文件）
- ⚠️ 远程分支显示为 "gone"

## 解决方案

### 方案 1: 使用 git filter-branch（推荐用于少量提交）

```bash
# 1. 从所有提交中移除 node_modules
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch node_modules .next" \
  --prune-empty --tag-name-filter cat -- --all

# 2. 清理引用
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# 3. 清理和压缩
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 方案 2: 使用 BFG Repo-Cleaner（更快，推荐）

```bash
# 1. 安装 BFG（如果未安装）
# brew install bfg

# 2. 克隆一个裸仓库（用于清理）
cd ..
git clone --mirror bella-delivery-upload-ui bella-delivery-upload-ui-clean.git

# 3. 使用 BFG 清理
cd bella-delivery-upload-ui-clean.git
bfg --delete-folders node_modules
bfg --delete-folders .next

# 4. 清理和压缩
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. 推回原仓库
cd ../bella-delivery-upload-ui
git remote set-url origin ../bella-delivery-upload-ui-clean.git
git fetch
git push origin --all --force
```

### 方案 3: 重置并重新提交（最简单，如果历史不重要）

```bash
# 1. 备份当前代码
cp -r . ../bella-delivery-upload-ui-backup

# 2. 创建新的初始提交
rm -rf .git
git init
git add .gitignore
git commit -m "Initial commit with proper .gitignore"

# 3. 添加所有文件（node_modules 会被忽略）
git add .
git commit -m "Add project files"

# 4. 强制推送到远程（⚠️ 这会删除所有历史）
git remote add origin https://github.com/ruilinlin/bella-delivery-upload-ui.git
git push -u origin main --force
```

### 方案 4: 只清理最近的提交（如果大文件只在最新提交中）

```bash
# 1. 软重置到上一个提交（保留更改）
git reset --soft HEAD~1

# 2. 从暂存区移除 node_modules
git reset HEAD node_modules .next

# 3. 重新提交
git add .gitignore
git commit -m "Update .gitignore to exclude node_modules and .next"
git add .
git commit -m "Add project files (excluding node_modules and .next)"
```

## 推荐步骤（基于你的情况）

由于你的提交历史很短（只有几个提交），建议使用**方案 3**（重置并重新提交）：

```bash
# 1. 确保所有更改已保存
git status

# 2. 备份（可选但推荐）
cd ..
cp -r bella-delivery-upload-ui bella-delivery-upload-ui-backup
cd bella-delivery-upload-ui

# 3. 删除 Git 历史并重新开始
rm -rf .git
git init

# 4. 添加 .gitignore 并提交
git add .gitignore
git commit -m "Initial commit: Add .gitignore"

# 5. 添加所有其他文件（node_modules 会被自动忽略）
git add .
git commit -m "Add project files"

# 6. 连接到远程并强制推送
git remote add origin https://github.com/ruilinlin/bella-delivery-upload-ui.git
git branch -M main
git push -u origin main --force
```

## ⚠️ 注意事项

- **方案 3 会删除所有 Git 历史**，如果历史很重要，使用方案 1 或 2
- **Force push 会覆盖远程仓库**，确保没有其他人在使用这个仓库
- **备份重要**，在执行任何操作前先备份
