import ClassicModel from '../../model/classic.js'
const classicModel = new ClassicModel()
const app = getApp()

Page({
  data: {
    PageCur: 'simulation'
  },
  onLoad: function () {
    this.getData()
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '新规题库，精编考题，仿真模拟，轻松get驾考知识点!',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  getData() {
    this._getClassicList()
    this._getFiftySubject()
  },
  _getClassicList() {
    classicModel.getClassic().then(res=> {
      return res.list.map(item => ({
        ...item,
        options: item.options.map(opt => ({
          description: opt,
          className: ''
        }))
      }))
    }).then(res => {
      app.globalData.arrOne = res
    })
  },
  _getFiftySubject() {
    classicModel.getFiftySubject().then(res=> {
      return res.list.map(item => ({
        ...item,
        options: item.options.map(opt => ({
          description: opt,
          className: ''
        }))
      }))
    }).then(res => {
      app.globalData.fiftySubject = res
    })
  }
})