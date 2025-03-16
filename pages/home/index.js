const { EventAPI } = require('../../services/api');
const { formatTime } = require('../../utils/util');

Page({
  data: {
    events: [],
    loading: false,
    keyword: '',
    currentStatus: '',
    statusList: [
      { text: '全部', value: '' },
      { text: '进行中', value: '进行中' },
      { text: '已结束', value: '已结束' }
    ]
  },

  onLoad() {
    this.loadEvents();
  },

  onPullDownRefresh() {
    this.loadEvents();
  },

  // 检查并删除与悬浮按钮相关的事件处理函数
  // 例如：onAddTap 或类似的函数
  async loadEvents() {
    try {
      this.setData({ loading: true });
      const events = await EventAPI.getEventList({
        status: this.data.currentStatus,
        keyword: this.data.keyword
      });
      
      // 格式化数据，recordId已经在API层处理
      const formattedEvents = events.map(event => ({
        ...event,
        start_date: formatTime(new Date(event.start_date)),
        tags: event.tags || []
      }));
      
      this.setData({ events: formattedEvents });
    } catch (error) {
      console.error('加载事件列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  onSearch(e) {
    this.setData({
      keyword: e.detail.value
    }, () => {
      this.loadEvents();
    });
  },

  onStatusChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      currentStatus: value
    }, () => {
      this.loadEvents();
    });
  },

  onEventTap(e) {
    const { recordId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/event-detail/index?recordId=${recordId}`
    });
  },

  onCreateEvent() {
    wx.navigateTo({
      url: '/pages/post-create/index'
    });
  }
});