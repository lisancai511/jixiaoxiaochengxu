Page({
  data: {
    TabCur: 1,
    scrollLeft: 0
  },
  tabSelect(e) {
    console.log(e.currentTarget.id)
    this.setData({
      TabCur: e.currentTarget.id,
      scrollLeft: (e.currentTarget.id - 1) * 60
    })
  }
})