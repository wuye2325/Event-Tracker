// feishuFieldMap.js
// 生成时间：2025-03-16
// 数据源：通过飞书 API 获取的 5 张表结构（Events/Timeline/Comments/Votes/Users）

const FEISHU_FIELD_MAP = {
    // ------------------------ 事件表（Events）------------------------
    events: {
      事件ID: 'event_id', // 主键（auto_serial: ET+数字）
      标题: 'title',
      状态: 'status', // 单选：进行中/已结束
      开始时间: 'start_date',
      结束时间: 'end_date',
      描述: 'description',
      评论数量: 'comment_count', // 计算字段（关联 Timeline 表）
      标签: 'tags', // 多选
      创建者: 'created_by',
      创建时间: 'created_at',
      时间线表: '时间线表（Timeline）', // 双向关联字段
      投票表: '投票表（Votes）' // 双向关联字段
    },
  
    // ------------------------ 时间线表（Timeline）------------------------
    timeline: {
      时间线ID: 'timeline_id', // 主键（auto_serial: TL+数字）
      所属事件: 'event_id', // 关联 Events 表
      内容: 'content',
      用户OpenID: 'openid', // 关联 Users 表
      用户名: 'nickname', // 计算字段（关联 Users.nickName）
      发布时间: 'publish_time',
      图片: 'images',
      点赞数: 'like_count',
      评论数: 'comment_count', // 计算字段（关联 Comments 表）
      类型: 'type', // 单选：投票/公告/倡议
      评论表: '评论表（Comments）' // 双向关联字段
    },
  
    // ------------------------ 评论表（Comments）------------------------
    comments: {
      评论ID: 'comment_id', // 主键（auto_serial: CT+数字）
      所属时间线: 'timeline_id', // 关联 Timeline 表
      所属事件: 'event_id', // 计算字段（关联 Events.event_id）
      内容: 'content',
      用户OpenID: 'openid', // 关联 Users 表
      用户名: 'nickname', // 计算字段（关联 Users.nickName）
      发布时间: 'publish_time',
      父评论ID: 'parent_id', // 自关联
      点赞数: 'like_count'
    },
  
    // ------------------------ 投票表（Votes）------------------------
    votes: {
      投票ID: 'vote_id', // 主键（auto_serial: VT+数字）
      所属事件: 'event_id', // 关联 Events 表
      所属时间线: 'timeline_id', // 计算字段（关联 Timeline.timeline_id）
      标题: 'title',
      描述: 'description',
      开始时间: 'start_time',
      结束时间: 'end_time',
      状态: 'status', // 单选：进行中/已结束
      参与人数: 'participant_count',
      发布时间: 'publish_time'
    },
  
    // ------------------------ 用户表（Users）------------------------
    users: {
      用户OpenID: 'openid', // 主键（auto_serial: users+数字）
      昵称: 'nickName',
      头像URL: 'avatarURL',
      手机号: 'mobile',
      最后登录时间: 'lastLogin',
      关联时间线: '时间线表（Timeline）', // 双向关联字段
      关联评论: '评论表（Comments）' // 双向关联字段
    }
  };
  
  // 导出业务主键映射（关键！避免误用飞书内部 record_id）
  const FEISHU_PRIMARY_KEYS = {
    events: 'event_id',
    timeline: 'timeline_id',
    comments: 'comment_id',
    votes: 'vote_id',
    users: 'openid'
  };
  
  export { FEISHU_FIELD_MAP, FEISHU_PRIMARY_KEYS };