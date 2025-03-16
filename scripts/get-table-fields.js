const axios = require('axios');

const APP_ID = 'cli_a75e41b0cdfcd013';
const APP_SECRET = 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf';
const APP_TOKEN = 'LGrcbUHMhasJgmsXOK5c3xCvnld';

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

    // 获取事件表的字段信息
    const tableId = 'tblGGeNFxIWyWkj6'; // 事件表的ID
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );

    console.log('Fields:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main(); 