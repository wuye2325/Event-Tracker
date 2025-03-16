# 问题排查与解决方法论

## 1. 数据关联问题排查方法

### 1.1 ID 格式不匹配问题

#### 问题表现
- 数据查询返回空结果
- 关联查询无法找到对应记录
- 日志中显示查询条件格式与实际数据格式不一致

#### 排查步骤
1. **检查数据库表结构**
   - 查看字段的具体定义（类型、格式、约束等）
   - 特别注意自动编号字段的格式规则
   - 示例：`event_id` 字段定义为 "ET" + 9位数字的自动编号

2. **检查实际数据**
   - 在数据库中查看真实数据的格式
   - 记录几个典型数据的格式作为参考
   - 示例：`event_id` 实际值为 "ET000000001"

3. **检查代码中的数据处理**
   - 查看数据查询时的过滤条件格式
   - 检查 ID 生成和转换的逻辑
   - 确保代码生成的 ID 格式与数据库一致
   - 示例：代码中需要确保生成 9 位数字的 ID

4. **使用日志定位问题**
   - 在关键位置添加详细的日志输出
   - 记录原始数据和处理后的数据
   - 对比实际查询条件与预期格式
   ```javascript
   console.log('获取时间线列表参数:', {
     path,
     filter: decodeURIComponent(filter),
     originalEventId: eventId,
     formattedEventId
   });
   ```

#### 解决方案
1. **统一 ID 格式处理**
   ```javascript
   // 确保生成的 ID 格式正确
   const formattedId = id.startsWith('ET') ? id : `ET${String(parseInt(id.replace(/\D/g, '')) % 1000000000).padStart(9, '0')}`;
   ```

2. **在数据查询时使用正确格式**
   ```javascript
   const filter = `CurrentValue.[event_id]="${formattedId}"`;
   ```

3. **优先使用原始 ID**
   ```javascript
   // 优先使用数据库中的原始 ID，如果没有再生成新的
   const eventId = record.fields?.event_id || generateFormattedId(record.record_id);
   ```

### 1.2 数据关联最佳实践

1. **字段命名规范**
   - 主键字段使用统一的命名规则（如 `xxx_id`）
   - 外键字段与关联表主键保持一致的命名

2. **ID 格式规范**
   - 使用有意义的前缀（如 "ET" 表示事件）
   - 统一数字位数（如 9 位数字）
   - 使用 `padStart` 补零确保位数一致

3. **代码组织**
   - ID 格式转换逻辑集中管理
   - 在数据访问层统一处理 ID 格式
   - 提供工具函数处理 ID 转换

4. **错误处理**
   - 添加详细的错误日志
   - 包含原始数据和处理后的数据
   - 提供清晰的错误提示

## 2. 调试技巧

### 2.1 日志分层
1. **请求层日志**
   - 记录 API 请求的完整信息
   - 包含请求参数和响应数据

2. **业务层日志**
   - 记录数据处理的关键步骤
   - 包含数据转换前后的状态

3. **展示层日志**
   - 记录最终渲染的数据
   - 帮助验证数据格式是否符合预期

### 2.2 常见问题快速定位
1. **数据为空**
   - 检查查询条件格式
   - 验证关联字段值是否匹配
   - 确认数据是否存在

2. **数据格式错误**
   - 检查数据库字段定义
   - 验证数据转换逻辑
   - 确认前端展示格式

3. **关联查询失败**
   - 检查外键值格式
   - 验证关联表数据是否存在
   - 确认查询条件正确

## 3. 持续改进

### 3.1 问题归档
- 记录问题现象
- 记录排查步骤
- 记录解决方案
- 总结经验教训

### 3.2 优化建议
- 改进代码结构
- 完善错误处理
- 优化日志记录
- 更新文档说明

### 3.3 预防措施
- 制定编码规范
- 添加数据验证
- 完善测试用例
- 定期代码审查

## 4. 飞书多维表格 API 最佳实践

### 4.1 查询条件构建规范
1. **字段引用规则**
   - 直接使用字段英文标识
   - 禁止使用 CurrentValue. 或 fields. 前缀
   ```javascript
   // 错误示例
   filter: "CurrentValue.[record_id] = \"recuFtO3dAmASu\""
   // 正确示例
   filter: "record_id $eq 'recuFtO3dAmASu'"
   ```

## 其他

查看飞书 API 文档
- 发现最新的 API 版本推荐使用 $eq 操作符
- 不再推荐使用 CurrentValue. 前缀
- 字段名直接使用，不需要中括号


更新查询语法

// 修改前
const filter = `CurrentValue.[timeline_id]="${timelineId}"`;

// 修改后
const filter = `timeline_id $eq '${timelineId}'`;

统一查询语法规范

- 使用 $eq 、 $gt 、 $lt 等标准操作符
- 字段名直接使用，不加任何前缀
- 字符串值使用单引号包裹

// 错误示例
conditions.push(`CurrentValue.[status]="${status}"`);
// 正确示例
conditions.push(`${statusField} $eq '${status}'`);

经验总结
1. 及时关注 API 文档更新
2. 使用规范的查询语法
3. 添加详细的日志辅助排查
4. 统一项目中的查询语法标准

### 4.2 飞书 API 查询语法问题

#### 问题表现
- 使用 `CurrentValue.` 前缀的查询语法返回 `RecordIdNotFound` 错误
- 评论列表查询返回空结果
- 日志显示查询路径格式不正确

#### 排查步骤
1. **分析错误日志**
   ```javascript
   // 错误的查询语法
   filter: `CurrentValue.[timeline_id]="${timelineId}"`
   // 导致错误
   Error: RecordIdNotFound
