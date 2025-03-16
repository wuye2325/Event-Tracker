const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { BitableAPI } = require('../utils/feishu');

// 配置信息
const APP_ID = 'cli_a75e41b0cdfcd013';
const APP_SECRET = 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf';
const APP_TOKEN = 'LGrcbUHMhasJgmsXOK5c3xCvnld';

const TABLES = {
    events: 'tblGGeNFxIWyWkj6',
    timeline: 'tbl36h41v2pW3EMZ',
    comments: 'tblKD957TsPgrNJn',
    votes: 'tblxZ5f6lgGk18tL',
    users: 'tblfXC7NC9ZsT69E'
};

// 字段映射文件路径
const fieldMapPath = path.join(__dirname, '..', 'services', 'feishuFieldMap.js');

async function validateFieldMap() {
    try {
        // 1. 读取现有的字段映射
        const fieldMapContent = require(fieldMapPath);
        const { FEISHU_FIELD_MAP, FEISHU_PRIMARY_KEYS } = fieldMapContent;

        // 2. 获取飞书访问令牌
        const { data: tokenData } = await axios.post(
            'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
            { app_id: APP_ID, app_secret: APP_SECRET }
        );

        console.log('\n=== 开始验证字段映射 ===');

        // 3. 验证每个表的字段
        for (const [tableName, tableId] of Object.entries(TABLES)) {
            console.log(`\n检查 ${tableName} 表:`);

            // 获取表结构
            const { data } = await axios.get(
                `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`,
                { headers: { Authorization: `Bearer ${tokenData.tenant_access_token}` } }
            );

            const fields = data.data.items;

            // 3.1 验证主键字段
            const primaryKey = FEISHU_PRIMARY_KEYS[tableName];
            if (primaryKey) {
                const primaryKeyField = fields.find(f => f.field_name === primaryKey);
                if (!primaryKeyField) {
                    console.error(`❌ 主键字段验证失败: ${tableName}.${primaryKey} 在表中不存在`);
                } else {
                    console.log(`✅ 主键字段验证通过: ${tableName}.${primaryKey}`);
                }
            } else {
                console.warn(`⚠️ 警告: ${tableName} 表未定义主键字段`);
            }

            // 3.2 验证字段映射
            const mappedFields = FEISHU_FIELD_MAP[tableName] || {};
            for (const [chineseName, englishName] of Object.entries(mappedFields)) {
                const field = fields.find(f => f.field_name === englishName);
                if (!field) {
                    console.error(`❌ 字段映射验证失败: ${tableName}.${chineseName} -> ${englishName}`);
                } else {
                    console.log(`✅ 字段映射验证通过: ${tableName}.${chineseName} -> ${englishName}`);
                }
            }

            // 3.3 验证数据格式
            try {
                // 使用正确的 API 方法获取数据
                const sampleData = await axios.get(
                    `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records`,
                    {
                        headers: { Authorization: `Bearer ${tokenData.tenant_access_token}` },
                        params: { page_size: 1 }
                    }
                );
                
                if (sampleData?.data?.data?.items?.[0]) {
                    console.log('\n示例数据格式:');
                    console.log(JSON.stringify(sampleData.data.data.items[0].fields, null, 2));
                } else {
                    console.log('\n⚠️ 警告: 表中暂无数据');
                }
            } catch (error) {
                console.error(`获取示例数据失败: ${error.message}`);
            }
        }

        console.log('\n=== 字段映射验证完成 ===');

    } catch (error) {
        console.error('验证过程出错:', error);
    }
}

// 运行验证
validateFieldMap();