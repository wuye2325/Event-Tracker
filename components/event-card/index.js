const { formatEventStatus } = require('../../utils/util');

Component({
  properties: {
    event: {
      type: Object,
      value: {}
    }
  },

  data: {
    statusText: ''
  },

  observers: {
    'event.status': function(status) {
      if (status) {
        this.setData({
          statusText: formatEventStatus(status)
        });
      }
    }
  },

  methods: {
    onTap() {
      const { event } = this.data;
      wx.navigateTo({
        url: `/pages/event-detail/index?id=${event.event_id}`
      });
    }
  }
}); 