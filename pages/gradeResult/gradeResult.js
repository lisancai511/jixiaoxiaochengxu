import { SUBJECT_ONE_MOCK, SUBJECT_ONE_MOCK_TIME, SUBJECT_ONE_MOCK_RESULT, SUBJECT_ONE_MOCK_TOPIC_INDEX, SUBJECT_ONE_MOCK_ERROR_NUMBER, SUBJECT_ONE_MOCK_SUCCESS_NUMBER } from '../../utils/constant'
import { resetMockOne } from '../../utils/storage'
import { goToErrorPage } from '../../utils/common'

const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    score: 0,
    kemuType: '',
    from: ''
  },
  getScore() {
    const { kemuType, from } = this.data
    const key = `${kemuType}_${from}_SUCCESS_NUMBER`
    const score = wx.getStorageSync(key) || 0
    this.setData({
      score
    })
  },
  goToGrade() {
    const { kemuType, from } = this.data
    wx.redirectTo({
      url: `/pages/grade/grade?kemuType=${kemuType}`,
    })
    resetMockOne(kemuType, from)
  },
  goToError() {
    const { kemuTypem, from } = this.data
    resetMockOne(kemuType, from)
    goToErrorPage(kemuType)
  },
  goToTake() {
    const { kemuType, from } = this.data
    resetMockOne(kemuType, from)
    wx.redirectTo({
      url: `/pages/bfeoueExam/index?kemuType=${kemuType}&from=${from}`,
    });
  },

  onLoad: function (options) {
    const { kemuType, from } = options
    this.setData({
      kemuType,
      from
    })
    this.getScore()
  },
  onUnload: function () {
    console.log('in onload')
    const { kemuType, from } = this.data
    resetMockOne(kemuType, from)
  },
});
