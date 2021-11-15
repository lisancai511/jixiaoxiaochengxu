Page({
  data: {
    TabCur: 1,
    scrollLeft: 0
  },
  tabSelect(e) {
    const { id } = e.currentTarget
    console.log(e.currentTarget)
    this.setData({
      TabCur: id,
      scrollLeft: (id - 1) * 60
    })
  }
})