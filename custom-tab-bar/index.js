Component({
  data: {
    selected: 0,
    color: "#8c8c8c",
    selectedColor: "#07C160",
    list: [{
      pagePath: "/pages/home/index",
      iconPath: "/images/icons/home.png",
      selectedIconPath: "/images/icons/home-active.png",
      text: "首页"
    }, {
      pagePath: "/pages/post-create/index",
      iconPath: "/images/icons/post.png",
      selectedIconPath: "/images/icons/post-active.png",
      text: "发布"
    }, {
      pagePath: "/pages/notification/index",
      iconPath: "/images/icons/notification.png",
      selectedIconPath: "/images/icons/notification-active.png",
      text: "通知"
    }, {
      pagePath: "/pages/profile/index",
      iconPath: "/images/icons/user.png",
      selectedIconPath: "/images/icons/user-active.png",
      text: "我的"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    }
  }
})