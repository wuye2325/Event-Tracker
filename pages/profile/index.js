// pages/profile/index.js
const { UserAPI } = require('../../services/api');

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

  // 修改登录方法，使用手机号授权
  handleLogin() {
    // 显示合规提示
    wx.showModal({
      title: '授权提示',
      content: '我们需要获取您的手机号以验证身份。您的信息将被安全保存，仅用于身份验证。',
      confirmText: '同意',
      cancelText: '拒绝',
      success: (res) => {
        if (res.confirm) {
          // 用户同意授权，获取手机号
          this.getPhoneNumber();
        }
      }
    });
  },
  
  // 获取手机号
  getPhoneNumber() {
    wx.showLoading({
      title: '登录中...',
    });
    
    // 模拟获取手机号的过程
    // 注意：实际项目中应该使用 wx.login 和 <button open-type="getPhoneNumber"> 获取真实手机号
    // 这里为了演示，直接使用王主任的手机号进行匹配
    
    setTimeout(async () => {
      try {
        // 模拟手机号 - 实际项目中应从微信API获取
        const phoneNumber = "13800138000"; // 假设这是王主任的手机号
        
        // 调用后端API验证手机号并获取用户信息
        const userInfo = await UserAPI.getUserByPhone(phoneNumber);
        
        if (userInfo) {
          // 保存用户信息到本地
          wx.setStorageSync('userInfo', userInfo);
          
          this.setData({
            userInfo,
            isLogin: true
          });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '用户不存在',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('登录失败:', error);
        wx.showToast({
          title: '登录失败',
          icon: 'error'
        });
      } finally {
        wx.hideLoading();
      }
    }, 1000); // 模拟网络延迟
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