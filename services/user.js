const { BitableAPI } = require('../utils/feishu');
const { showToast } = require('../utils/util');

// 用户信息本地存储key
const USER_INFO_KEY = 'userInfo';

// 用户服务
const UserService = {
  // 获取用户信息
  getUserInfo() {
    return wx.getStorageSync(USER_INFO_KEY) || null;
  },

  // 保存用户信息
  setUserInfo(userInfo) {
    wx.setStorageSync(USER_INFO_KEY, userInfo);
  },

  // 清除用户信息
  clearUserInfo() {
    wx.removeStorageSync(USER_INFO_KEY);
  },

  // 检查是否登录
  checkLogin() {
    const userInfo = this.getUserInfo();
    return !!userInfo;
  },

  // 登录流程
  async login() {
    try {
      // 获取code
      const { code } = await wx.login();
      
      // 获取用户信息
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      });
      
      // TODO: 调用后端登录接口，获取openid等信息
      // 这里模拟后端返回数据
      const loginResult = {
        openid: `test_${Math.random().toString(36).substr(2)}`,
        ...userInfo
      };
      
      // 保存用户信息
      this.setUserInfo(loginResult);
      
      return loginResult;
    } catch (error) {
      console.error('login error:', error);
      showToast('登录失败');
      throw error;
    }
  },

  // 退出登录
  logout() {
    this.clearUserInfo();
  }
};

module.exports = UserService; 