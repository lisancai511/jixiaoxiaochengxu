Page({
  data: {
    PageCur: 'simulation'
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
})