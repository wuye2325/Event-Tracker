const fs = require('fs');
const path = require('path');
const { BitableAPI } = require('../utils/feishu');

// 假设这是你的 feishuFieldMap.js 文件路径
const fieldMapFilePath = path.join(__dirname, 'services', 'feishuFieldMap.js');

async function updateFieldMap() {
    try {
        // 获取飞书多维表格的字段信息
        const tables = ['events', 'timeline', 'votes']; // 假设这是你的表格名称
        const newFieldMap = {};

        for (const table of tables) {
            const fields = await BitableAPI.getTableFields(table);
            newFieldMap[table] = {};

            for (const field of fields) {
                // 假设字段有中文名称和英文标识
                const chineseName = field.chineseName; // 请根据实际情况修改
                const englishName = field.englishName; // 请根据实际情况修改
                newFieldMap[table][chineseName] = englishName;
            }
        }

        // 读取现有的映射表
        const existingFieldMapCode = fs.readFileSync(fieldMapFilePath, 'utf8');
        const existingFieldMap = eval(existingFieldMapCode.split('exports = ')[1]);

        // 对比并更新映射表
        let hasChanges = false;
        for (const table in newFieldMap) {
            if (!existingFieldMap[table]) {
                existingFieldMap[table] = {};
                hasChanges = true;
            }

            for (const chineseName in newFieldMap[table]) {
                if (existingFieldMap[table][chineseName]!== newFieldMap[table][chineseName]) {
                    existingFieldMap[table][chineseName] = newFieldMap[table][chineseName];
                    hasChanges = true;
                }
            }
        }

        // 如果有变化，更新 feishuFieldMap.js 文件
        if (hasChanges) {
            const newFieldMapCode = `module.exports = ${JSON.stringify(existingFieldMap, null, 2)};`;
            fs.writeFileSync(fieldMapFilePath, newFieldMapCode, 'utf8');
            console.log('映射表已更新');
        } else {
            console.log('映射表无需更新');
        }
    } catch (error) {
        console.error('更新映射表时出错:', error);
    }
}

// 运行脚本
updateFieldMap();
