const { BitableAPI } = require('../utils/feishu');
const { showToast, showLoading, hideLoading } = require('../utils/util');

// 事件服务
const EventService = {
  // 获取事件列表
  async getEventList(filter = '') {
    try {
      showLoading();
      const result = await BitableAPI.getEvents(filter);
      return result.items || [];
    } catch (error) {
      console.error('getEventList error:', error);
      showToast('获取事件列表失败');
      return [];
    } finally {
      hideLoading();
    }
  },

  // 获取事件详情
  async getEventDetail(eventId) {
    try {
      showLoading();
      // 获取事件基本信息
      const eventResult = await BitableAPI.getEvents(`CurrentValue.[event_id]="${eventId}"`);
      if (!eventResult.items || !eventResult.items.length) {
        throw new Error('事件不存在');
      }
      
      const event = eventResult.items[0];
      
      // 获取事件时间线
      const timelineResult = await BitableAPI.getTimeline(eventId);
      event.timeline = timelineResult.items || [];
      
      // 获取事件投票
      const votesResult = await BitableAPI.getVotes(eventId);
      event.votes = votesResult.items || [];
      
      return event;
    } catch (error) {
      console.error('getEventDetail error:', error);
      showToast('获取事件详情失败');
      throw error;
    } finally {
      hideLoading();
    }
  },

  // 创建事件
  async createEvent(data) {
    try {
      showLoading('创建中');
      const result = await BitableAPI.createEvent(data);
      showToast('创建成功', 'success');
      return result;
    } catch (error) {
      console.error('createEvent error:', error);
      showToast('创建事件失败');
      throw error;
    } finally {
      hideLoading();
    }
  },

  // 创建时间线记录
  async createTimeline(data) {
    try {
      showLoading('发布中');
      const result = await BitableAPI.createTimeline(data);
      showToast('发布成功', 'success');
      return result;
    } catch (error) {
      console.error('createTimeline error:', error);
      showToast('发布失败');
      throw error;
    } finally {
      hideLoading();
    }
  },

  // 创建评论
  async createComment(data) {
    try {
      const result = await BitableAPI.createComment(data);
      showToast('评论成功', 'success');
      return result;
    } catch (error) {
      console.error('createComment error:', error);
      showToast('评论失败');
      throw error;
    }
  },

  // 创建投票
  async createVote(data) {
    try {
      showLoading('创建中');
      const result = await BitableAPI.createVote(data);
      showToast('创建成功', 'success');
      return result;
    } catch (error) {
      console.error('createVote error:', error);
      showToast('创建投票失败');
      throw error;
    } finally {
      hideLoading();
    }
  }
};

module.exports = EventService; 