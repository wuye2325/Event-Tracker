// pages/event-relation/index.js
const app = getApp();
const { TimelineAPI } = require('../../services/api');

// 定义节点类型和颜色
const NODE_TYPES = {
  CURRENT: { color: '#1890ff', radius: 40, label: '当前事件' },
  PENDING: { color: '#faad14', radius: 30, label: '进行中' },
  RESOLVED: { color: '#52c41a', radius: 30, label: '已解决' },
  REJECTED: { color: '#f5222d', radius: 30, label: '已驳回' }
};

// 定义连线类型和颜色
const LINK_TYPES = {
  DEFAULT: { color: '#bfbfbf', width: 2, label: '关联' },
  CAUSE: { color: '#722ed1', width: 3, label: '因果关系' },
  SEQUENCE: { color: '#13c2c2', width: 3, label: '时序关系' }
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    eventId: '', // 当前事件ID
    currentEvent: {}, // 当前事件详情
    nodes: [], // 节点数据
    links: [], // 连接数据
    loading: true, // 加载状态
    selectedNode: null, // 选中的节点
    showLegend: false, // 是否显示图例
    // Canvas 相关
    canvasWidth: 0,
    canvasHeight: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    startX: 0,
    startY: 0,
    // 布局相关
    centerX: 0,
    centerY: 0,
    radius: 150, // 节点分布半径
    // 交互状态
    isDragging: false,
    isZooming: false,
    lastTouchDistance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('事件关联图页面加载，参数:', options);
    
    // 修改这里，同时支持 id 和 recordId 参数
    const eventId = options.id || options.recordId;
    
    if (eventId) {
      this.setData({
        eventId: eventId
      });
      
      // 获取事件关联数据
      this.loadRelationData(eventId);
    } else {
      wx.showToast({
        title: '缺少事件ID参数',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 增加延迟时间，确保页面完全渲染
    setTimeout(() => {
      this.initCanvas();
    }, 500);
  },

  /**
   * 初始化 Canvas
   */
  async initCanvas() {
    try {
      console.log('开始初始化 Canvas');
      
      // 检查页面是否已经加载完成
      if (this.data.loading) {
        console.log('页面仍在加载中，延迟初始化 Canvas');
        setTimeout(() => {
          this.initCanvas();
        }, 300);
        return;
      }
      
      // 获取 Canvas 节点信息
      const query = wx.createSelectorQuery();
      console.log('创建查询选择器');
      
      query.select('#relationChart')
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log('Canvas 查询结果:', res);
          
          if (!res || !res[0]) {
            console.error('未找到 Canvas 节点，可能是选择器错误或页面未完全加载');
            // 再次尝试初始化
            setTimeout(() => {
              this.initCanvas();
            }, 500);
            return;
          }
          
          const canvasNode = res[0];
          console.log('Canvas 节点信息:', canvasNode);
          
          // 保存 Canvas 尺寸
          const centerX = canvasNode.width / 2;
          const centerY = canvasNode.height / 2;
          
          this.setData({
            canvasWidth: canvasNode.width,
            canvasHeight: canvasNode.height,
            translateX: centerX,
            translateY: centerY,
            centerX: centerX,
            centerY: centerY,
            radius: Math.min(canvasNode.width, canvasNode.height) * 0.3 // 设置关联节点的分布半径
          });
          
          // 获取 Canvas 上下文
          const canvas = canvasNode.node;
          this.canvas = canvas;
          this.ctx = canvas.getContext('2d');
          
          // 设置 Canvas 尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = canvasNode.width * dpr;
          canvas.height = canvasNode.height * dpr;
          this.ctx.scale(dpr, dpr);
          
          console.log('Canvas 初始化完成');
          
          // 如果已有数据，绘制关系图
          if (this.data.nodes && this.data.nodes.length > 0) {
            console.log('开始绘制关系图，节点数:', this.data.nodes.length);
            this.drawRelationGraph();
          } else {
            console.log('暂无节点数据，跳过绘制');
          }
        });
    } catch (error) {
      console.error('初始化 Canvas 失败:', error);
    }
  },

  /**
   * 加载事件关联数据
   */
  async loadRelationData(eventId) {
    try {
      this.setData({ loading: true });
      
      // 获取当前事件详情
      const currentEvent = await TimelineAPI.getTimelineDetail(eventId);
      console.log('当前事件详情:', currentEvent);
      
      // 添加空值检查
      if (!currentEvent) {
        throw new Error('获取事件详情失败，返回为空');
      }
      
      // 获取关联事件列表
      const relatedEventId = currentEvent.timeline_id || currentEvent.id || currentEvent.event_id || eventId;
      
      // 获取关联事件
      const relatedEvents = await this.getRelatedEvents(relatedEventId);
      console.log('关联事件列表:', relatedEvents);
      
      // 获取每个事件的评论数
      const eventsWithComments = await this.getEventsCommentCount([currentEvent, ...relatedEvents]);
      
      // 处理图表数据
      const { nodes, links } = this.processGraphData(currentEvent, eventsWithComments);
      
      this.setData({
        currentEvent,
        nodes,
        links,
        loading: false
      });
      
      // 如果 Canvas 已初始化，绘制关系图
      if (this.ctx) {
        this.drawRelationGraph();
      }
    } catch (error) {
      console.error('加载事件关联数据失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载关联数据失败',
        icon: 'none'
      });
    }
  },
  
  /**
   * 获取关联事件
   */
  async getRelatedEvents(eventId) {
    try {
      console.log('开始获取关联事件，ID:', eventId);
      
      // 检查 TimelineAPI 中可用的方法
      console.log('TimelineAPI 可用方法:', Object.keys(TimelineAPI));
      
      // 尝试使用 getPosts 方法获取关联事件
      const filter = { related_event_id: eventId };
      console.log('查询关联事件，使用过滤条件:', filter);
      
      let relatedEvents = [];
      
      // 尝试使用不同的 API 方法获取关联事件
      if (typeof TimelineAPI.getPosts === 'function') {
        relatedEvents = await TimelineAPI.getPosts(filter);
      } else if (typeof TimelineAPI.getTimeline === 'function') {
        relatedEvents = await TimelineAPI.getTimeline({ filter });
      } else {
        // 如果没有合适的方法，尝试从当前事件的 timeline 属性获取
        const eventDetail = await TimelineAPI.getTimelineDetail(eventId);
        if (eventDetail && eventDetail.timeline && Array.isArray(eventDetail.timeline)) {
          relatedEvents = eventDetail.timeline;
        }
      }
      
      // 如果没有找到关联事件，尝试模拟一些数据
      if (!relatedEvents || relatedEvents.length === 0) {
        console.log('未找到关联事件，创建模拟数据');
        
        // 创建一些模拟数据
        relatedEvents = [
          {
            id: 'mock_event_1',
            title: '相关事件 1',
            content: '这是一个模拟的相关事件',
            status: 'pending',
            created_at: new Date().toISOString(),
            commentCount: 2
          },
          {
            id: 'mock_event_2',
            title: '相关事件 2',
            content: '这是另一个模拟的相关事件',
            status: 'resolved',
            created_at: new Date().toISOString(),
            commentCount: 5
          },
          {
            id: 'mock_event_3',
            title: '相关事件 3',
            content: '这是第三个模拟的相关事件',
            status: 'rejected',
            created_at: new Date().toISOString(),
            commentCount: 1
          }
        ];
      }
      
      console.log('获取到关联事件数量:', relatedEvents.length);
      return relatedEvents || [];
    } catch (error) {
      console.error('获取关联事件失败:', error);
      return [];
    }
  },
  
  /**
   * 获取事件的评论数
   */
  async getEventsCommentCount(events) {
    const eventsWithComments = [];
    
    for (const event of events) {
      if (!event) continue;
      
      try {
        const eventId = event.timeline_id || event.id || event.event_id;
        // 获取评论
        const comments = await TimelineAPI.getComments(eventId);
        
        const commentCount = Array.isArray(comments) ? comments.length : 0;
        eventsWithComments.push({
          ...event,
          commentCount
        });
      } catch (error) {
        console.error('获取事件评论数失败:', error);
        eventsWithComments.push({
          ...event,
          commentCount: 0
        });
      }
    }
    
    return eventsWithComments;
  },

  /**
   * 处理图表数据
   */
  processGraphData(currentEvent, relatedEvents) {
    // 节点数据
    const nodes = [];
    // 连接数据
    const links = [];
    
    // 当前事件作为中心节点
    const currentId = currentEvent.timeline_id || currentEvent.id || currentEvent.event_id || currentEvent.recordId;
    const currentNode = {
      id: currentId,
      name: currentEvent.title || '当前事件',
      description: currentEvent.content || currentEvent.description,
      status: currentEvent.status || 'pending',
      statusText: this.getStatusText(currentEvent.status),
      statusColor: this.getStatusColor(currentEvent.status),
      time: currentEvent.created_at || currentEvent.publish_time || '',
      location: currentEvent.location || '',
      commentCount: currentEvent.commentCount || currentEvent.comment_count || 0,
      type: 'CURRENT',
      // 确保当前事件在画布中心
      x: 0,
      y: 0,
      radius: NODE_TYPES.CURRENT.radius
    };
    
    nodes.push(currentNode);
    
    // 处理关联事件节点
    if (relatedEvents && relatedEvents.length > 0) {
      // 计算每个节点的位置（围绕中心节点均匀分布）
      const angleStep = (2 * Math.PI) / relatedEvents.length;
      const radius = this.data.radius || Math.min(this.data.canvasWidth, this.data.canvasHeight) * 0.3;
      
      // 找出评论数的最大值和最小值，用于计算节点大小
      let maxComments = 1;
      let minComments = 0;
      
      relatedEvents.forEach(event => {
        if (!event) return;
        const commentCount = event.commentCount || event.comment_count || 0;
        if (commentCount > maxComments) maxComments = commentCount;
      });
      
      // 计算评论数与节点大小的比例
      const minRadius = 20;
      const maxRadius = 40;
      const radiusRange = maxRadius - minRadius;
      
      relatedEvents.forEach((event, index) => {
        if (!event) return;
        
        const eventId = event.timeline_id || event.id || event.event_id || event.recordId;
        if (!eventId || eventId === currentId) return;
        
        // 计算节点位置（围绕中心节点的圆形布局）
        const angle = index * angleStep;
        // 使用相对于中心的坐标
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // 确定节点类型和样式
        const nodeType = this.getNodeType(event.status);
        
        // 根据评论数计算节点大小
        const commentCount = event.commentCount || event.comment_count || 0;
        let nodeRadius = minRadius;
        
        if (maxComments > minComments) {
          // 计算节点半径，评论数越多，节点越大
          const ratio = (commentCount - minComments) / (maxComments - minComments);
          nodeRadius = minRadius + (ratio * radiusRange);
        }
        
        // 创建节点
        const node = {
          id: eventId,
          name: event.title || event.content?.substring(0, 10) || `事件 ${index + 1}`,
          description: event.content || event.description || '',
          status: event.status || 'pending',
          statusText: this.getStatusText(event.status),
          statusColor: this.getStatusColor(event.status),
          time: event.created_at || event.publish_time || '',
          location: event.location || '',
          commentCount: commentCount,
          type: nodeType,
          x: x,
          y: y,
          radius: Math.max(nodeRadius, NODE_TYPES[nodeType].radius * 0.7) // 确保节点不会太小
        };
        
        nodes.push(node);
        
        // 创建与中心节点的连接
        const link = {
          source: currentId,
          target: eventId,
          type: 'DEFAULT',
          color: LINK_TYPES.DEFAULT.color,
          width: LINK_TYPES.DEFAULT.width
        };
        
        links.push(link);
      });
    }
    
    return { nodes, links };
  },
  
  /**
   * 获取节点类型
   */
  getNodeType(status) {
    if (!status) return 'PENDING';
    
    switch (status.toLowerCase()) {
      case 'resolved':
      case '已解决':
        return 'RESOLVED';
      case 'rejected':
      case '已驳回':
        return 'REJECTED';
      case 'pending':
      case '进行中':
      default:
        return 'PENDING';
    }
  },
  
  /**
   * 获取状态文本
   */
  getStatusText(status) {
    if (!status) return '进行中';
    
    switch (status.toLowerCase()) {
      case 'resolved':
        return '已解决';
      case 'rejected':
        return '已驳回';
      case 'pending':
        return '进行中';
      default:
        return status;
    }
  },
  
  /**
   * 获取状态颜色
   */
  getStatusColor(status) {
    if (!status) return NODE_TYPES.PENDING.color;
    
    switch (status.toLowerCase()) {
      case 'resolved':
      case '已解决':
        return NODE_TYPES.RESOLVED.color;
      case 'rejected':
      case '已驳回':
        return NODE_TYPES.REJECTED.color;
      case 'pending':
      case '进行中':
      default:
        return NODE_TYPES.PENDING.color;
    }
  },

  /**
   * 绘制关系图
   */
  drawRelationGraph() {
    if (!this.ctx || !this.canvas) {
      console.error('Canvas 上下文未初始化');
      return;
    }
    
    // 直接使用 this.data 而不是 this._getData()
    const { nodes, links, scale, translateX, translateY } = this.data;
    
    if (!nodes || nodes.length === 0) {
      console.log('没有节点数据，跳过绘制');
      return;
    }
    
    // 清空画布
    this.ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    // 应用缩放和平移
    this.ctx.save();
    this.ctx.translate(translateX, translateY);
    this.ctx.scale(scale, scale);
    
    // 先绘制连接线
    this.drawLinks(links, nodes);
    
    // 再绘制节点
    this.drawNodes(nodes);
    
    // 如果需要显示图例，绘制图例
    if (this.data.showLegend) {
      this.drawLegend();
    }
    
    // 恢复画布状态
    this.ctx.restore();
  },
  
  /**
   * 绘制连接线
   */
  drawLinks(links, nodes) {
    if (!links || !nodes) return;
    
    // 创建节点 ID 到节点对象的映射
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = node;
    });
    
    // 绘制每条连接线
    links.forEach(link => {
      const sourceNode = nodeMap[link.source];
      const targetNode = nodeMap[link.target];
      
      if (!sourceNode || !targetNode) return;
      
      // 设置线条样式
      this.ctx.strokeStyle = link.color || LINK_TYPES.DEFAULT.color;
      this.ctx.lineWidth = link.width || LINK_TYPES.DEFAULT.width;
      
      // 直接使用节点的相对坐标
      this.ctx.beginPath();
      this.ctx.moveTo(sourceNode.x, sourceNode.y);
      this.ctx.lineTo(targetNode.x, targetNode.y);
      this.ctx.stroke();
    });
  },
  
  /**
   * 绘制节点
   */
  drawNodes(nodes) {
    if (!nodes) return;
    
    nodes.forEach(node => {
      // 直接使用节点的相对坐标
      const x = node.x;
      const y = node.y;
      
      // 获取节点样式
      const nodeType = node.type || 'PENDING';
      const nodeStyle = NODE_TYPES[nodeType];
      
      // 使用节点自己的半径，而不是预定义的半径
      const radius = node.radius || nodeStyle.radius;
      
      // 绘制节点圆形
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = node.statusColor || nodeStyle.color;
      this.ctx.fill();
      
      // 绘制节点边框
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // 绘制节点标题
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      // 如果标题过长，截断显示
      const maxTitleLength = Math.max(3, Math.floor(radius * 1.5 / 7)); // 根据节点半径计算最大标题长度
      let title = node.name || '';
      if (title.length > maxTitleLength) {
        title = title.substring(0, maxTitleLength - 2) + '..';
      }
      
      this.ctx.fillText(title, x, y - 5);
      
      // 绘制评论数
      if (node.commentCount > 0) {
        this.ctx.font = '12px sans-serif';
        this.ctx.fillText(`${node.commentCount}条评论`, x, y + 10);
      }
      
      // 如果是选中的节点，绘制选中效果
      if (this.data.selectedNode && this.data.selectedNode.id === node.id) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius + 5, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#1890ff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
    });
  },
  
  /**
   * 绘制图例
   */
  drawLegend() {
    // 直接使用 this.data 而不是 this._getData()
    if (!this.ctx || !this.data.showLegend) return;
    
    const padding = 10;
    const itemHeight = 30;
    const legendWidth = 150;
    const legendHeight = (Object.keys(NODE_TYPES).length + Object.keys(LINK_TYPES).length) * itemHeight + padding * 2;
    
    // 绘制图例背景
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(padding, padding, legendWidth, legendHeight);
    this.ctx.strokeStyle = '#e8e8e8';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(padding, padding, legendWidth, legendHeight);
    
    // 绘制节点类型图例
    let y = padding + itemHeight / 2;
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.fillStyle = '#333333';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('节点类型:', padding + 10, y);
    y += itemHeight;
    
    Object.entries(NODE_TYPES).forEach(([type, style]) => {
      // 绘制节点示例
      this.ctx.beginPath();
      this.ctx.arc(padding + 20, y, 10, 0, 2 * Math.PI);
      this.ctx.fillStyle = style.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // 绘制节点说明文字
      this.ctx.fillStyle = '#333333';
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText(style.label, padding + 40, y);
      
      y += itemHeight;
    });
    
    // 绘制连线类型图例
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.fillText('连线类型:', padding + 10, y);
    y += itemHeight;
    
    Object.entries(LINK_TYPES).forEach(([type, style]) => {
      // 绘制连线示例
      this.ctx.beginPath();
      this.ctx.moveTo(padding + 10, y);
      this.ctx.lineTo(padding + 30, y);
      this.ctx.strokeStyle = style.color;
      this.ctx.lineWidth = style.width;
      this.ctx.stroke();
      
      // 绘制连线说明文字
      this.ctx.fillStyle = '#333333';
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText(style.label, padding + 40, y);
      
      y += itemHeight;
    });
  },
  
  /**
   * 查找点击位置的节点
   */
  findNodeAtPosition(x, y) {
    // 直接使用 this.data 而不是 this._getData()
    const { nodes, scale, translateX, translateY } = this.data;
    
    // 转换为画布坐标
    const canvasX = (x - translateX) / scale;
    const canvasY = (y - translateY) / scale;
    
    // 从后往前检查（后绘制的节点在上层）
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      // 修正坐标计算
      const nodeX = node.x - this.data.centerX;
      const nodeY = node.y - this.data.centerY;
      const radius = node.radius || NODE_TYPES[node.type || 'PENDING'].radius;
      
      // 计算点击位置到节点中心的距离
      const distance = Math.sqrt(Math.pow(canvasX - nodeX, 2) + Math.pow(canvasY - nodeY, 2));
      
      // 如果距离小于节点半径，则认为点击了该节点
      if (distance <= radius) {
        return node;
      }
    }
    
    return null;
  },
  
  /**
   * 显示节点详情
   */
  showNodeDetail(node) {
    if (!node) return;
    
    this.setData({
      selectedNode: node
    });
    
    // 重新绘制关系图，显示选中效果
    this.drawRelationGraph();
    
    // 显示节点详情弹窗
    wx.showModal({
      title: node.name,
      content: `状态: ${node.statusText || '未知'}\n时间: ${node.time || '未知'}\n地点: ${node.location || '未知'}\n评论数: ${node.commentCount || 0}\n\n${node.description || '暂无描述'}`,
      showCancel: true,
      cancelText: '关闭',
      confirmText: '查看详情',
      success: (res) => {
        if (res.confirm) {
          // 跳转到事件详情页
          wx.navigateTo({
            url: `/pages/event-detail/index?id=${node.id}`
          });
        }
        
        // 无论是确认还是取消，都清除选中状态
        this.setData({
          selectedNode: null
        });
        
        // 重新绘制关系图
        this.drawRelationGraph();
      }
    });
  },
  
  /**
   * 切换图例显示状态
   */
  toggleLegend() {
    this.setData({
      showLegend: !this.data.showLegend
    });
    
    // 重新绘制关系图
    this.drawRelationGraph();
  },
  
  /**
   * 重置视图
   */
  resetView() {
    this.setData({
      scale: 1,
      translateX: this.data.centerX,
      translateY: this.data.centerY
    });
    
    // 重新绘制关系图
    this.drawRelationGraph();
  },
  
  /**
   * Canvas 触摸开始事件
   */
  onTouchStart(e) {
    const touches = e.touches;
    
    if (touches.length === 1) {
      // 单指触摸，可能是点击或拖动
      const touch = touches[0];
      
      this.setData({
        startX: touch.x,
        startY: touch.y,
        isDragging: true
      });
      
      // 检查是否点击了节点
      const node = this.findNodeAtPosition(touch.x, touch.y);
      if (node) {
        // 如果点击了节点，显示节点详情
        this.showNodeDetail(node);
        this.setData({
          isDragging: false
        });
      }
    } else if (touches.length === 2) {
      // 双指触摸，准备缩放
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // 计算两指之间的距离
      const distance = Math.sqrt(
        Math.pow(touch1.x - touch2.x, 2) + 
        Math.pow(touch1.y - touch2.y, 2)
      );
      
      this.setData({
        lastTouchDistance: distance,
        isZooming: true,
        isDragging: false
      });
    }
  },
  
  /**
   * Canvas 触摸移动事件
   */
  onTouchMove(e) {
    const touches = e.touches;
    
    if (touches.length === 1 && this.data.isDragging) {
      // 单指拖动
      const touch = touches[0];
      const deltaX = touch.x - this.data.startX;
      const deltaY = touch.y - this.data.startY;
      
      this.setData({
        translateX: this.data.translateX + deltaX,
        translateY: this.data.translateY + deltaY,
        startX: touch.x,
        startY: touch.y
      });
      
      // 重新绘制关系图
      this.drawRelationGraph();
    } else if (touches.length === 2 && this.data.isZooming) {
      // 双指缩放
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // 计算两指之间的新距离
      const distance = Math.sqrt(
        Math.pow(touch1.x - touch2.x, 2) + 
        Math.pow(touch1.y - touch2.y, 2)
      );
      
      // 计算缩放比例变化
      const scaleDelta = distance / this.data.lastTouchDistance;
      
      // 限制缩放范围
      let newScale = this.data.scale * scaleDelta;
      if (newScale < 0.5) newScale = 0.5;
      if (newScale > 2) newScale = 2;
      
      this.setData({
        scale: newScale,
        lastTouchDistance: distance
      });
      
      // 重新绘制关系图
      this.drawRelationGraph();
    }
  },
  
  /**
   * Canvas 触摸结束事件
   */
  onTouchEnd() {
    this.setData({
      isDragging: false,
      isZooming: false
    });
  },
  
  /**
   * 放大视图
   */
  zoomIn() {
    let newScale = this.data.scale * 1.2;
    if (newScale > 2) newScale = 2;
    
    this.setData({
      scale: newScale
    });
    
    // 重新绘制关系图
    this.drawRelationGraph();
  },
  
  /**
   * 缩小视图
   */
  zoomOut() {
    let newScale = this.data.scale / 1.2;
    if (newScale < 0.5) newScale = 0.5;
    
    this.setData({
      scale: newScale
    });
    
    // 重新绘制关系图
    this.drawRelationGraph();
  },
  
  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  }
})