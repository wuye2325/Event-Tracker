// 飞书API相关工具函数

// 飞书多维表格配置
const BITABLE_CONFIG = {
  appToken: 'LGrcbUHMhasJgmsXOK5c3xCvnld',
  tables: {
    events: 'tblKD957TsPgrNJn',
    timeline: 'tbl36h41v2pW3EMZ',
    votes: 'tblKD957TsPgrNJn',
    users: 'tblfXC7NC9ZsT69E' // 添加用户表的ID
  }
};

// 获取租户访问令牌
async function getTenantAccessToken() {
  // 实现获取令牌的逻辑
  // 这里应该有原有的实现代码
  return 'your_access_token';
}

// 发起请求的通用方法
async function makeRequest(url, method = 'GET', token, data = null) {
  // 实现请求逻辑
  // 这里应该有原有的实现代码
  return {};
}

// 飞书多维表格API
const BitableAPI = {
  // 获取事件列表
  getEvents: async function(filter = '') {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.events;
    
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`;
    
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    
    return await makeRequest(url, 'GET', token);
  },
  
  // 获取事件详情
  getEventById: async function(recordId) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.events;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`;
    
    return await makeRequest(url, 'GET', token);
  },
  
  // 创建事件
  createEvent: async function(data) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.events;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
    
    return await makeRequest(url, 'POST', token, { fields: data });
  },
  
  // 获取时间线列表
  getTimeline: async function(filter = '') {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.timeline;
    
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`;
    
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    
    return await makeRequest(url, 'GET', token);
  },
  
  // 获取时间线详情
  getTimelineById: async function(recordId) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.timeline;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`;
    
    return await makeRequest(url, 'GET', token);
  },
  
  // 创建时间线记录
  createTimeline: async function(data) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.timeline;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
    
    return await makeRequest(url, 'POST', token, { fields: data });
  },
  
  // 获取投票列表
  getVotes: async function(filter = '') {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.votes;
    
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`;
    
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    
    return await makeRequest(url, 'GET', token);
  },
  
  // 创建投票
  createVote: async function(data) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.votes;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
    
    return await makeRequest(url, 'POST', token, { fields: data });
  },
  
  // 更新投票
  updateVote: async function(recordId, data) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.votes;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`;
    
    return await makeRequest(url, 'PUT', token, { fields: data });
  },
  
  // 获取评论列表
  getComments: async function(filter = '') {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.comments;
    
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`;
    
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    
    return await makeRequest(url, 'GET', token);
  },
  
  // 创建评论
  createComment: async function(data) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.comments;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
    
    return await makeRequest(url, 'POST', token, { fields: data });
  },
  
  // 添加用户表操作方法
  getUsers: async function(filter = '') {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.users;
    
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=100`;
    
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    
    console.log('getUsers API URL:', url);
    
    return await makeRequest(url, 'GET', token);
  },
  
  getUserById: async function(recordId) {
    const token = await getTenantAccessToken();
    const appToken = BITABLE_CONFIG.appToken;
    const tableId = BITABLE_CONFIG.tables.users;
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`;
    
    return await makeRequest(url, 'GET', token);
  }
};

// 导出模块
module.exports = {
  BitableAPI,
  BITABLE_CONFIG
};