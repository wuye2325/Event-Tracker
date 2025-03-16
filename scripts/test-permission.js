const axios = require('axios');

// 应用凭证
const APP_ID = 'cli_a75e41b0cdfcd013';
const APP_SECRET = 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf';
const APP_TOKEN = 'LGrcbUHMhasJgmsXOK5c3xCvnld';

async function main() {
  try {
    // 1. 获取访问令牌
    console.log('Getting access token...');
    const { data: tokenData } = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { app_id: APP_ID, app_secret: APP_SECRET }
    );

    console.log('Token response:', tokenData);
    const token = tokenData.tenant_access_token;

    // 2. 测试获取多维表格元信息
    console.log('Testing Bitable access...');
    const bitableResponse = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}`,
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log('Bitable response:', bitableResponse.data);

    // 3. 测试获取现有表列表
    console.log('Testing tables list access...');
    const tablesResponse = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables`,
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log('Tables response:', tablesResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main(); 