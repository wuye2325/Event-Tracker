const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

// 防抖函数
const debounce = (fn, delay = 500) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 节流函数
const throttle = (fn, delay = 500) => {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last > delay) {
      fn.apply(this, args);
      last = now;
    }
  };
};

// 显示加载提示
const showLoading = (title = '加载中') => {
  wx.showLoading({
    title,
    mask: true
  });
};

// 隐藏加载提示
const hideLoading = () => {
  wx.hideLoading();
};

// 显示提示信息
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
};

// 格式化事件状态
const formatEventStatus = status => {
  const statusMap = {
    'optKQgNnTm': '进行中',
    'optov3wPlW': '已结束'
  };
  return statusMap[status] || status;
};

// 格式化时间线类型
const formatTimelineType = type => {
  const typeMap = {
    'optJhialSX': '投票',
    'optOJwRJL5': '公告',
    'optXV4Gxzp': '倡议'
  };
  return typeMap[type] || type;
};

module.exports = {
  formatTime,
  formatNumber,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  showToast,
  formatEventStatus,
  formatTimelineType
}; 