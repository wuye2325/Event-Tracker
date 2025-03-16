const axios = require('axios');

// 应用凭证
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

    // 创建一个简单的测试表
    const requestBody = {
      table: {
        name: "测试表"
      }
    };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const createTableResponse = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables`,
      requestBody,
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log('Create table response:', createTableResponse.data);
    
    if (createTableResponse.data.code === 0) {
      const tableId = createTableResponse.data.data.table_id;
      console.log(`Table created successfully with ID: ${tableId}`);
    } else {
      console.error('Failed to create table:', createTableResponse.data);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      console.error('Error:', error.message);
    }
  }
}

main(); 