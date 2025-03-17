App({
  globalData: {
    userInfo: null,
    appId: 'cli_a75e41b0cdfcd013',
    appSecret: 'gQDboZzkXd84iVSAJglqkhrWC8GhtXBf',
    baseUrl: 'https://open.feishu.cn/open-apis/'
  },

  // 全局错误处理函数
  handleError(error, type = '未知', details = {}) {
    const errorInfo = {
      type,
      message: error.message || error.errMsg || '未知错误',
      stack: error.stack,
      details,
      timestamp: new Date().toISOString(),
      page: getCurrentPages().length ? getCurrentPages()[getCurrentPages().length - 1].route : ''
    };
    
    console.error('=== 错误日志 ===');
    console.error(JSON.stringify(errorInfo, null, 2));
    console.error('===============');
    
    // 可以在这里添加错误上报逻辑
    return errorInfo;
  },

  onLaunch() {
    // 展示隐私协议
    this.showPrivacyAgreement();
    // 获取用户信息
    this.getUserInfo();
    
    // 捕获全局错误
    wx.onError(err => {
      console.error('全局错误:', err);
      this.onError(err);
    });
    
    // 捕获Promise未处理的rejection
    wx.onUnhandledRejection(res => {
      console.error('未处理的Promise拒绝:', res.reason);
    });
  },

  async getTenantAccessToken() {
    console.log('请求层 - 开始获取tenant_access_token');
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
      const errorInfo = this.handleError(error, '获取tenant_access_token失败', {
        api: 'auth/v3/tenant_access_token/internal',
        method: 'POST'
      });
      wx.showToast({
        title: '系统异常',
        icon: 'error'
      });
      return null;
    }
  },

  async callFeishuAPI(path, method = 'GET', token, data = null) {
    console.log(`请求层 - 调用飞书API: ${path}`, { method, data });
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
      const errorInfo = this.handleError(error, '调用飞书API失败', {
        path,
        method,
        data
      });
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
      const errorInfo = this.handleError(error, '用户登录失败', {
        code: loginRes?.code
      });
    }
  },

  onError(error) {
    // 全局未捕获异常处理
    const errorInfo = this.handleError(error, '全局未捕获异常');
    
    // 处理组件加载和样式错误
    if (error && (error.message?.includes('Cannot read properties of null') || error.message?.includes('Cannot read properties of undefined'))) {
      console.error('组件加载或样式错误:', error);
      
      // 延迟重新加载页面，给予足够时间让组件完成初始化
      setTimeout(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage) {
          currentPage.onLoad(currentPage.options);
        }
      }, 500);
    }
    
    // 特别处理组件加载错误
    if (error && error.message && error.message.includes('Component is not found')) {
      const currentPage = getCurrentPages().length ? getCurrentPages()[getCurrentPages().length - 1] : null;
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        page: currentPage ? currentPage.route : '',
        options: currentPage ? currentPage.options : {},
        timestamp: new Date().toISOString()
      };
      
      console.error('组件加载失败:', errorDetails);
      
      // 检查页面是否已注册
      const pageRegistered = !!currentPage;
      if (!pageRegistered) {
        console.error('页面未注册:', currentPage ? currentPage.route : '未知页面');
        // 等待页面注册完成
        const waitForPageRegistration = () => {
          return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              const pages = getCurrentPages();
              const currentPage = pages.length ? pages[pages.length - 1] : null;
              if (currentPage && currentPage.route === 'pages/home/index') {
                clearInterval(checkInterval);
                resolve(true);
              }
            }, 100);
            // 10秒后超时
            setTimeout(() => {
              clearInterval(checkInterval);
              resolve(false);
            }, 10000);
          });
        };

        wx.showLoading({
          title: '加载中...',
          mask: true
        });

        // 等待页面注册
        waitForPageRegistration().then((registered) => {
          wx.hideLoading();
          if (!registered) {
            wx.showToast({
              title: '加载超时',
              icon: 'error',
              duration: 2000
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/home/index'
              });
            }, 2000);
          }
        });
        return;
      }
      
      // 显示错误提示
      wx.showToast({
        title: '页面加载异常',
        icon: 'error',
        duration: 2000
      });
      
      // 尝试重新加载页面，最多重试3次
      if (currentPage && currentPage.onLoad) {
        let retryCount = 0;
        const maxRetries = 3;
        const retryInterval = 1000; // 1秒间隔
        
        const retryLoad = () => {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`正在尝试第${retryCount}次重新加载页面...`);
            
            try {
              // 确保页面组件已加载
              wx.nextTick(() => {
                currentPage.onLoad(currentPage.options || {});
                console.log('页面重新加载成功');
              });
            } catch (e) {
              console.error(`第${retryCount}次重新加载失败:`, e);
              
              if (retryCount < maxRetries) {
                setTimeout(retryLoad, retryInterval);
              } else {
                console.error('达到最大重试次数，页面加载失败');
                wx.showModal({
                  title: '提示',
                  content: '页面加载失败，请尝试重新进入',
                  showCancel: false,
                  success: () => {
                    wx.reLaunch({
                      url: '/pages/home/index'
                    });
                  }
                });
              }
            }
          }
        };
        
        retryLoad();
      }
    }
    
    // 处理组件加载和样式错误
    if (error && (error.message?.includes('Cannot read properties of null') || error.message?.includes('Cannot read properties of undefined'))) {
      console.error('组件加载或样式错误:', error);
      
      // 延迟重新加载页面，给予足够时间让组件完成初始化
      setTimeout(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage) {
          currentPage.onLoad(currentPage.options);
        }
      }, 500);
    }
    
    // 特别处理组件加载错误
    if (error && error.message && error.message.includes('Component is not found')) {
      const currentPage = getCurrentPages().length ? getCurrentPages()[getCurrentPages().length - 1] : null;
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        page: currentPage ? currentPage.route : '',
        options: currentPage ? currentPage.options : {},
        timestamp: new Date().toISOString()
      };
      
      console.error('组件加载失败:', errorDetails);
      
      // 检查页面是否已注册
      const pageRegistered = !!currentPage;
      if (!pageRegistered) {
        console.error('页面未注册:', currentPage ? currentPage.route : '未知页面');
        // 等待页面注册完成
        const waitForPageRegistration = () => {
          return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              const pages = getCurrentPages();
              const currentPage = pages.length ? pages[pages.length - 1] : null;
              if (currentPage && currentPage.route === 'pages/home/index') {
                clearInterval(checkInterval);
                resolve(true);
              }
            }, 100);
            // 10秒后超时
            setTimeout(() => {
              clearInterval(checkInterval);
              resolve(false);
            }, 10000);
          });
        };

        wx.showLoading({
          title: '加载中...',
          mask: true
        });

        // 等待页面注册
        waitForPageRegistration().then((registered) => {
          wx.hideLoading();
          if (!registered) {
            wx.showToast({
              title: '加载超时',
              icon: 'error',
              duration: 2000
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/home/index'
              });
            }, 2000);
          }
        });
        return;
      }
      
      // 显示错误提示
      wx.showToast({
        title: '页面加载异常',
        icon: 'error',
        duration: 2000
      });
      
      // 尝试重新加载页面，最多重试3次
      if (currentPage && currentPage.onLoad) {
        let retryCount = 0;
        const maxRetries = 3;
        const retryInterval = 1000; // 1秒间隔
        
        const retryLoad = () => {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`正在尝试第${retryCount}次重新加载页面...`);
            
            try {
              // 确保页面组件已加载
              wx.nextTick(() => {
                currentPage.onLoad(currentPage.options || {});
                console.log('页面重新加载成功');
              });
            } catch (e) {
              console.error(`第${retryCount}次重新加载失败:`, e);
              
              if (retryCount < maxRetries) {
                setTimeout(retryLoad, retryInterval);
              } else {
                console.error('达到最大重试次数，页面加载失败');
                wx.showModal({
                  title: '提示',
                  content: '页面加载失败，请尝试重新进入',
                  showCancel: false,
                  success: () => {
                    wx.reLaunch({
                      url: '/pages/home/index'
                    });
                  }
                });
              }
            }
          }
        };
        
        retryLoad();
      }
    }
  }
});


// 删除这部分重复的 App() 调用
// App({
//   onLaunch() {
//     // 捕获全局错误
//     wx.onError(err => {
//       console.error('全局错误:', err);
//     });
//     
//     // 捕获Promise未处理的rejection
//     wx.onUnhandledRejection(res => {
//       console.error('未处理的Promise拒绝:', res.reason);
//     });
//   },
//   
//   handleError(error, message, context = {}) {
//     console.error(`${message}:`, error, context);
//     // 可以在这里添加错误上报逻辑
//   },
//   
//   globalData: {}
// })