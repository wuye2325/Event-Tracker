const APP_ID = 'cli_a75e41b0cdfcd013';
const APP_SECRET = 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf';

// 飞书多维表格配置
const BITABLE_CONFIG = {
  appToken: 'LGrcbUHMhasJgmsXOK5c3xCvnld',
  tables: {
    events: 'tblGGeNFxIWyWkj6',
    timeline: 'tbl36h41v2pW3EMZ',
    comments: 'tblKD957TsPgrNJn',
    votes: 'tblxZ5f6lgGk18tL',
    users: 'tblfXC7NC9ZsT69E'
  }
};

// 获取tenant_access_token
async function getTenantAccessToken() {
  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        method: 'POST',
        data: {
          app_id: APP_ID,
          app_secret: APP_SECRET
        },
        success: (res) => {
          console.log('getTenantAccessToken response:', res);
          resolve(res);
        },
        fail: (error) => {
          console.error('getTenantAccessToken request failed:', error);
          reject(error);
        }
      });
    });
    
    if (!response.data) {
      throw new Error('Response data is undefined');
    }
    
    if (response.data.code === 0) {
      return response.data.tenant_access_token;
    }
    
    throw new Error(response.data.msg || '获取token失败');
  } catch (error) {
    console.error('getTenantAccessToken error:', error);
    throw error;
  }
}

// 封装飞书API请求
async function request(path, method = 'GET', data = null) {
  try {
    const token = await getTenantAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }

    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `https://open.feishu.cn/open-apis/bitable/v1/${path}`,
        method,
        data,
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        success: (res) => {
          console.log('API request response:', res);
          resolve(res);
        },
        fail: (error) => {
          console.error('API request failed:', error);
          reject(error);
        }
      });
    });
    
    if (!response.data) {
      throw new Error('Response data is undefined');
    }
    
    if (response.data.code === 0) {
      return response.data.data;
    }
    
    throw new Error(response.data.msg || '请求失败');
  } catch (error) {
    console.error('feishu api request error:', error);
    throw error;
  }
}

// 数据表操作封装
const BitableAPI = {
  // 获取事件列表
  async getEvents(filter = '') {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.events}/records`;
    return await request(path + (filter ? `?filter=${encodeURIComponent(filter)}` : ''));
  },
  
  // 获取单条事件记录
  async getEventById(recordId) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.events}/records/${recordId}`;
    return await request(path);
  },
  
  // 创建事件
  async createEvent(data) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.events}/records`;
    return await request(path, 'POST', { fields: data });
  },
  
  // 获取时间线列表
  async getTimeline(eventId) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.timeline}/records`;
    
    // 如果是 record_id 格式，直接获取单条记录
    if (eventId.startsWith('rec')) {
      const recordPath = `${path}/${eventId}`;
      console.log('使用记录查询路径:', recordPath);
      const result = await request(recordPath);
      // 将单条记录转换为列表格式
      return {
        items: result ? [result] : [],
        total: result ? 1 : 0,
        has_more: false
      };
    }
    
    // 其他情况使用过滤查询
    let filter;
    if (eventId.includes('CurrentValue')) {
      filter = eventId;
    } else if (eventId.startsWith('ET')) {
      filter = `CurrentValue.[event_id] = "${eventId}"`;
    } else {
      const paddedId = String(eventId).padStart(9, '0');
      filter = `CurrentValue.[event_id] = "ET${paddedId}"`;
    }
    
    console.log('获取时间线列表参数:', {
      path,
      filter: decodeURIComponent(filter),
      originalEventId: eventId,
      queryType: 'filter'
    });
    
    const result = await request(path + `?filter=${encodeURIComponent(filter)}`);
    console.log('获取时间线列表结果:', {
      success: !!result,
      hasMore: result?.has_more,
      total: result?.total,
      itemCount: result?.items?.length || 0,
      firstItem: result?.items?.[0]
    });
    return result;
  },
  
  // 创建时间线记录
  async createTimeline(data) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.timeline}/records`;
    return await request(path, 'POST', { fields: data });
  },
  
  // 更新时间线记录
  async updateTimeline(recordId, data) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.timeline}/records/${recordId}`;
    return await request(path, 'PUT', { fields: data });
  },
  
  // 删除时间线记录
  async deleteTimeline(recordId) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.timeline}/records/${recordId}`;
    return await request(path, 'DELETE');
  },
  
  // 获取评论列表
  async getComments(timelineId) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.comments}/records`;
    
    // 确保 timelineId 有效
    if (!timelineId) {
      console.error('无效的 timelineId:', timelineId);
      return { items: [] };
    }
    
    // 使用成功的方法3: CurrentValue 前缀
    const filter = `CurrentValue.[timeline_id] = "${timelineId}"`;
    
    console.log('获取评论列表请求参数:', {
      path,
      timelineId,
      filter: decodeURIComponent(filter),
      encodedFilter: encodeURIComponent(filter)
    });
    
    return await request(path + `?filter=${encodeURIComponent(filter)}`);
  },
  
  // 创建评论
  async createComment(data) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.comments}/records`;
    return await request(path, 'POST', { fields: data });
  },
  
  // 获取投票列表
  async getVotes(eventId) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.votes}/records`;
    const filter = `CurrentValue.[event_id]="${eventId}"`;
    return await request(path + `?filter=${encodeURIComponent(filter)}`);
  },
  
  // 创建投票
  async createVote(data) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.votes}/records`;
    return await request(path, 'POST', { fields: data });
  },

  // 获取用户信息
  async getUsers(openids = []) {
    if (!openids.length) return { items: [] };
    
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.users}/records`;
    const filter = `OR(${openids.map(id => `CurrentValue.[openid]="${id}"`).join(',')})`;
    
    console.log('获取用户信息请求参数:', {
      path,
      filter: decodeURIComponent(filter),
      openids
    });
    
    const result = await request(path + `?filter=${encodeURIComponent(filter)}`);
    console.log('获取用户信息返回结果:', result);
    
    // 确保返回格式正确
    return {
      items: result?.items || []
    };
  },
  
  // 根据 record_id 获取单条时间线记录
  async getTimelineById(recordId) {
    const path = `apps/${BITABLE_CONFIG.appToken}/tables/${BITABLE_CONFIG.tables.timeline}/records/${recordId}`;
    return await request(path);
  }
};

module.exports = {
  BitableAPI
};