# 代码评审记录助手

一个 VS Code 扩展，专为提高代码评审效率而设计，让您直接在 VS Code 中进行代码评审和添加评论。

## 功能特性

- 🔍 快速代码选择评审
  - 选中代码后使用快捷键 `Cmd+Shift+D` (Mac) 或 `Ctrl+Shift+D` (Windows/Linux) 打开评审面板
  - 选中代码后右键选择 "Review Code" 打开评审面板

- 💬 智能评论系统
  - 选中的代码自动显示在评审面板中
  - 评论框中自动预填充选中的代码内容
  - 便捷的代码片段修改和注释功能
  - 一键提交并标识评论人
  - 快速评论人选择按钮（启涵、鹏飞、昕一、赵祥）

- 📋 评论管理
  - 按时间顺序显示所有评审评论
  - 评论详细信息包含：
    - 评论人姓名
    - 文件路径
    - 代码行号
    - 评论时间
    - 评论内容
  - 批量操作功能：
    - 复制所有评论（按格式化结构）
    - 清空所有评论（需确认）
  - 评论格式：`[序号]. [文件路径] [评论内容] -- [评论人]`

- 🔄 Git 集成
  - 自动检测已追踪文件的提交者信息
  - 优雅处理未追踪文件
  - 状态指示：
    - 新文件显示为 "Unknown"
    - 未加入 git 的文件显示为 "Untracked"
    - 已追踪文件显示原始提交者姓名

## 安装方法

1. 下载 `.vsix` 文件
2. 打开 VS Code
3. 进入扩展视图（`Ctrl+Shift+X` 或 `Cmd+Shift+X`）
4. 点击扩展面板右上角的 "..." 菜单
5. 选择 "Install from VSIX..." 并选择下载的文件

## 使用说明

### 添加评审评论
1. 选择要评审的代码
2. 打开评审面板：
   - 使用快捷键：`Cmd+Shift+D` (Mac) 或 `Ctrl+Shift+D` (Windows/Linux)
   - 或右键选择 "Review Code"
3. 在评论框中查看和修改预填充的代码
4. 点击评论人按钮（启涵/鹏飞/昕一/赵祥）提交评论

### 评论管理
- 按时间顺序查看所有评论
- 使用"复制"按钮复制格式化的评论
- 使用"清空"按钮删除所有评论（需确认）

### 评论格式
复制评论时会自动格式化为：
\`\`\`
1. 文件路径/文件名.js 评论内容 -- 评论人
2. 文件路径/其他文件.js 评论内容 -- 评论人
\`\`\`

## 系统要求
- VS Code 版本 1.70.0 或更高
- Git（可选，用于检测提交者信息）

## 已知限制
- Git 提交者检测需要文件在 git 仓库中被追踪
- 未追踪或新文件会显示为 "Unknown" 或 "Untracked"
- 评论存储在 VS Code 的工作区状态中，仅限于当前工作区
