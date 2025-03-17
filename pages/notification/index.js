// pages/notification/index.js
Page({
  data: {
    notifications: [],
    loading: true
  },

  onLoad: function() {
    this.loadNotifications();
  },

  onShow: function() {
    // 每次显示页面时刷新通知列表
    this.loadNotifications();
  },

  // 加载通知列表
  loadNotifications: function() {
    this.setData({ loading: true });
    
    // 模拟获取通知数据
    setTimeout(() => {
      const notifications = [
        {
          id: 1,
          title: '您关注的事件有新进展',
          content: '高空抛物监控安装事件已更新状态为"已解决"',
          time: '2023-03-14 10:30',
          read: false,
          eventId: 'ET000000011'
        },
        {
          id: 2,
          title: '您的评论收到回复',
          content: '王主任回复了您的评论: "谢谢您的建议，我们会考虑的"',
          time: '2023-03-13 15:45',
          read: true,
          eventId: 'ET000000010'
        },
        {
          id: 3,
          title: '社区公告',
          content: '本周六将进行小区消防演习，请各位业主积极参与',
          time: '2023-03-12 09:15',
          read: true,
          eventId: ''
        }
      ];
      
      this.setData({
        notifications: notifications,
        loading: false
      });
    }, 500);
  },

  // 标记通知为已读
  markAsRead: function(e) {
    const id = e.currentTarget.dataset.id;
    const notifications = this.data.notifications.map(item => {
      if (item.id === id) {
        return { ...item, read: true };
      }
      return item;
    });
    
    this.setData({ notifications });
  },

  // 跳转到相关事件
  goToEvent: function(e) {
    const eventId = e.currentTarget.dataset.eventid;
    if (eventId) {
      wx.navigateTo({
        url: `/pages/event-detail/index?id=${eventId}`
      });
    }
  },

  onShow() {
    // 设置TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  }
})