const axios = require('axios');

// 应用凭证
const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;

// 要检查的表ID
const tableIds = [
  'tblrjZovHMZUFVgO',  // 用户点赞记录表
  'tblkzicwnJXdaS7B',  // 投票选项表
  'tblAWgMExvhfWFHt',  // 用户投票记录表
  'tblAN60QdI08pcVW'   // 社区信息表
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

    // 检查每个表的字段
    for (const tableId of tableIds) {
      try {
        console.log(`\nChecking fields for table: ${tableId}`);
        const response = await axios.get(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Fields:', JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error(`Error checking fields for table ${tableId}:`, error.response?.data || error.message);
      }
    }

    console.log('\nField checking completed!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main(); 