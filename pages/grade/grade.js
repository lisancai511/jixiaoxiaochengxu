import { getGradeList } from '../../service/common'
import { getUserStorage } from '../../utils/storage'
import { formatTime } from '../../utils/util'
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
  getTopScore(list = []) {
    if (list.length) {
      list.sort((a, b) => b.score - a.score)
      return list[0].score
    }
    return null
  },
  async getGradeList() {
    const user = getUserStorage()
    if (user && user.id) {
      const { data = [] } = await getGradeList({
        wxUserId: user.id,
        type: '1'
      })
      let list = data.map(item => {
        const { createdAt, ...other } = item
        return {
          ...other,
          createdAt: formatTime(createdAt)
        }
      })
      const topScore = this.getTopScore(list)
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
    this.getGradeList()
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
