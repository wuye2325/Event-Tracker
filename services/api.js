// 规则：
// 1. 直接使用字段英文标识（如 `record_id`，无需前缀）
// 2. 操作符统一用 `$eq`、`$in` 等（飞书不支持 `=`）
// 3. 字符串值必须用单引号包裹（`'`）
// 4. 飞书多维表格 API 禁止使用 CurrentValue. 或 fields. 前缀，直接使用字段英文标识即可
//  错误写法示例：filter: "CurrentValue.[record_id] = \"recuFtO3dAmASu\"" 
//  正确写法示例：filter: "record_id $eq 'recuFtO3dAmASu'" 

const { BitableAPI } = require('../utils/feishu');
// 修改这行，移除重复的 services 路径
const { FEISHU_FIELD_MAP, FEISHU_PRIMARY_KEYS } = require('./feishuFieldMap.js');

// 事件相关API
const EventAPI = {
    // 获取事件列表
    async getEventList(params = {}) {
        try {
            const { status, keyword } = params;
            let filter = '';
            const conditions = [];

            if (status) {
                const statusField = FEISHU_FIELD_MAP.events.状态;
                conditions.push(`${statusField} $eq '${status}'`);
            }
            if (keyword) {
                const titleField = FEISHU_FIELD_MAP.events.标题;
                conditions.push(`${titleField} CONTAINS '${keyword}'`);
            }

            if (conditions.length > 0) {
                filter = conditions.join(' AND ');
            }

            const result = await BitableAPI.getEvents(filter);

            // 格式化返回数据，统一使用recordId作为事件唯一标识
            return (result.items || []).map(item => ({
                ...item.fields,
                recordId: item.record_id // 使用飞书多维表格的record_id作为唯一标识
            }));
        } catch (error) {
            console.error('获取事件列表失败:', error);
            throw error;
        }
    },

    // 获取事件详情
    // @param recordId {string} 飞书多维表格记录的唯一标识record_id
    async getEventDetail(recordId) {
        try {
            // 获取事件基本信息
            const event = await BitableAPI.getEventById(recordId);
            console.log('获取到的事件原始数据:', event);

            if (!event || !event.record) {
                throw new Error('事件不存在');
            }

            // 获取事件时间线 - 使用原来的简单逻辑
            const timeline = await BitableAPI.getTimeline(event.record.fields?.event_id || recordId);
            console.log('获取到的时间线原始数据:', JSON.stringify(timeline, null, 2));

            // 检查时间线数据格式
            let timelineData = { items: [] };
            if (timeline && timeline.items) {
                timelineData = timeline;
            } else {
                console.log('时间线数据为空，使用默认值');
            }

            // 检查每条时间线记录的格式
            console.log('时间线记录字段示例:', JSON.stringify(timelineData.items[0]?.fields, null, 2));

            // 获取投票信息
            const votes = await BitableAPI.getVotes(recordId);
            console.log('获取到的投票原始数据:', votes);

            // 格式化时间线数据之前先检查字段
            const timelineItem = timelineData.items[0];
            if (timelineItem) {
                console.log('时间线记录的所有字段名:', Object.keys(timelineItem.fields));
                console.log('nickname字段值:', timelineItem.fields.nickname);
                console.log('nickName字段值:', timelineItem.fields.nickName);
            }

            // 返回格式化后的事件详情，统一使用recordId
            const formattedEvent = {
                title: event.record.fields?.title || '',
                description: event.record.fields?.description || '',
                status: event.record.fields?.status || '进行中',
                created_at: event.record.fields?.created_at || new Date().toISOString(),
                start_date: event.record.fields?.start_date || new Date().toISOString(),
                tags: event.record.fields?.tags || [],
                recordId: event.record.record_id,
                // 生成9位数字的event_id，与数据库自动编号格式保持一致
                event_id: event.record.fields?.event_id || `ET${String(parseInt(event.record.record_id.replace(/\D/g, '')) % 1000000000).padStart(9, '0')}`
            };

            // 修改这里，使用 timelineData 替代 timeline
            const formattedTimeline = (timelineData?.items || []).map(item => {
                // 先打印当前记录的字段值
                console.log('处理时间线记录:', {
                    fields: item.fields,
                    nickname: item.fields?.nickname
                });

                // 处理nickname字段，如果是对象则获取其text属性
                let nicknameValue = '匿名用户';
                if (item.fields?.nickname) {
                    if (typeof item.fields.nickname === 'string') {
                        nicknameValue = item.fields.nickname;
                    } else if (typeof item.fields.nickname === 'object') {
                        // 如果是数组，取第一个元素的text属性
                        if (Array.isArray(item.fields.nickname) && item.fields.nickname.length > 0) {
                            nicknameValue = item.fields.nickname[0].text || '匿名用户';
                        }
                        // 如果是单个对象，直接取text属性
                        else if (item.fields.nickname.text) {
                            nicknameValue = item.fields.nickname.text;
                        }
                    }
                }

                return {
                    type: item.fields?.type || '',
                    content: item.fields?.content || '',
                    publish_time: item.fields?.publish_time || new Date().toISOString(),
                    images: item.fields?.images || [],
                    comment_count: item.fields?.comment_count || 0,
                    like_count: item.fields?.like_count || 0,
                    nickname: nicknameValue,
                    avatarUrl: item.fields?.avatarUrl || '',
                    recordId: item.record_id,
                    event_id: item.fields?.event_id || ''
                };
            }).sort((a, b) => {
                // 按发布时间倒序排列
                return new Date(b.publish_time) - new Date(a.publish_time);
            });

            const formattedVotes = (votes?.items || []).map(item => ({
                title: item.fields?.title || '',
                description: item.fields?.description || '',
                start_time: item.fields?.start_time || new Date().toISOString(),
                end_time: item.fields?.end_time || '',
                status: item.fields?.status || '进行中',
                recordId: item.record_id
            }));

            console.log('格式化后的事件数据:', {
                ...formattedEvent,
                timeline: formattedTimeline,
                votes: formattedVotes
            });

            return {
                ...formattedEvent,
                timeline: formattedTimeline,
                votes: formattedVotes
            };
        } catch (error) {
            console.error('获取事件详情失败:', error);
            throw error;
        }
    },

    // 创建事件
    async createEvent(data) {
        try {
            const result = await BitableAPI.createEvent({
                title: data.title,
                description: data.description,
                status: '进行中',
                start_date: new Date().toISOString(),
                tags: data.tags || []
            });
            return {
                ...result.fields,
                recordId: result.record_id
            };
        } catch (error) {
            console.error('创建事件失败:', error);
            throw error;
        }
    }
};

