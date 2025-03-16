# 社区事件追踪小程序开发文档

## 目录结构
1. [项目概览](#项目概览)
2. [页面结构](#页面结构)
3. [数据模型](#数据模型)
4. [开发规范](#开发规范)
5. [安全与合规](#安全与合规)
6. [附录](#附录)

## 项目概览
小程序实现社区事件追踪功能，包含事件管理、用户交互、数据可视化等核心模块。

## 页面结构
### 登录授权

1. **登录流程交互规范**
   - 使用`wx.getUserProfile`接口获取用户基本信息
   - 通过`wx.login`获取code提交至后端换取openid
   - 手机号绑定流程需用户主动触发按钮事件

2. **用户信息存储结构**
```json
{
  "openid": "用户唯一标识",
  "nickName": "用户昵称",
  "avatarUrl": "头像URL",
  "mobile": "加密手机号",
  "lastLogin": "最后登录时间戳"
}
```

3. **飞书users表字段映射**
| 本地字段 | 飞表字段 | 类型 |
|---------|---------|--------|
| openid | 用户ID | 自动编号 |
| nickName | 姓名 | text |
| avatar | 头像 | url |
| mobile | 联系方式 | phone |
| lastLogin | 最后活跃时间 | timestamp |

## 飞书多维表格API

### 页面路由映射表

| 页面路径 | 页面说明 | 功能描述 | 原型设计 HTML 文件 |
| --- | --- | --- | --- |
| pages/home/index | 首页 | 事件列表展示、搜索、筛选 | 原型设计/home.html |
| pages/event-detail/index | 事件详情 | 事件时间线、关联信息展示 | 原型设计/event-detail.html |
| pages/post-create/index | 发布帖子 | 创建新帖子、关联事件、上传图片 | 原型设计/post-create.html |
| pages/vote/index | 投票表决 | 参与事件投票、查看投票进度 | 原型设计/vote.html |
| pages/vote-success/index | 投票成功 | 投票完成后的结果展示 | 原型设计/vote-success.html |
| pages/comments/index | 评论讨论 | 查看和发表评论 | 原型设计/comments.html |
| pages/profile/index | 个人中心 | 用户信息、参与记录展示 | 原型设计/profile.html |
| pages/event-relation/index | 事件关联图 | 可视化展示事件关联关系 | 原型设计/event-relation.html |

## 数据模型
### 核心数据模型
#### 页面与数据表关系


### 首页 (pages/home/index)
- **关联数据表**: `events` 表
- **数据交互**: 
    - 页面加载时，从 `events` 表中获取事件列表，包括事件的标题、状态、开始时间、结束时间、评论数量和标签等信息。
    - 用户进行搜索和筛选操作时，根据条件从 `events` 表中过滤出符合要求的事件。

### 事件详情 (pages/event-detail/index)
- **关联数据表**: `events` 表和 `timeline` 表
- **数据交互**: 
    - 从 `events` 表中获取指定事件的详细信息，如事件标题、状态、开始时间、结束时间、评论数量和标签等。
    - 从 `timeline` 表中获取与该事件关联的时间线帖子，包括帖子内容、作者、创建时间、图片、点赞数量和评论数量等。

### 发布帖子 (pages/post-create/index)
- **关联数据表**: `posts` 表和 `events` 表
- **数据交互**: 
    - 用户创建新帖子时，将帖子的内容、作者、关联事件、图片等信息插入到 `posts` 表中。
    - 若有关联事件，会从 `events` 表中获取事件信息进行展示。

### 投票表决 (pages/vote/index)
- **关联数据表**: `events` 表和 `votes` 表
- **数据交互**: 
    - 从 `events` 表中获取指定事件的投票信息，如投票选项、投票进度等。
    - 用户进行投票时，将投票结果插入到 `votes` 表中，并更新 `events` 表中的投票进度。

### 投票成功 (pages/vote-success/index)
- **关联数据表**: `events` 表和 `votes` 表
- **数据交互**: 从 `events` 表中获取投票事件的详细信息，从 `votes` 表中获取用户的投票结果，用于展示投票成功后的结果。

### 评论讨论 (pages/comments/index)
- **关联数据表**: `posts` 表和 `comments` 表
- **数据交互**: 
    - 从 `posts` 表中获取指定帖子的详细信息。
    - 从 `comments` 表中获取与该帖子关联的评论列表，用户发表评论时，将评论信息插入到 `comments` 表中。

### 个人中心 (pages/profile/index)
- **关联数据表**: `users` 表、`posts` 表和 `events` 表
- **数据交互**: 
    - 从 `users` 表中获取用户的基本信息和参与记录。
    - 从 `posts` 表中获取用户发布的帖子列表，从 `events` 表中获取用户参与的事件列表。

### 事件关联图 (pages/event-relation/index)
- **关联数据表**: `events` 表和 `event_relations` 表
- **数据交互**: 
    - 从 `events` 表中获取指定事件的详细信息。
    - 从 `event_relations` 表中获取与该事件关联的其他事件信息，用于可视化展示事件关联关系。
- **实现所需API和工具**
    - **API调用**
        - 调用飞书多维表格API来获取 `events` 表和 `event_relations` 表的数据。具体调用流程可参考文档中“飞书多维表格API”部分，先获取 `tenant_access_token`，然后使用该token调用多维表格API获取所需数据。示例代码如下：
```javascript
// 假设这是获取事件关联数据的函数
async function getEventRelations(eventId) {
    const app = getApp();
    const accessToken = await app.getTenantAccessToken(); // 获取token
    const eventDetailUrl = `bitable/v1/apps/LGrcbUHMhasJgmsXOK5c3xCvnld/tables/tblGGeNFxIWyWkj6/records/${eventId}`;
    const eventRelationsUrl = `bitable/v1/apps/LGrcbUHMhasJgmsXOK5c3xCvnld/tables/tblEventRelations/records?filter=related_event_id='${eventId}'`; // 假设的关联表查询URL

    try {
        const eventDetailResult = await app.callFeishuAPI(eventDetailUrl, 'GET', accessToken);
        const eventRelationsResult = await app.callFeishuAPI(eventRelationsUrl, 'GET', accessToken);

        return {
            eventDetail: eventDetailResult.data,
            eventRelations: eventRelationsResult.data.items
        };
    } catch (error) {
        console.error('获取事件关联数据失败:', error);
        return null;
    }
}

- **可视化工具**
    - 在前端可以使用 `ECharts` 或 `D3.js` 来实现事件关联图的可视化。这些工具可以帮助将获取到的数据转换为直观的图形展示。以 `ECharts` 为例，需要在项目中引入 `ECharts` 库，然后根据获取到的数据配置图表选项。示例代码如下：

    // 假设这是初始化事件关联图的函数
function initEventRelationChart(data) {
    const myChart = echarts.init(document.getElementById('event-relation-chart'));

    const option = {
        // 配置图表选项，根据数据生成节点和边
        series: [
            {
                type: 'graph',
                data: data.nodes,
                links: data.links,
                // 其他配置项...
            }
        ]
    };

    myChart.setOption(option);
}


## 开发规范
### 样式规范


### 设计尺寸单位换算
- 小程序使用rpx作为尺寸单位
- 750rpx = 100%屏幕宽度
- 设计稿按照750px宽度设计，1px = 1rpx

### 主题色变量
```css
--primary-color: #07C160;  /* 主题绿色 */
--primary-light: #f0f9f0;  /* 浅绿色背景 */
--text-color: #333333;     /* 主文本色 */
--text-color-light: #999999; /* 次要文本色 */
--border-color: #eeeeee;   /* 边框颜色 */
--bg-color: #f7f7f7;       /* 背景色 */
```

### 常用样式类
- .container : 页面容器
- .content : 内容区域
- .card : 卡片样式
- .tag : 标签样式
- .btn : 按钮基础样式
- .btn-primary : 主要按钮
- .btn-outline : 描边按钮
- .fab : 悬浮按钮
- .text-ellipsis : 单行文本溢出省略
- .text-ellipsis-2 : 两行文本溢出省略
- .divider : 分隔线
- .safe-bottom : 底部安全区域
- .safe-top : 顶部安全区域
- .vote-progress : 投票进度条样式
- .vote-bar : 投票进度条内的进度样式


### 依赖管理


| 依赖名称 | 版本 | 用途 |
| --- | --- | --- |
| WeUI | 2.5.16 | 微信官方UI组件库 |

基础库版本用 3.0.2

#### 实体结构定义


### 帖子结构```javascript
Post {
  id: String,          // 帖子唯一ID
  content: String,     // 内容
  type: String,        // 类型(文字/图片/视频)
  location: Object,    // 地理位置
  createTime: Date,    // 创建时间
  authorId: String,    // 作者ID
  eventId: String,     // 关联事件ID
  tags: Array,         // 事件标签
  links: Array,        // 关联帖子ID
  likeCount: Number,   // 点赞数量
  commentCount: Number // 评论数量
}
```

### 事件结构
```javascript
Event {
  id: String,          // 事件ID
  title: String,       // 事件标题
  status: String,      // 状态(进行中/已结束)
  startTime: Date,     // 开始时间
  endTime: Date,       // 结束时间
  posts: Array,        // 关联帖子列表
  tags: Array,         // 事件标签
  commentCount: Number, // 评论数量
  participantCount: Number // 参与人数
}
```

### 飞书表结构映射

- App ID: cli_a75e41b0cdfcd013
- App Secret: gQDboZzkXd84iVSAJglqkhrWC8GhtXBf
- 事件表（Events）：https://hge1nf2qmu.feishu.cn/base/LGrcbUHMhasJgmsXOK5c3xCvnld?table=tblGGeNFxIWyWkj6&view=vewhx7UA3G
- 时间线表（Timeline）：https://hge1nf2qmu.feishu.cn/base/LGrcbUHMhasJgmsXOK5c3xCvnld?table=tbl36h41v2pW3EMZ&view=vewmLzakHs
- 评论表（Comments）：https://hge1nf2qmu.feishu.cn/base/LGrcbUHMhasJgmsXOK5c3xCvnld?table=tblKD957TsPgrNJn&view=vewIrtoOgu
- 投票表（Votes）：https://hge1nf2qmu.feishu.cn/base/LGrcbUHMhasJgmsXOK5c3xCvnld?table=tblxZ5f6lgGk18tL&view=vew1Vki0BV
- 用户表（users）：https://hge1nf2qmu.feishu.cn/base/LGrcbUHMhasJgmsXOK5c3xCvnld?table=tblfXC7NC9ZsT69E&view=vewfXOmx8D

## 附录
### API调用流程
1. 获取tenant_access_token
2. 使用token调用多维表格API
3. 处理返回数据

## 安全与合规
### 内容审核


为遵循相关法律法规和微信安全要求，小程序实现了内容审核机制：

1. 用户发布内容时进行敏感词过滤
2. 图片内容调用微信内容安全API进行检测
3. 违规内容自动拦截并提示用户修改
4. 用户可举报不良内容，管理员审核

### 隐私保护


1. 首次启动时展示隐私协议弹窗
2. 用户信息脱敏处理（如手机号码显示为 138****8888）
3. 位置信息仅精确到小区级别
4. 用户可在个人中心管理隐私设置
