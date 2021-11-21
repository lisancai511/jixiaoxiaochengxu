// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSubjectOne, getSubjectOneCollection } from '../../utils/cache'
import { RESULT, TOPIC, ERROR_NUMBER, SUCCESS_NUMBER, TOPIC_INDEX, TOTAL, } from '../../utils/constant'
const app = getApp();
let cacheList = [];
let collection = {};
let resultKey = ''
let topicKey = ''
let errorNumberKey = ''
let successNumberKey = ''
let topicIndexKey = ''
let totalKey = ''
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
    kemuType: 'one',
    from: ''
  },
  jumpToItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(topicIndexKey, topicIndex)
  },
  slideItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(topicIndexKey, topicIndex)
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
    const subjectResult = wx.getStorageSync(resultKey) || {}
    let successNumber = wx.getStorageSync(successNumberKey) || 0
    let wrongNumber = wx.getStorageSync(errorNumberKey) || 0
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
    wx.setStorageSync(resultKey, subjectResult)
    wx.setStorageSync(successNumberKey, successNumber)
    wx.setStorageSync(errorNumberKey, wrongNumber)
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
  createStorageKey(key) {
    const { kemuType, from } = this.data
    return `${kemuType}_${from}_${key}`
  },
  async _initAppData() {
    const total = wx.getStorageSync(totalKey)
    const successNumber = wx.getStorageSync(successNumberKey) || 0
    const wrongNumber = wx.getStorageSync(errorNumberKey) || 0
    cacheList = wx.getStorageSync(topicKey) || []
    const index = wx.getStorageSync(topicIndexKey) || 0
    const topicIndex = index < 0 ? 0 : index
    this.setData({
      total,
      topicIndex,
      successNumber,
      wrongNumber
    })
    const ref = this.selectComponent('.topic')
    ref._initTopicData()
  },
  initKey() {
    const { kemuType } = this.data
    totalKey = this.createStorageKey(TOTAL)
    resultKey = this.createStorageKey(RESULT)
    topicKey = `${kemuType}_TOPIC`
    errorNumberKey = this.createStorageKey(ERROR_NUMBER)
    successNumberKey = this.createStorageKey(SUCCESS_NUMBER)
    topicIndexKey = this.createStorageKey(TOPIC_INDEX)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { kemuType, from } = options
    console.log(kemuType, from)
    this.setData({
      kemuType,
      from
    })
    this.initKey()
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