// 时间线相关API
const TimelineAPI = {
    // 获取帖子列表
    async getPosts(params = {}) {
        try {
            const { status, author } = params;
            const conditions = [];

            if (status) {
                const statusField = FEISHU_FIELD_MAP.timeline.状态;
                conditions.push(`${statusField} $eq '${status}'`);
            }
            if (author) {
                const authorField = FEISHU_FIELD_MAP.timeline.作者;
                conditions.push(`${authorField} $eq '${author}'`);
            }

            const filter = conditions.length > 0 ? conditions.join(' AND ') : '';
            const result = await BitableAPI.getTimeline(filter);

            return (result.items || []).map(item => ({
                ...item.fields,
                recordId: item.record_id
            }));
        } catch (error) {
            console.error('获取帖子列表失败:', error);
            throw error;
        }
    },

    // 创建时间线记录
    // @param data.eventRecordId {string} 关联事件的record_id
    async createPost(data) {
        try {
            const result = await BitableAPI.createTimeline({
                event_id: data.eventRecordId, // 使用eventRecordId替代eventId
                content: data.content,
                type: data.type,
                images: data.images || [],
                author: data.author,
                publish_time: new Date().toISOString()
            });
            return {
                ...result.fields,
                recordId: result.record_id
            };
        } catch (error) {
            console.error('创建帖子失败:', error);
            throw error;
        }
    },

    // 获取时间线详情
    async getTimelineDetail(timelineId) {
        try {
            console.log('=== getTimelineDetail 开始 ===');
            console.log('输入参数:', {
                timelineId,
                type: typeof timelineId,
                length: timelineId.length
            });

            let result;
            
            // 采用渐进式尝试策略
            try {
                if (timelineId.startsWith('rec')) {
                    // 如果是 record_id，直接获取记录
                    console.log('使用 record_id 直接获取:', timelineId);
                    result = await BitableAPI.getTimelineById(timelineId);
                    
                    // 转换为标准格式
                    if (result && result.record) {
                        result = {
                            items: [{
                                record_id: result.record.record_id,
                                fields: result.record.fields
                            }]
                        };
                    }
                } else if (timelineId.startsWith('ET')) {
                    // 如果是 ET 开头，可能是 event_id
                    console.log('检测到 event_id 格式，尝试通过 event_id 查询:', timelineId);
                    
                    // 方法1: 使用 CurrentValue 前缀 (已验证可行)
                    const eventIdField = FEISHU_FIELD_MAP.timeline.事件ID || 'event_id';
                    const filter = `CurrentValue.[${eventIdField}] = "${timelineId}"`;
                    console.log('使用 event_id 查询 (方法1):', {
                        originalId: timelineId,
                        eventIdField,
                        filter: decodeURIComponent(filter)
                    });
                    result = await BitableAPI.getTimeline(filter);
                    
                    // 如果没有结果，尝试方法2 (备用方案)
                    if (!result || !result.items || result.items.length === 0) {
                        console.log('通过 event_id 查询无结果，尝试方法2');
                        const filter2 = `${eventIdField} $eq '${timelineId}'`;
                        console.log('使用 event_id 查询 (方法2):', {
                            filter: decodeURIComponent(filter2)
                        });
                        result = await BitableAPI.getTimeline(filter2);
                    }
                } else if (timelineId.startsWith('TL')) {
                    // 如果是 TL 开头，可能是 timeline_id
                    console.log('检测到 timeline_id 格式，尝试通过 timeline_id 查询:', timelineId);
                    
                    // 方法1: 使用 CurrentValue 前缀
                    const timelineIdField = FEISHU_PRIMARY_KEYS.timeline || 'timeline_id';
                    const filter = `CurrentValue.[${timelineIdField}] = "${timelineId}"`;
                    console.log('使用 timeline_id 查询 (方法1):', {
                        originalId: timelineId,
                        timelineIdField,
                        filter: decodeURIComponent(filter)
                    });
                    result = await BitableAPI.getTimeline(filter);
                } else {
                    // 如果是其他格式，尝试多种字段查询
                    console.log('未识别的ID格式，尝试多种字段查询:', timelineId);
                    
                    // 尝试作为 timeline_id 查询
                    const timelineIdField = FEISHU_PRIMARY_KEYS.timeline || 'timeline_id';
                    const filter = `CurrentValue.[${timelineIdField}] = "${timelineId}"`;
                    console.log('尝试作为 timeline_id 查询:', {
                        filter: decodeURIComponent(filter)
                    });
                    result = await BitableAPI.getTimeline(filter);
                }
            } catch (error) {
                console.error('第一种查询方式失败，尝试第二种方式:', error);
                
                // 方法2: 使用标准操作符 (备用方案)
                const timelineIdField = FEISHU_PRIMARY_KEYS.timeline || 'timeline_id';
                const filter = `${timelineIdField} $eq '${timelineId}'`;
                console.log('使用备用查询方式:', {
                    originalId: timelineId,
                    timelineIdField,
                    filter: decodeURIComponent(filter)
                });
                result = await BitableAPI.getTimeline(filter);
            }
            
            console.log('API 响应结果:', {
                success: !!result,
                hasItems: !!result?.items,
                itemCount: result?.items?.length,
                firstItem: result?.items?.[0] ? {
                    record_id: result.items[0].record_id,
                    fields: Object.keys(result.items[0].fields)
                } : null
            });
            
            if (!result || !result.items || result.items.length === 0) {
                // 如果所有尝试都失败，尝试通过 EventAPI 获取事件详情
                if (timelineId.startsWith('ET')) {
                    console.log('尝试通过 EventAPI 获取事件详情:', timelineId);
                    try {
                        // 这里假设 EventAPI.getEventDetail 方法存在
                        const eventDetail = await EventAPI.getEventDetail(timelineId);
                        if (eventDetail && eventDetail.timeline && eventDetail.timeline.length > 0) {
                            console.log('从事件详情中获取到时间线数据:', eventDetail.timeline[0]);
                            return eventDetail.timeline[0];
                        }
                    } catch (eventError) {
                        console.error('通过 EventAPI 获取事件详情失败:', eventError);
                    }
                }
                
                const error = new Error('记录不存在');
                error.details = {
                    timelineId,
                    result
                };
                throw error;
            }

            // 处理返回数据，确保字段格式一致性
            const timeline = result.items[0];
            console.log('原始时间线数据:', {
                record_id: timeline.record_id,
                fields: timeline.fields,
                fieldTypes: Object.entries(timeline.fields).map(([key, value]) => ({
                    field: key,
                    type: typeof value,
                    isArray: Array.isArray(value),
                    sample: value
                }))
            });

            const formattedTimeline = {
                ...timeline.fields,
                recordId: timeline.record_id,
                // 处理关联字段
                event_id: Array.isArray(timeline.fields.event_id) 
                    ? timeline.fields.event_id[0]?.text || ''
                    : timeline.fields.event_id || '',
                nickname: Array.isArray(timeline.fields.nickname)
                    ? timeline.fields.nickname[0]?.text || ''
                    : timeline.fields.nickname || ''
            };

            console.log('格式化后的时间线数据:', formattedTimeline);
            console.log('=== getTimelineDetail 结束 ===');
            
            return formattedTimeline;

        } catch (error) {
            console.error('获取时间线详情失败:', {
                message: error.message,
                details: error.details,
                stack: error.stack,
                // 添加更多上下文信息
                context: {
                    timelineId,
                    primaryKeys: FEISHU_PRIMARY_KEYS,
                    fieldMap: FEISHU_FIELD_MAP.timeline
                }
            });
            throw error;
        }
    },

    // 获取评论列表
    async getComments(timelineId) {
        try {
            console.log('=== getComments 开始 ===');
            console.log('获取评论列表参数:', {
                timelineId,
                type: typeof timelineId
            });
    
            // 确保 timelineId 有效
            if (!timelineId) {
                console.error('无效的 timelineId:', timelineId);
                return [];
            }
            
            // 如果传入的是 record_id，需要先获取对应的 timeline_id
            let actualTimelineId = timelineId;
            if (timelineId.startsWith('rec')) {
                try {
                    // 获取时间线详情
                    const timelineDetail = await this.getTimelineDetail(timelineId);
                    console.log('获取到的时间线详情:', {
                        timeline_id: timelineDetail.timeline_id,
                        comment_count: timelineDetail.comment_count,
                        allFields: Object.keys(timelineDetail)
                    });
                    
                    if (timelineDetail && timelineDetail.timeline_id) {
                        actualTimelineId = timelineDetail.timeline_id;
                        console.log('从 record_id 获取到实际的 timeline_id:', actualTimelineId);
                    }
                } catch (error) {
                    console.error('获取实际 timeline_id 失败:', error);
                    // 继续使用原始 timelineId
                }
            }
    
            const result = await BitableAPI.getComments(actualTimelineId);
            
            console.log('评论查询结果:', {
                success: !!result,
                total: result?.total,
                itemCount: result?.items?.length || 0,
                firstItem: result?.items?.[0] ? {
                    recordId: result.items[0].record_id,
                    fields: Object.keys(result.items[0].fields || {})
                } : null
            });
    
            // 格式化评论数据
            const comments = (result?.items || []).map(item => {
                // 处理数组类型的字段
                const getNormalizedValue = (field) => {
                    const value = item.fields[field];
                    if (Array.isArray(value) && value.length > 0) {
                        // 如果是关联字段，可能是 [{text: "xxx"}] 格式
                        if (value[0].text) return value[0].text;
                        // 如果是普通数组，返回第一个元素
                        return value[0];
                    }
                    return value || '';
                };
                
                return {
                    recordId: item.record_id,
                    comment_id: getNormalizedValue('comment_id'),
                    timeline_id: getNormalizedValue('timeline_id'),
                    content: getNormalizedValue('content') || '',
                    nickname: getNormalizedValue('nickname') || '匿名用户',
                    publish_time: getNormalizedValue('publish_time') || new Date().toISOString(),
                    parent_id: getNormalizedValue('parent_id') || '',
                    like_count: parseInt(getNormalizedValue('like_count') || '0', 10)
                };
            });
    
            console.log('格式化后的评论数据:', {
                count: comments.length,
                sample: comments.length > 0 ? comments[0] : null
            });
            console.log('=== getComments 结束 ===');
    
            // 确保返回数组
            return comments || [];
        } catch (error) {
            console.error('获取评论列表失败:', error);
            return [];
        }
    },

    // 创建评论
    // @param data.timelineRecordId {string} 关联时间线的record_id
    async createComment(data) {
        try {
            const result = await BitableAPI.createComment({
                timeline_id: data.timelineRecordId,
                content: data.content,
                author: data.author,
                publish_time: new Date().toISOString(),
                parent_id: data.parentId
            });
            return {
                ...result.fields,
                recordId: result.record_id
            };
        } catch (error) {
            console.error('创建评论失败:', error);
            throw error;
        }
    }
};

// 投票相关API
const VoteAPI = {
    // 创建投票
    // @param data.eventRecordId {string} 关联事件的record_id
    async createVote(data) {
        try {
            const result = await BitableAPI.createVote({
                event_id: data.eventRecordId,
                title: data.title,
                description: data.description,
                start_time: new Date().toISOString(),
                end_time: data.endTime,
                status: '进行中'
            });
            return {
                ...result.fields,
                recordId: result.record_id
            };
        } catch (error) {
            console.error('创建投票失败:', error);
            throw error;
        }
    },

    // 更新投票状态
    // @param voteRecordId {string} 投票记录的record_id
    async updateVoteStatus(voteRecordId, status) {
        try {
            const result = await BitableAPI.updateVote(voteRecordId, {
                status: status
            });
            return {
                ...result.fields,
                recordId: result.record_id
            };
        } catch (error) {
            console.error('更新投票状态失败:', error);
            throw error;
        }
    }
};

module.exports = {
    EventAPI,
    TimelineAPI,
    VoteAPI
};