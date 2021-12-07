import { getGradeList } from '../../service/common'
import { getUserStorage } from '../../utils/storage'
import { getGradeListByKemuType } from '../../utils/common'
import { formatTime } from '../../utils/util'
import { getMockSubjectOne } from '../../service/subjectone'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    topScore: '',
    topUseTime: '',
    TabCur: '1',
    kemuType: 'one',
    from: ''
  },
  createStorageKey(key) {
    const { kemuType, from } = this.data
    return `${kemuType}_${from}_${key}`
  },
  getTopicList() {
    const resultKey = this.createStorageKey('RESULT')
    const cache = wx.getStorageSync(resultKey) || null
    if (!cache) {
      this.getMockSubjectOne(false)
    } else {
      this.getMockSubjectOne()
    }
  },
  async getMockSubjectOne(useCache = true) {
    const { kemuType, from } = this.data
    const topicKey = this.createStorageKey('TOPIC')
    const cache = wx.getStorageSync(topicKey)
    if (cache && useCache) {
      return cache
    }
    let { list: data } = await getMockSubjectOne(kemuType)
    wx.setStorageSync(topicKey, data)
    return data
  },
  gotoMock() {
    const { kemuType } = this.data
    wx.redirectTo({
      url: `/pages/mockOne/mockOne?kemuType=${kemuType}&from=MOCK`,
    });
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
    const { topScoreItem } = await getGradeListByKemuType(kemuType) || {}
    if (topScoreItem != undefined) {
      console.log(topScoreItem)
      const topScore = topScoreItem.score
      const topUseTime = topScoreItem.useTime
      this.setData({
        topUseTime,
        topScore
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const { kemuType, from } = options
    this.setData({
      kemuType,
      from
    })
    this.getTopicList()
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
