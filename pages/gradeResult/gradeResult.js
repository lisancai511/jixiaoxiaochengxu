import { SUBJECT_ONE_MOCK, SUBJECT_ONE_MOCK_TIME, SUBJECT_ONE_MOCK_RESULT, SUBJECT_ONE_MOCK_TOPIC_INDEX, SUBJECT_ONE_MOCK_ERROR_NUMBER, SUBJECT_ONE_MOCK_SUCCESS_NUMBER } from '../../utils/constant'
import { resetMockOne } from '../../utils/storage'
import { goToErrorPage } from '../../utils/common'

const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    score: 0
  },
  getScore() {
    const score = wx.getStorageSync(SUBJECT_ONE_MOCK_SUCCESS_NUMBER)
    this.setData({
      score
    })
  },
  goToGrade() {
    wx.redirectTo({
      url: '/pages/grade/grade',
    })
  },
  goToError() {
    goToErrorPage('1')
  },
  goToTake() {
    wx.redirectTo({
      url: '/pages/mockOne/mockOne'
    })
  },
  onLoad: function () {
    this.getScore()
  },
  onUnload: function () {
    resetMockOne()
  },
});
