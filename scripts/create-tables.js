const axios = require('axios');

// 应用凭证
const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;

// 新表的结构定义
const TABLES = {
  user_likes: {
    name: "用户点赞记录表",
    fields: [
      {
        field_name: "like_id",
        type: 1005,
        description: "点赞记录ID（主键）",
        is_primary: true,
        property: {
          formatter: "LK{NNNNNNNNNN}"
        }
      },
      {
        field_name: "user_id",
        type: 1,
        property: null
      },
      {
        field_name: "target_type",
        type: 3,
        property: {
          options: [
            {name: "时间线", color: 0},
            {name: "评论", color: 1}
          ]
        }
      },
      {
        field_name: "target_id",
        type: 1,
        property: null
      },
      {
        field_name: "created_at",
        type: 5,
        property: {
          auto_fill: true,
          date_formatter: "yyyy/MM/dd HH:mm"
        }
      }
    ]
  },
  vote_options: {
    name: "投票选项表",
    fields: [
      {
        field_name: "option_id",
        type: 1005,
        description: "投票选项ID（主键）",
        is_primary: true,
        property: {
          formatter: "VO{NNNNNNNNNN}"
        }
      },
      {
        field_name: "vote_id",
        type: 1,
        property: null
      },
      {
        field_name: "option_text",
        type: 1,
        property: null
      },
      {
        field_name: "option_order",
        type: 2,
        property: {
          formatter: "0"
        }
      },
      {
        field_name: "vote_count",
        type: 2,
        property: {
          formatter: "0"
        }
      }
    ]
  },
  user_votes: {
    name: "用户投票记录表",
    fields: [
      {
        field_name: "record_id",
        type: 1005,
        description: "投票记录ID（主键）",
        is_primary: true,
        property: {
          formatter: "UV{NNNNNNNNNN}"
        }
      },
      {
        field_name: "user_id",
        type: 1,
        property: null
      },
      {
        field_name: "vote_id",
        type: 1,
        property: null
      },
      {
        field_name: "option_id",
        type: 1,
        property: null
      },
      {
        field_name: "voted_at",
        type: 5,
        property: {
          auto_fill: true,
          date_formatter: "yyyy/MM/dd HH:mm"
        }
      }
    ]
  },
  communities: {
    name: "社区信息表",
    fields: [
      {
        field_name: "community_id",
        type: 1005,
        description: "社区ID（主键）",
        is_primary: true,
        property: {
          formatter: "CM{NNNNNNNNNN}"
        }
      },
      {
        field_name: "name",
        type: 1,
        property: null
      },
      {
        field_name: "address",
        type: 1,
        property: null
      },
      {
        field_name: "district",
        type: 1,
        property: null
      },
      {
        field_name: "manager",
        type: 1,
        property: null
      },
      {
        field_name: "contact_phone",
        type: 13,
        property: null
      },
      {
        field_name: "created_at",
        type: 5,
        property: {
          auto_fill: true,
          date_formatter: "yyyy/MM/dd HH:mm"
        }
      }
    ]
  }
};

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

    // 创建表
    for (const [tableKey, tableData] of Object.entries(TABLES)) {
      console.log(`Creating table: ${tableData.name}`);
      
      try {
        // 1. 创建表
        const createTableResponse = await axios.post(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables`,
          {
            table: {
              name: tableData.name
            }
          },
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
          console.log(`Table ${tableData.name} created with ID: ${tableId}`);

          // 2. 创建字段
          for (const field of tableData.fields) {
            console.log(`Creating field: ${field.field_name}`);
            try {
              const createFieldResponse = await axios.post(
                `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`,
                field,
                { 
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  } 
                }
              );
              console.log(`Field ${field.field_name} created:`, createFieldResponse.data);
            } catch (fieldError) {
              console.error(`Error creating field ${field.field_name}:`, fieldError.response?.data || fieldError.message);
            }
          }
        } else {
          console.error(`Failed to create table ${tableData.name}:`, createTableResponse.data);
        }
      } catch (error) {
        console.error(`Error creating table ${tableData.name}:`, error.response?.data || error.message);
      }
    }

    console.log('Table creation process completed!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main(); 