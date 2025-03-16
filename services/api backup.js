// 规则：
// 1. 直接使用字段英文标识（如 `record_id`，无需前缀）
// 2. 操作符统一用 `$eq`、`$in` 等（飞书不支持 `=`）
// 3. 字符串值必须用单引号包裹（`'`）
// 4. 飞书多维表格 API 禁止使用 CurrentValue. 或 fields. 前缀，直接使用字段英文标识即可
//  错误写法示例：filter: "CurrentValue.[record_id] = \"recuFtO3dAmASu\"" 
//  正确写法示例：filter: "record_id $eq 'recuFtO3dAmASu'" 

const { BitableAPI } = require('../utils/feishu');

// 事件相关API
const EventAPI = {
  // 获取事件列表
  async getEventList(params = {}) {
    try {
      const { status, keyword } = params;
      let filter = '';
      const conditions = [];
      
      if (status) {
        conditions.push(`CurrentValue.[status]="${status}"`);
      }
      if (keyword) {
        conditions.push(`CurrentValue.[title] CONTAINS "${keyword}"`);
      }
      
      if (conditions.length > 0) {
        filter = conditions.join(' AND ');
      }
      
      const result = await BitableAPI.getEvents(filter);
      
      // 格式化返回数据，统一使用recordId作为事件唯一标识
      return (result.items || []).map(item => ({
        ...item.fields,
        recordId: item.record_id // 使用飞书多维表格的record_id作为唯一标识
      }));
    } catch (error) {
      console.error('获取事件列表失败:', error);
      throw error;
    }
  },

  // 获取事件详情
  // @param recordId {string} 飞书多维表格记录的唯一标识record_id
  async getEventDetail(recordId) {
    try {
      // 获取事件基本信息
      const event = await BitableAPI.getEventById(recordId);
      console.log('获取到的事件原始数据:', event);
      
      if (!event || !event.record) {
        throw new Error('事件不存在');
      }
      
      // 获取事件时间线
      const timeline = await BitableAPI.getTimeline(event.record.fields?.event_id || recordId);
      console.log('获取到的时间线原始数据:', JSON.stringify(timeline, null, 2));
      
      // 检查时间线数据格式
      if (!timeline || !timeline.items) {
        console.error('时间线数据格式错误:', timeline);
        timeline = { items: [] };
      }
      
      // 检查每条时间线记录的格式
      console.log('时间线记录字段示例:', JSON.stringify(timeline.items[0]?.fields, null, 2));
      
      // 获取投票信息
      const votes = await BitableAPI.getVotes(recordId);
      console.log('获取到的投票原始数据:', votes);

      // 格式化时间线数据之前先检查字段
      const timelineItem = timeline.items[0];
      if (timelineItem) {
        console.log('时间线记录的所有字段名:', Object.keys(timelineItem.fields));
        console.log('nickname字段值:', timelineItem.fields.nickname);
        console.log('nickName字段值:', timelineItem.fields.nickName);
      }
      
      // 返回格式化后的事件详情，统一使用recordId
      const formattedEvent = {
        title: event.record.fields?.title || '',
        description: event.record.fields?.description || '',
        status: event.record.fields?.status || '进行中',
        created_at: event.record.fields?.created_at || new Date().toISOString(),
        start_date: event.record.fields?.start_date || new Date().toISOString(),
        tags: event.record.fields?.tags || [],
        recordId: event.record.record_id,
        // 生成9位数字的event_id，与数据库自动编号格式保持一致
        event_id: event.record.fields?.event_id || `ET${String(parseInt(event.record.record_id.replace(/\D/g, '')) % 1000000000).padStart(9, '0')}`
      };

      const formattedTimeline = (timeline?.items || []).map(item => {
        // 先打印当前记录的字段值
        console.log('处理时间线记录:', {
          fields: item.fields,
          nickname: item.fields?.nickname
        });
        
        // 处理nickname字段，如果是对象则获取其text属性
        let nicknameValue = '匿名用户';
        if (item.fields?.nickname) {
          if (typeof item.fields.nickname === 'string') {
            nicknameValue = item.fields.nickname;
          } else if (typeof item.fields.nickname === 'object') {
            // 如果是数组，取第一个元素的text属性
            if (Array.isArray(item.fields.nickname) && item.fields.nickname.length > 0) {
              nicknameValue = item.fields.nickname[0].text || '匿名用户';
            }
            // 如果是单个对象，直接取text属性
            else if (item.fields.nickname.text) {
              nicknameValue = item.fields.nickname.text;
            }
          }
        }
        
        return {
          type: item.fields?.type || '',
          content: item.fields?.content || '',
          publish_time: item.fields?.publish_time || new Date().toISOString(),
          images: item.fields?.images || [],
          comment_count: item.fields?.comment_count || 0,
          like_count: item.fields?.like_count || 0,
          nickname: nicknameValue,
          avatarUrl: item.fields?.avatarUrl || '',
          recordId: item.record_id,
          event_id: item.fields?.event_id || ''
        };
      }).sort((a, b) => {
        // 按发布时间倒序排列
        return new Date(b.publish_time) - new Date(a.publish_time);
      });

      const formattedVotes = (votes?.items || []).map(item => ({
        title: item.fields?.title || '',
        description: item.fields?.description || '',
        start_time: item.fields?.start_time || new Date().toISOString(),
        end_time: item.fields?.end_time || '',
        status: item.fields?.status || '进行中',
        recordId: item.record_id
      }));

      console.log('格式化后的事件数据:', {
        ...formattedEvent,
        timeline: formattedTimeline,
        votes: formattedVotes
      });

      return {
        ...formattedEvent,
        timeline: formattedTimeline,
        votes: formattedVotes
      };
    } catch (error) {
      console.error('获取事件详情失败:', error);
      throw error;
    }
  },

  // 创建事件
  async createEvent(data) {
    try {
      const result = await BitableAPI.createEvent({
        title: data.title,
        description: data.description,
        status: '进行中',
        start_date: new Date().toISOString(),
        tags: data.tags || []
      });
      return {
        ...result.fields,
        recordId: result.record_id
      };
    } catch (error) {
      console.error('创建事件失败:', error);
      throw error;
    }
  }
};

