const axios = require('axios');

// 应用凭证
const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;

// 要删除的表ID
const tableIds = [
  'tblcsAxD9HdkldUa',  // 用户点赞记录表
  'tblFCwgnrT9i3kXN',  // 投票选项表
  'tblPw6jezFFH3310',  // 用户投票记录表
  'tbleyVL7Ys5eY2ST'   // 社区信息表
];

async function main() {
  try {
    // 获取访问令牌
    console.log('Getting access token...');
    const { data: tokenData } = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { app_id: APP_ID, app_secret: APP_SECRET }
    );

    console.log('Token response:', tokenData);
    const token = tokenData.tenant_access_token;

    // 删除表
    for (const tableId of tableIds) {
      try {
        console.log(`Deleting table: ${tableId}`);
        const response = await axios.delete(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}`,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log(`Table ${tableId} deleted:`, response.data);
      } catch (error) {
        console.error(`Error deleting table ${tableId}:`, error.response?.data || error.message);
      }
    }

    console.log('Table deletion completed!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main(); 