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
    // 延迟加载数据，确保页面完全渲染
    setTimeout(() => {
      this.loadEvents();
    }, 300);
  },

  onShow() {
    // 设置TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },

  onReady() {
    // 页面渲染完成后，确保组件已挂载
    console.log('页面渲染完成');
  },

  onPullDownRefresh() {
    this.loadEvents();
  },

  async loadEvents() {
    try {
      this.setData({ loading: true, events: [] });
      
      // 添加延迟，确保UI更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const events = await EventAPI.getEventList({
        status: this.data.currentStatus,
        keyword: this.data.keyword
      });
      
      if (!events || !Array.isArray(events)) {
        throw new Error('获取事件列表失败');
      }
      
      // 格式化数据，recordId已经在API层处理
      const formattedEvents = events.map(event => ({
        ...event,
        start_date: formatTime(new Date(event.start_date || Date.now())),
        tags: event.tags || []
      }));
      
      // 使用setTimeout确保UI线程不阻塞
      setTimeout(() => {
        this.setData({ events: formattedEvents });
        
        if (formattedEvents.length === 0) {
          wx.showToast({
            title: '暂无事件',
            icon: 'none'
          });
        }
      }, 0);
      
    } catch (error) {
      console.error('加载事件列表失败:', error);
      const app = getApp();
      if (app && typeof app.handleError === 'function') {
        app.handleError(error, '加载事件列表失败', {
          currentStatus: this.data.currentStatus,
          keyword: this.data.keyword
        });
      }
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    } finally {
      // 延迟设置loading状态，避免UI闪烁
      setTimeout(() => {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      }, 100);
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