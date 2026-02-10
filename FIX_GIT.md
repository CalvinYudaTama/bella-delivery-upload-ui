# 修复 Git 大文件问题

## 问题
`node_modules` 目录（包括 123.90 MB 的文件）被提交到了 Git，导致 push 失败。

## 解决方案

### 步骤 1: 从 Git 中移除 node_modules（但保留本地文件）
```bash
git rm -r --cached node_modules
git rm -r --cached .next
```

### 步骤 2: 提交更改
```bash
git add .gitignore
git commit -m "Remove node_modules and .next from Git, update .gitignore"
```

### 步骤 3: 如果之前已经 push 过，需要清理 Git 历史
如果 `node_modules` 已经在远程仓库中，需要从历史中移除：

```bash
# 使用 git filter-branch 或 git filter-repo 移除大文件
# 注意：这会重写 Git 历史，如果已经 push 过，需要 force push

# 方法 1: 使用 git filter-branch (如果文件在最近的提交中)
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch node_modules" \
  --prune-empty --tag-name-filter cat -- --all

# 方法 2: 使用 BFG Repo-Cleaner (推荐，更快)
# 首先安装: brew install bfg
# 然后运行:
# bfg --delete-folders node_modules
# git reflog expire --expire=now --all && git gc --prune=now --aggressive

# 方法 3: 如果只是最近的提交，可以重置
# git reset --soft HEAD~1  # 撤销最后一次提交但保留更改
# git add .gitignore
# git commit -m "Update .gitignore"
```

### 步骤 4: Push 更改
```bash
# 如果是第一次 push，直接 push
git push origin main

# 如果已经 push 过并且清理了历史，需要 force push（谨慎使用）
# git push origin main --force
```

## 注意事项
- ⚠️ 如果使用 `git filter-branch` 或 `BFG`，会重写 Git 历史
- ⚠️ 如果已经 push 过，force push 会影响其他协作者
- ✅ 建议：如果是新项目或只有你一个人，可以直接 force push
- ✅ 如果是团队项目，建议创建新分支或与团队协商
