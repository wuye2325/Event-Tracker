// pages/profile/index.js
Page({
  data: {
    userInfo: null,
    isLogin: false,
    menuList: [
      // 用户功能模块
      {
        id: 'myEvents',
        text: '我参与的事件',
        icon: '/images/icons/discover.png',
        url: '/pages/my-events/index?type=participated'
      },
      {
        id: 'createdEvents',
        text: '我发起的事件',
        icon: '/images/icons/event.png',
        url: '/pages/my-events/index?type=created'
      },
      {
        id: 'myComments',
        text: '我的评论',
        icon: '/images/icons/comment.png',
        url: '/pages/my-comments/index'
      },
      {
        id: 'myVotes',
        text: '我的投票',
        icon: '/images/icons/vote.png',
        url: '/pages/my-votes/index'
      },
      // 系统设置项
      {
        id: 'settings',
        text: '消息通知设置',
        icon: '/images/icons/notification.png',
        url: '/pages/settings/notification/index'
      },
      {
        id: 'privacy',
        text: '隐私设置',
        icon: '/images/icons/privacy.png',
        url: '/pages/settings/privacy/index'
      },
      {
        id: 'security',
        text: '账号安全',
        icon: '/images/icons/security.png',
        url: '/pages/settings/security/index'
      },
      {
        id: 'about',
        text: '关于我们',
        icon: '/images/icons/about.png',
        url: '/pages/settings/about/index'
      },
      {
        id: 'feedback',
        text: '意见反馈',
        icon: '/images/icons/feedback.png',
        url: '/pages/settings/feedback/index'
      }
    ]
  },

  onLoad(options) {
    this.checkLoginStatus();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3  // 确保"我的"选项卡高亮显示
      });
    }
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        isLogin: true
      });
    }
  },

  handleLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          userInfo,
          isLogin: true
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  handleMenuTap(e) {
    const { url } = e.currentTarget.dataset;
    if (!url) return;
    
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url
    });
  },
  
  // 编辑个人资料
  editProfile() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/profile/edit/index'
    });
  },
  
  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({
            userInfo: null,
            isLogin: false
          });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
})