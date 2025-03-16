// pages/ec-canvas/wx-canvas.js
export default class WxCanvas {
  constructor(ctx, canvasId, isNew, canvasNode) {
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;
    this.isNew = isNew;
    if (isNew) {
      this.canvasNode = canvasNode;
    }
  }

  setChart(chart) {
    this.chart = chart;
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  exec(args) {
    if (!args) {
      return;
    }
    if (typeof args === 'string') {
      args = [args];
    }
    const func = args[0];
    if (this.isNew) {
      if (func === 'toDataURL') {
        console.log('New canvas has not implemented toDataURL');
        return;
      }
      this.ctx.__proto__[func].apply(this.ctx, args.slice(1));
    } else {
      this.ctx[func].apply(this.ctx, args.slice(1));
    }
  }

  measureText(text) {
    return this.ctx.measureText(text);
  }

  getContext(contextType) {
    if (contextType === '2d') {
      return this.ctx;
    }
  }
}