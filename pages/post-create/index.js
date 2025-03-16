// pages/post-create/index.js
const { EventAPI, TimelineAPI, BitableAPI, UserAPI } = require('../../services/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventId: '',
    content: '',
    images: [],
    type: '公告', // 默认类型
    typeList: ['公告', '投票', '倡议'],
    submitting: false,
    currentStatus: 'published', // published, draft, revoked
    posts: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.eventId) {
      this.setData({ eventId: options.eventId });
    }
    
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    
    this.loadPosts();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadPosts()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  onTypeChange(e) {
    this.setData({
      type: e.detail.value
    });
  },

  async onChooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      
      // 上传图片到服务器
      const uploadTasks = res.tempFilePaths.map(async (path) => {
        try {
          const uploadRes = await wx.uploadFile({
            url: 'YOUR_UPLOAD_URL', // 替换为实际的上传接口
            filePath: path,
            name: 'file'
          });
          return JSON.parse(uploadRes.data).url;
        } catch (error) {
          console.error('图片上传失败:', error);
          return null;
        }
      });
      
      const uploadedImages = await Promise.all(uploadTasks);
      const validImages = uploadedImages.filter(url => url);
      
      this.setData({
        images: [...this.data.images, ...validImages]
      });
    } catch (error) {
      console.error('选择图片失败:', error);
    }
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  async onSubmit() {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    // 检查用户是否登录
    if (!this.data.userInfo || !this.data.userInfo.userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    try {
      this.setData({ submitting: true });

      // 如果没有eventId,先创建事件
      if (!this.data.eventId) {
        const event = await EventAPI.createEvent({
          title: this.data.content.slice(0, 20) + '...',
          description: this.data.content,
          tags: [],
          author: this.data.userInfo.nickName,
          author_id: this.data.userInfo.userId // 添加作者ID
        });
        this.setData({ eventId: event.record_id });
      }

      // 创建时间线记录
      await TimelineAPI.createPost({
        eventRecordId: this.data.eventId,
        content: this.data.content,
        type: this.data.type,
        images: this.data.images,
        author: this.data.userInfo.nickName,
        author_id: this.data.userInfo.userId // 添加作者ID
      });

      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      // 清空表单
      this.setData({
        content: '',
        images: [],
        type: '公告'
      });
      
      // 刷新帖子列表
      this.loadPosts
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.showToast({
        title: '发布失败',
        icon: 'error'
      });
    } finally {
      this.setData({ submitting: false });
    }
  },

  onChangeStatus(e) {
    const status = e.currentTarget.dataset.status
    this.setData({ 
      currentStatus: status,
      posts: []
    }, () => {
      this.loadPosts()
    })
  },

  async loadPosts() {
    try {
      this.setData({ loading: true });
      wx.showLoading({ title: '加载中' });
      
      // 获取用户信息
      const userInfo = this.data.userInfo;
      
      if (!userInfo || !userInfo.userId) {
        this.setData({ 
          posts: [],
          loading: false 
        });
        wx.hideLoading();
        return;
      }
      
      // 获取当前用户的帖子
      const posts = await UserAPI.getUserPosts(userInfo.userId);
      
      // 过滤出当前状态的帖子
      const filteredPosts = posts.filter(post => 
        this.data.currentStatus === 'published' 
          ? post.status === 'published' 
          : post.status === 'revoked'
      );
      
      this.setData({
        posts: filteredPosts.map(post => ({
          ...post,
          createTime: post.createTime ? new Date(post.createTime).toLocaleString() : '未知时间'
        }))
      });
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    } finally {
      this.setData({ loading: false });
      wx.hideLoading();
    }
  },

  onViewPost(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/event-detail/index?id=${id}`
    })
  },

  onCreatePost() {
    wx.navigateTo({
      url: '/pages/post-edit/index'
    })
  },

  onEditPost(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/post-edit/index?id=${id}`
    })
  },

  async onRevokePost(e) {
    const id = e.currentTarget.dataset.id
    
    try {
      const { confirm } = await wx.showModal({
        title: '确认撤销',
        content: '撤销后将不再公开显示，是否继续？',
        confirmText: '撤销'
      })
      
      if (!confirm) return;
      
      // 调用撤销接口
      await BitableAPI.updateTimeline(id, {
        status: 'revoked'
      });
      
      wx.showToast({
        title: '已撤销',
        icon: 'success'
      })
      
      this.loadPosts()
    } catch (error) {
      console.error('Failed to revoke post:', error)
      wx.showToast({
        title: '撤销失败',
        icon: 'error'
      })
    }
  },

  async onDeletePost(e) {
    const id = e.currentTarget.dataset.id
    
    try {
      const { confirm } = await wx.showModal({
        title: '确认删除',
        content: '删除后不可恢复，是否继续？',
        confirmText: '删除'
      })
      
      if (!confirm) return;
      
      // 调用删除接口
      await BitableAPI.deleteTimeline(id);
      
      wx.showToast({
        title: '已删除',
        icon: 'success'
      })
      
      this.loadPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
      wx.showToast({
        title: '删除失败',
        icon: 'error'
      })
    }
  }
})