// 时间线相关API
const TimelineAPI = {
  // 获取帖子列表
  async getPosts(params = {}) {
    try {
      const { status, author } = params;
      const conditions = [];
      
      if (status) {
        conditions.push(`CurrentValue.[status]="${status}"`);
      }
      if (author) {
        conditions.push(`CurrentValue.[author]="${author}"`);
      }
      
      const filter = conditions.length > 0 ? conditions.join(' AND ') : '';
      const result = await BitableAPI.getTimeline(filter);
      
      return (result.items || []).map(item => ({
        ...item.fields,
        recordId: item.record_id
      }));
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      throw error;
    }
  },

  // 创建时间线记录
  // @param data.eventRecordId {string} 关联事件的record_id
  async createPost(data) {
    try {
      const result = await BitableAPI.createTimeline({
        event_id: data.eventRecordId, // 使用eventRecordId替代eventId
        content: data.content,
        type: data.type,
        images: data.images || [],
        author: data.author,
        publish_time: new Date().toISOString()
      });
      return {
        ...result.fields,
        recordId: result.record_id
      };
    } catch (error) {
      console.error('创建帖子失败:', error);
      throw error;
    }
  },

  // 获取时间线详情
  async getTimelineDetail(timelineId) {
    try {
      console.log('开始获取时间线详情:', {
        timelineId,
        type: typeof timelineId,
        format: timelineId.startsWith('rec') ? 'record_id' : 
                timelineId.startsWith('TL') ? 'timeline_id' : 'unknown'
      });
  
      // 构建查询条件
      let filter = '';
      if (timelineId.startsWith('rec')) {
        filter = `CurrentValue.[record_id]="${timelineId}"`;
      } else if (timelineId.startsWith('TL')) {
        filter = `CurrentValue.[timeline_id]="${timelineId}"`;
      } else {
        // 尝试作为数字处理
        const paddedId = timelineId.padStart(9, '0');
        filter = `CurrentValue.[timeline_id]="TL${paddedId}"`;
      }
  
      console.log('构建的查询条件:', {
        filter,
        decodedFilter: decodeURIComponent(filter)
      });
  
      // 执行查询
      const result = await BitableAPI.getTimeline(filter);
      console.log('查询返回结果:', {
        success: !!result,
        itemCount: result?.items?.length || 0,
        firstItem: result?.items?.[0]
      });
  
      // 结果验证和错误处理
      if (!result || !result.items || result.items.length === 0) {
        // 记录详细的错误信息
        const error = new Error('记录不存在');
        error.details = {
          timelineId,
          filter,
          result
        };
        throw error;
      }

      // ... 后续处理逻辑 ...

    } catch (error) {
      console.error('获取时间线详情失败:', {
        message: error.message,
        details: error.details,
        stack: error.stack
      });
      throw error;
    }
  },

  // 获取评论列表
  async getComments(timelineId) {
    try {
      console.log('获取评论列表参数:', {
        timelineId,
        query: `timeline_id $eq '${timelineId}'`
      });

      // 先获取时间线记录，确保存在
      const timeline = await this.getTimelineDetail(timelineId);
      console.log('关联的时间线记录:', timeline);

      // 使用关联字段查询评论，使用标准过滤语法
      const result = await BitableAPI.getComments(`timeline_id $eq '${timeline.timeline_id}'`);
      console.log('获取评论列表结果:', result);
      
      // 格式化评论数据
      const comments = (result.items || []).map(item => {
        // 处理 nickname 字段（Lookup 类型）
        const nickname = item.fields.nickname;
        let nicknameValue = '匿名用户';
        
        if (nickname) {
          if (typeof nickname === 'string') {
            nicknameValue = nickname;
          } else if (Array.isArray(nickname)) {
            nicknameValue = nickname[0]?.text || '匿名用户';
          } else if (typeof nickname === 'object') {
            nicknameValue = nickname.text || '匿名用户';
          }
        }

        // 处理 parent_id 字段（DuplexLink 类型）
        const parentId = item.fields.parent_id;
        let parentIdValue = null;
        
        if (parentId) {
          if (typeof parentId === 'string') {
            parentIdValue = parentId;
          } else if (Array.isArray(parentId)) {
            parentIdValue = parentId[0]?.record_id || null;
          } else if (typeof parentId === 'object') {
            parentIdValue = parentId.record_id || null;
          }
        }

        return {
          recordId: item.record_id,
          comment_id: item.fields.comment_id,
          content: item.fields.content || '',
          nickname: nicknameValue,
          publish_time: item.fields.publish_time || new Date().toISOString(),
          like_count: item.fields.like_count || 0,
          parent_id: parentIdValue
        };
      });

      // 构建评论树结构
      const commentMap = new Map();
      const rootComments = [];

      comments.forEach(comment => {
        commentMap.set(comment.recordId, {
          ...comment,
          replies: []
        });
      });

      comments.forEach(comment => {
        if (comment.parent_id) {
          const parentComment = commentMap.get(comment.parent_id);
          if (parentComment) {
            parentComment.replies.push(comment);
          } else {
            // 如果找不到父评论，作为根评论处理
            rootComments.push(commentMap.get(comment.recordId));
          }
        } else {
          rootComments.push(commentMap.get(comment.recordId));
        }
      });

      // 按时间倒序排序
      return rootComments.sort((a, b) => 
        new Date(b.publish_time) - new Date(a.publish_time)
      );
    } catch (error) {
      console.error('获取评论列表失败:', error);
      throw error;
    }
  },

  // 创建评论
  // @param data.timelineRecordId {string} 关联时间线的record_id
  async createComment(data) {
    try {
      const result = await BitableAPI.createComment({
        timeline_id: data.timelineRecordId,
        content: data.content,
        author: data.author,
        publish_time: new Date().toISOString(),
        parent_id: data.parentId
      });
      return {
        ...result.fields,
        recordId: result.record_id
      };
    } catch (error) {
      console.error('创建评论失败:', error);
      throw error;
    }
  }
};

// 投票相关API
const VoteAPI = {
  // 创建投票
  // @param data.eventRecordId {string} 关联事件的record_id
  async createVote(data) {
    try {
      const result = await BitableAPI.createVote({
        event_id: data.eventRecordId,
        title: data.title,
        description: data.description,
        start_time: new Date().toISOString(),
        end_time: data.endTime,
        status: '进行中'
      });
      return {
        ...result.fields,
        recordId: result.record_id
      };
    } catch (error) {
      console.error('创建投票失败:', error);
      throw error;
    }
  },

  // 更新投票状态
  // @param voteRecordId {string} 投票记录的record_id
  async updateVoteStatus(voteRecordId, status) {
    try {
      const result = await BitableAPI.updateVote(voteRecordId, {
        status: status
      });
      return {
        ...result.fields,
        recordId: result.record_id
      };
    } catch (error) {
      console.error('更新投票状态失败:', error);
      throw error;
    }
  }
};

module.exports = {
  EventAPI,
  TimelineAPI,
  VoteAPI
};