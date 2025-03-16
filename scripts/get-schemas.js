const axios = require('axios');

// 应用凭证（顶部全局定义）
const APP_ID = 'cli_a75e41b0cdfcd013';
const APP_SECRET = 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf';
const APP_TOKEN = 'LGrcbUHMhasJgmsXOK5c3xCvnld'; // 新增APP_TOKEN

const TABLES = {
  events: 'tblGGeNFxIWyWkj6',
  timeline: 'tbl36h41v2pW3EMZ',
  comments: 'tblKD957TsPgrNJn',
  votes: 'tblxZ5f6lgGk18tL',
  users: 'tblfXC7NC9ZsT69E'
};

async function main() {
  // 获取访问令牌
  const { data: tokenData } = await axios.post(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    { app_id: APP_ID, app_secret: APP_SECRET }
  );

  // 获取所有表结构
  for (const [tableName, tableId] of Object.entries(TABLES)) {
    // 修改后的API请求
    const { data } = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`, // 使用APP_TOKEN
      { headers: { Authorization: `Bearer ${tokenData.tenant_access_token}` } }
    );
    
    console.log(`\n${tableName}表结构：`);
    console.log(JSON.stringify(data.data.items, null, 2));
  }
}

main();