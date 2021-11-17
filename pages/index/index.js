import ClassicModel from '../../model/classic.js';
const classicModel = new ClassicModel();
const app = getApp();

Page({
  data: {
    PageCur: 'simulation',
  },
  onLoad: function () {
    // this.getData();
  },
  NavChange(e) {
    const PageCur = e.currentTarget.dataset.cur
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
  getData() {
    this._getClassicList();
    this._getFiftySubject();
  },
  _getClassicList() {
    classicModel.getClassic({ limit: 5 }).then(res => {
      app.globalData.arrOne = res.list;
      app.globalData.total = res.total;
    });
  },
  _getFiftySubject() {
    classicModel
      .getFiftySubject()
      .then(res => {
        return res.list.map(item => ({
          ...item,
          options: item.options.map(opt => ({
            description: opt,
            className: '',
          })),
        }));
      })
      .then(res => {
        app.globalData.fiftySubject = res;
      });
  },
  onLoad() {
  },
  onShow() {
    if (this.data.PageCur === 'mine') {
      let myComponent = this.selectComponent('#mine'); // 页面获取自定义组件实例
      myComponent.onLoad && myComponent.onLoad()
    }
  }
});
