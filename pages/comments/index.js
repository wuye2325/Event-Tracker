// pages/comments/index.js
const { TimelineAPI } = require('../../services/api');
const { formatTime } = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: null,
    comments: [],
    commentText: '',
    timelineId: '',
    replyTo: '', // 回复目标的昵称
    replyToId: '', // 回复目标的评论ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({ timelineId: options.id });
      this.loadData();
    }
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

  async loadData() {
    console.log('业务层 - 开始加载评论数据', {
      timelineId: this.data.timelineId
    });
    try {
      wx.showLoading({ title: '加载中' });
      
      // 获取原帖内容
      const post = await TimelineAPI.getTimelineDetail(this.data.timelineId);
      console.log('获取到的原帖内容:', post);
      
      // 获取评论列表
      const comments = await TimelineAPI.getComments(this.data.timelineId);
      console.log('获取到的原始评论列表:', comments);
      
      // 格式化评论数据
      const formattedComments = comments.map(comment => {
        console.log('处理评论数据:', comment);
        // 确保所有必要字段都存在
        return {
          recordId: comment.recordId,
          comment_id: comment.comment_id,
          content: comment.content || '',
          nickname: comment.nickname || '匿名用户',
          publish_time: formatTime(new Date(comment.publish_time || Date.now())),
          like_count: comment.like_count || 0,
          replies: [] // 暂时不处理回复，因为当前数据没有层级关系
        };
      });
      
      console.log('格式化后的评论数据:', formattedComments);

      // 设置页面数据
      const pageData = {
        post: {
          ...post,
          publish_time: formatTime(new Date(post.publish_time || Date.now()))
        },
        comments: formattedComments // 直接使用所有评论作为顶级评论
      };
      
      console.log('即将设置到页面的数据:', pageData);
      this.setData(pageData);
      
      console.log('页面数据设置完成，当前数据:', {
        post: this.data.post,
        comments: this.data.comments
      });
    } catch (error) {
      const errorInfo = getApp().handleError(error, '加载评论数据失败', {
        timelineId: this.data.timelineId,
        post,
        comments
      });
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    } finally {
      wx.hideLoading();
    }
  },

  onCommentInput(e) {
    this.setData({
      commentText: e.detail.value
    });
  },

  async onSendComment() {
    if (!this.data.commentText.trim()) return;

    try {
      wx.showLoading({ title: '发送中' });
      
      await TimelineAPI.createComment({
        timelineRecordId: this.data.timelineId,
        content: this.data.commentText,
        parentId: this.data.replyToId, // 如果是回复，则带上父评论ID
        author: '王主任' // TODO: 使用真实用户信息
      });

      // 清空输入框并刷新评论列表
      this.setData({ 
        commentText: '',
        replyTo: '',
        replyToId: ''
      });
      await this.loadData();

      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
    } catch (error) {
      const errorInfo = getApp().handleError(error, '发送评论失败', {
        timelineId: this.data.timelineId,
        content: this.data.commentText,
        parentId: this.data.replyToId,
        author: '王主任'
      });
      wx.showToast({
        title: '发送失败',
        icon: 'error'
      });
    } finally {
      wx.hideLoading();
    }
  },

  onReplyComment(e) {
    const { id } = e.currentTarget.dataset;
    const comment = this.data.comments.find(c => c.recordId === id);
    if (comment) {
      this.setData({
        replyTo: comment.nickname,
        replyToId: comment.recordId
      });
    }
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({
      current,
      urls
    });
  }
})