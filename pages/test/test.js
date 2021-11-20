// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSubjectOne, getSubjectOneCollection } from '../../utils/cache'
import { SUBJECT_ONE_RESULT, SUBJECT_ONE_TOPIC_INDEX, SUBJECT_ONE_ERROR_NUMBER, SUBJECT_ONE_SUCCESS_NUMBER } from '../../utils/constant'
const app = getApp();
let cacheList = [];
let collection = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    // 当前屏幕对应的题目索引
    topicIndex: 0,
    total: 0,
    successNumber: 0,
    wrongNumber: 0,
  },
  jumpToItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(SUBJECT_ONE_TOPIC_INDEX, topicIndex)
  },
  slideItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(SUBJECT_ONE_TOPIC_INDEX, topicIndex)
  },
  toggleCollect(e) {
    const key = e.detail
    collection = getSubjectOneCollection()
    if (collection[key]) {
      collection[key] = null;
      collection = cancelCollection(key);
    } else {
      collection[key] = true;
      collection = saveCollection(key);
    }
  },
  _getTopicId(topicIndex) {
    const id = cacheList[topicIndex] && cacheList[topicIndex].id
    return id || null
  },
  _getTopicRecord(topicIndex, res) {
    const key = this._getTopicId(topicIndex)
    console.log(key)
    const subjectResult = wx.getStorageSync(SUBJECT_ONE_RESULT) || {}
    let successNumber = wx.getStorageSync(SUBJECT_ONE_SUCCESS_NUMBER) || 0
    let wrongNumber = wx.getStorageSync(SUBJECT_ONE_ERROR_NUMBER) || 0
    if (subjectResult[key]) {
      if (subjectResult[key] === true) {
        // 之前都是作对的题目
        if (res !== true) {
          successNumber--
          wrongNumber++
        }
      } else {
        // 之前做错了
        if (res === true) {
          successNumber++
          wrongNumber--
        }
      }
    } else {
      if (res === true) {
        successNumber++
      } else {
        wrongNumber++
      }
    }
    subjectResult[key] = res
    wx.setStorageSync(SUBJECT_ONE_RESULT, subjectResult)
    wx.setStorageSync(SUBJECT_ONE_SUCCESS_NUMBER, successNumber)
    wx.setStorageSync(SUBJECT_ONE_ERROR_NUMBER, wrongNumber)
    return { successNumber, wrongNumber }
  },
  checkOptionItem(e) {
    const { topicIndex, res } = e.detail
    console.log(topicIndex, res)
    const { successNumber, wrongNumber } = this._getTopicRecord(topicIndex, res)
    this.setData({
      wrongNumber,
      successNumber
    })
  },
  async _initAppData() {
    const { list, total } = await getSubjectOne()
    cacheList = list
    const index = wx.getStorageSync(SUBJECT_ONE_TOPIC_INDEX) || 0
    const topicIndex = index < 0 ? 0 : index
    this.setData({
      total,
      topicIndex
    })
    const ref = this.selectComponent('.topic')
    ref._initTopicData()
  },
  _initErrorAndSuccess() {
    const successNumber = wx.getStorageSync('SUBJECT_ONE_SUCCESS_NUMBER') || 0
    const wrongNumber = wx.getStorageSync('SUBJECT_ONE_ERROR_NUMBER') || 0
    this.setData({
      successNumber,
      wrongNumber
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const total = wx.getStorageSync('SUBJECT_ONE_TOTAL')
    this._initErrorAndSuccess()
    this.setData({
      total
    })
    this._initAppData();

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
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

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