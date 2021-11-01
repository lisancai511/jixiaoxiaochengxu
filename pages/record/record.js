// pages/record/record.js
import {SUBJECT_ONE_MOCK, SUBJECT_ONE_MOCK_RESULT,  SUBJECT_ONE_MOCK_TOPIC_INDEX} from '../../utils/constant'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: 0
  },
  _getRecord() {
    let record = 0
    const result = wx.getStorageSync(SUBJECT_ONE_MOCK_RESULT)
    if(result) {
      for(let key in result) {
        if(result[key] === true) {
          record++
        }
      }
    }
    this.setData({
      record
    })
  },
  _resetMock() {
    wx.removeStorageSync(SUBJECT_ONE_MOCK)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_RESULT)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_TOPIC_INDEX)
  },
  takeAgain() {
    wx.redirectTo({
      url: '/pages/mockOne/mockOne'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getRecord()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this._resetMock()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})