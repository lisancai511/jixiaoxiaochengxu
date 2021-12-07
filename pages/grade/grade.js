import { getGradeListByKemuType } from '../../utils/common'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    topScore: '',
    TabCur: '1'
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.target.id
    })
  },
  onSlideChangeEnd(e) {
    this.setData({
      TabCur: e.detail.currentItemId
    })
  },
  async getGradeList(kemuType) {
    const { list = [], topScoreItem = {} } = await getGradeListByKemuType(kemuType) || {}
    if (topScoreItem) {
      const topScore = topScoreItem.score
      this.setData({
        list,
        topScore
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const { kemuType } = options
    this.getGradeList(kemuType)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
});
