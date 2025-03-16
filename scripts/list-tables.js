const axios = require('axios');

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;

async function getAccessToken() {
  console.log('Getting access token...');
  const response = await axios.post(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      "app_id": APP_ID,
      "app_secret": APP_SECRET
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
  );
  console.log('Token response:', response.data);
  return response.data.tenant_access_token;
}

async function listTables(token) {
  try {
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
    console.log('Tables list:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error listing tables:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    const token = await getAccessToken();
    await listTables(token);
    console.log('Table listing completed!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main(); 