Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    extra: {
      type: String,
      value: ''
    },
    thumb: {
      type: String,
      value: ''
    },
    status: {
      type: String,
      value: ''
    },
    time: {
      type: String,
      value: ''
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap');
    }
  }
}); 