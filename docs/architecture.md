# 项目架构文档

## 目录结构

```mermaid
graph TD
    A[0314] --> B[pages]
    A --> C[components]
    A --> D[services]
    A --> E[utils]
    A --> F[docs]
    A --> G[scripts]
    B --> B1[home]
    B --> B2[event-detail]
    B --> B3[post-create]
    B --> B4[comments]
    B --> B5[profile]
    B --> B6[notification]
    C --> C1[card]
    C --> C2[custom-tab-bar]
    C --> C3[event-card]
    D --> D1[api.js]
    D --> D2[event.js]
    D --> D3[user.js]
    E --> E1[feishu.js]
    E --> E2[util.js]
```

## 核心模块依赖关系

```mermaid
graph LR
    Pages --> Services
    Pages --> Utils
    Pages --> Components
    Services --> Utils
    Components --> Services
    Components --> Utils
```

## 主要功能流程

```mermaid
sequenceDiagram
    participant P as Pages
    participant S as Services
    participant F as Feishu API
    participant U as Utils
    
    P->>S: 调用API服务
    S->>U: 获取Token
    U->>F: 认证请求
    F-->>U: 返回Token
    S->>F: 数据请求
    F-->>S: 返回数据
    S->>P: 格式化数据返回
```

## 关键文件索引

| 文件路径 | 主要功能 | 关键依赖 |
|---------|---------|----------|
| services/api.js | API接口封装 | feishu.js |
| services/event.js | 事件相关业务逻辑 | api.js, util.js |
| utils/feishu.js | 飞书API调用封装 | - |
| utils/util.js | 通用工具函数 | - |
| pages/home/index.js | 首页逻辑 | api.js, util.js |
| components/event-card | 事件卡片组件 | api.js |

## 数据流向

```mermaid
flowchart LR
    A[页面组件] --> B[services层]
    B --> C[utils/feishu]
    C --> D[飞书多维表格]
    D --> C
    C --> B
    B --> A
```

## API调用层级

```mermaid
graph TD
    A[页面组件] --> B[EventAPI]
    B --> C[BitableAPI]
    C --> D[飞书接口]
    A --> E[EventService]
    E --> B
```

## 组件通信

```mermaid
graph TD
    A[custom-tab-bar] --> B[pages]
    C[event-card] --> B
    D[card] --> B
```