App({
  globalData: {
    userInfo: null,
    appId: 'cli_a75e41b0cdfcd013',
    appSecret: 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf',
    baseUrl: 'https://open.feishu.cn/open-apis/'
  },

  onLaunch() {
    // 展示隐私协议
    this.showPrivacyAgreement();
    // 获取用户信息
    this.getUserInfo();
  },

  async getTenantAccessToken() {
    try {
      const res = await wx.request({
        url: this.globalData.baseUrl + 'auth/v3/tenant_access_token/internal',
        method: 'POST',
        data: {
          app_id: this.globalData.appId,
          app_secret: this.globalData.appSecret
        }
      });
      if (res.data && res.data.tenant_access_token) {
        return res.data.tenant_access_token;
      }
      throw new Error('获取token失败');
    } catch (error) {
      console.error('获取tenant_access_token失败:', error);
      wx.showToast({
        title: '系统异常',
        icon: 'error'
      });
      return null;
    }
  },

  async callFeishuAPI(path, method = 'GET', token, data = null) {
    try {
      const res = await wx.request({
        url: this.globalData.baseUrl + path,
        method,
        data,
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data && res.data.code === 0) {
        return res.data;
      }
      throw new Error(res.data.msg || '接口调用失败');
    } catch (error) {
      console.error('调用飞书API失败:', error);
      wx.showToast({
        title: '请求失败',
        icon: 'error'
      });
      return null;
    }
  },

  showPrivacyAgreement() {
    const agreed = wx.getStorageSync('privacy_agreed');
    if (!agreed) {
      wx.showModal({
        title: '隐私保护提示',
        content: '感谢您使用社区事件追踪小程序。我们非常重视您的个人信息和隐私保护。请您在使用我们的产品之前，仔细阅读并了解《隐私保护指引》。',
        confirmText: '同意',
        cancelText: '不同意',
        success: (res) => {
          if (res.confirm) {
            wx.setStorageSync('privacy_agreed', true);
          } else {
            wx.exitMiniProgram();
          }
        }
      });
    }
  },

  async getUserInfo() {
    try {
      const loginRes = await wx.login();
      if (loginRes.code) {
        // 这里可以调用后端接口获取用户信息
        // 暂时使用本地存储模拟
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
          this.globalData.userInfo = userInfo;
        }
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  }
});