# 事件追踪器微信小程序原型

## 项目简介

【事件追踪器】是一款面向社区的微信小程序原型，支持事件的全流程追踪、进展记录与透明化管理。原型采用高保真 HTML + Tailwind CSS 实现，界面风格现代，严格遵循微信小程序设计规范，适配 iPhone 13 mini 尺寸。

## 主要特性
- 登录/注册、微信授权、小区绑定
- 事件列表、详情、进展、评论、搜索
- 事件发布、进展创建、图片上传、标签管理
- 用户中心、账号安全、个人信息编辑
- 消息通知、事件关联图谱
- 所有页面均为独立 HTML 文件，主入口 index.html 以 iframe 平铺展示

## 页面结构

```mermaid
graph TD
  A[登录/注册 login.html]
  B[微信授权 auth-profile.html]
  C[小区绑定 estate-binding.html]
  D[首页/事件列表 home.html]
  E[事件详情 event-detail.html]
  F[发布事件 publish.html]
  G[创建进展 create-timeline.html]
  H[评论/进展互动 update-comment.html]
  I[搜索 search.html]
  J[消息通知 notifications.html]
  K[用户中心 user-center.html]
  L[账号安全 account-security.html]
  M[个人信息编辑 user-edit.html]
  N[事件关联图谱 event-relations.html]
  O[删除进展确认 delete-progress-confirm.html]
  P[编辑事件 edit-event.html]
  Q[事件详情（发起者）event-detail-owner.html]

  A --> B
  B --> C
  C --> D
  D --> E
  D --> F
  D --> I
  D --> J
  D --> K
  E --> G
  E --> H
  K --> L
  K --> M
  E --> N
  G --> O
  H --> O
  E --> P
  D --> Q
  Q --> P
  Q --> G
```

## 主要页面功能说明
- **login.html**：手机号/账号登录、注册、协议勾选
- **auth-profile.html**：微信授权弹窗
- **estate-binding.html**：绑定小区
- **home.html**：事件分类、搜索、TabBar、发布入口
- **event-detail.html**：事件详情、进展、评论（普通用户视角）
- **event-detail-owner.html**：事件详情（发起者视角），含编辑、删除、邀请协作者、修改状态等操作
- **publish.html**：事件发布、图片、标签
- **create-timeline.html**：添加进展
- **update-comment.html**：评论、状态切换、删除进展
- **search.html**：关键词/标签搜索
- **notifications.html**：消息通知
- **user-center.html**：个人中心、资料、账号安全
- **account-security.html**：用户名/密码修改
- **user-edit.html**：编辑个人信息
- **event-relations.html**：事件关联图谱
- **delete-progress-confirm.html**：删除进展确认
- **edit-event.html**：编辑事件，表单预填充，支持二次修改与保存

## 技术栈与设计规范
- HTML5 + Tailwind CSS + FontAwesome
- 现代化 UI，圆角、状态栏、底部导航栏
- 图片资源来自 Unsplash/Pexels/Apple 官方
- 严格遵循微信小程序 iOS/Android 设计规范

## 目录结构
```
├── index.html                # 主入口，iframe 平铺所有页面
├── home.html                 # 首页/事件列表
├── login.html                # 登录/注册
├── auth-profile.html         # 微信授权
├── estate-binding.html       # 小区绑定
├── event-detail.html         # 事件详情（普通用户）
├── event-detail-owner.html   # 事件详情（发起者视角），含邀请编辑等
├── publish.html              # 发布事件
├── create-timeline.html      # 创建进展
├── update-comment.html       # 评论/进展互动
├── search.html               # 搜索
├── notifications.html        # 消息通知
├── user-center.html          # 用户中心
├── account-security.html     # 账号安全
├── user-edit.html            # 个人信息编辑
├── event-relations.html      # 事件关联图谱
├── delete-progress-confirm.html # 删除进展确认
├── edit-event.html           # 编辑事件（表单预填充，二次编辑）
├── assets/                   # 静态资源（图片、样式等）
├── screenshot/               # 截图工具目录
│   ├── screenshot.js         # 截图脚本
│   └── package.json          # 截图工具依赖
```

## 预览方式
1. 使用现代浏览器（推荐 Chrome）打开 `index.html`，即可预览全部原型页面。
2. 所有页面均为静态 HTML，无需后端环境。

## 截图工具使用说明

为方便原型页面的截图保存，项目提供了一个按照iPhone 13 mini尺寸(375x812)截取HTML页面的工具。

### 截图工具安装

1. 确保已安装Node.js (建议12.0.0或更高版本)
2. 在项目目录执行以下命令安装依赖：

```bash
npm install
```

### 截图工具使用方法

#### 截取单个HTML文件

```bash
node screenshot.js --file <HTML文件路径> --output <输出目录>
```

例如：

```bash
node screenshot.js --file home.html --output screenshots
```

#### 批量处理目录下的所有HTML文件

```bash
node screenshot.js --dir <HTML文件目录> --output <输出目录>
```

例如：

```bash
node screenshot.js --dir ./ --output screenshots
```

截图将以PNG格式保存，命名与原HTML文件相同。

## 更新日志

- 2025-05-15:
  - [create-timeline.html]
    - 新增富文本编辑功能，支持所见即所得的文本格式化
    - 添加格式工具栏，支持文本加粗和超链接功能
    - 优化编辑器界面，实现工具栏与编辑区无缝衔接
    - 支持Markdown语法自动转换（**文字**自动转为加粗，[文字](链接)自动转为超链接）
    - 添加超链接弹窗，支持链接文字和URL分别设置
    - 优化编辑器焦点处理和选区管理，提升编辑体验
  - [event-detail.html]
    - 优化事件时间线内容，展示富文本格式效果
    - 使用加粗样式突出每条进展的标题行
    - 采用结构化段落和换行优化进展内容排版
    - 展示超链接样式，增强内容的可读性和交互性
    - 完善进展内容结构，使用小标题和编号列表提升信息层次

- 2025-05-14:
  - 新增基于Node.js和Puppeteer的HTML页面截图工具，按照iPhone 13 mini尺寸(375x812)截取页面。
  - 支持单个页面截图和批量处理功能，自动保存为PNG格式。

- 2025-05-13：
  - [event-detail.html] 
    - 重新设计时间线UI，优化布局和信息展示
    - 调整类型标签和互动区位置，统一视觉风格
    - 修改颜色方案，用户名和互动图标改为灰色
    - 修复内容溢出问题，优化容器显示
    - 实现微信小程序分享链接自动复制功能，支持复制事件标题与小程序路径
    - 新增分享弹窗，采用动画过渡效果，显示完整分享内容
  - [update-comment.html]
    - 优化界面结构，新增用户信息展示
    - 调整标签位置，简化按钮和文本显示
    - 统一互动功能，新增"踩"按钮，更改点赞图标

- 2025-05-12：
  - [publish.html] 发布事件页面新增"事件开始时间"卡片，支持用户录入事件的开始时间。
  - [create-timeline.html] 创建新进展页面新增"进展开始时间"卡片，支持用户录入进展的开始时间。
  - [edit-event.html] 新增编辑事件页面，支持事件内容的二次编辑与保存，event-detail.html 菜单增加"编辑"入口。
  - [event-detail.html] 修改为普通用户视角，移除事件操作菜单。
  - [event-detail-owner.html] 新增事件发起者视角详情页，支持邀请协作者、编辑事件、删除事件等操作。
  - [event-detail.html, event-detail-owner.html] 事件时间线新增排序功能，支持按时间正序和倒序排列，按钮使用图标并提供悬浮提示。
