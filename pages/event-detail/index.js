const { EventAPI, TimelineAPI } = require('../../services/api');
const { formatTime } = require('../../utils/util');

Page({
  data: {
    recordId: '',
    event: null,
    timeline: [],
    loading: false
  },

  onLoad(options) {
    if (options.recordId) {
      this.setData({ recordId: options.recordId });
      this.loadEventDetail();
      
      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: '事件详情'
      });
    }
  },

  onPullDownRefresh() {
    this.loadEventDetail();
  },

  async loadEventDetail() {
    try {
      this.setData({ loading: true });
      const eventDetail = await EventAPI.getEventDetail(this.data.recordId);
      console.log('获取到的事件详情:', eventDetail);
      
      // 格式化时间，timeline和votes的recordId已在API层处理
      const formattedTimeline = eventDetail.timeline.map(item => ({
        ...item,
        publish_time: formatTime(new Date(item.publish_time))
      }));
      console.log('格式化后的时间线:', formattedTimeline);
      
      const formattedEvent = {
        ...eventDetail,
        created_at: formatTime(new Date(eventDetail.created_at))
      };
      console.log('格式化后的事件:', formattedEvent);
      
      this.setData({
        event: formattedEvent,
        timeline: formattedTimeline
      }, () => {
        console.log('页面数据:', this.data);
      });
    } catch (error) {
      console.error('加载事件详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  onCreatePost() {
    wx.navigateTo({
      url: `/pages/post-create/index?recordId=${this.data.recordId}`
    });
  },

  // 查看事件关联
  onViewEventRelation() {
    // 检查是否有 event_id 字段，优先使用它
    const eventId = this.data.event?.event_id || this.data.recordId;
    console.log('跳转到事件关联图，使用ID:', eventId);
    
    wx.navigateTo({
      url: `/pages/event-relation/index?id=${eventId}`
    });
  },

  // 预览图片
  previewImage(e) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({
      urls,
      current
    });
  },

  // 查看评论
  onViewComments(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/comments/index?id=${id}`
    });
  }
});