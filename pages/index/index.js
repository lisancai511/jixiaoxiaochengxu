const app = getApp();

Page({
  data: {
    PageCur: 'simulation',
  },
  NavChange(e) {
    const PageCur = e.currentTarget.dataset.cur
    console.log('PageCur', PageCur)
    this.setData({
      PageCur,
    });

    let myComponent = this.selectComponent(`#${PageCur}`); // 页面获取自定义组件实例
    myComponent.onLoad && myComponent.onLoad()
  },
  onShareAppMessage() {
    return {
      title: '新规题库，精编考题，仿真模拟，轻松get驾考知识点!',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index',
    };
  },
  onLoad() {
  },
  onShow() {
    const {PageCur} = this.data
    const id = `#${PageCur}`
    let myComponent = this.selectComponent(id); // 页面获取自定义组件实例
    myComponent.onLoad && myComponent.onLoad()
  }
});
