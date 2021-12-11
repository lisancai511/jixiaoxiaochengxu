// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSubjectOneCollection } from '../../utils/cache'
import { topicOne, getKeyFromType, getTopicListByType } from '../../utils/specialOne'
const { SPECIAL } = require('../../utils/constant')
const app = getApp();
let cacheList = [];
let collection = {};
const kemuMap = {
  one: topicOne
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    topicIndex: 0,
    total: 0,
    successNumber: 0,
    wrongNumber: 0,
    kemuType: '',
    specialType: ''
  },
  getStorageKey() {
    const { kemuType } = this.data
    const key = getKeyFromType(kemuType, SPECIAL)
    return key
  },
  setSpecialStorage(field, value) {
    const { specialType } = this.data
    const special = this.getStorageSpecial()
    special[specialType][field] = value
    const key = this.getStorageKey()
    wx.setStorageSync(key, special)
  },
  jumpToItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    this.setSpecialStorage('topicIndex', topicIndex)
  },
  slideItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    this.setSpecialStorage('topicIndex', topicIndex)
  },
  toggleCollect(e) {
    const key = e.detail
    const { kemuType } = this.data
    collection = getSubjectOneCollection(kemuType)
    if (collection[key]) {
      collection[key] = null;
      collection = cancelCollection(kemuType, key);
    } else {
      collection[key] = true;
      collection = saveCollection(kemuType, key);
    }
  },
  _getTopicRecord(topicId, res) {
    const { specialType } = this.data
    const special = this.getStorageSpecial()
    let { result = {}, successNumber = 0, wrongNumber = 0, } = special[specialType]
    if (result[topicId]) {
      if (result[topicId] === true) {
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
    result[topicId] = res
    special[specialType] = {
      ...special[specialType],
      result,
      successNumber,
      wrongNumber
    }
    const storageKey = this.getStorageKey()
    wx.setStorageSync(storageKey, special)
    return { successNumber, wrongNumber }
  },
  checkOptionItem(e) {
    const { topicId, res } = e.detail
    const { successNumber, wrongNumber } = this._getTopicRecord(topicId, res)
    this.setData({
      wrongNumber,
      successNumber
    })
  },
  getStorageSpecial() {
    const key = this.getStorageKey()
    return wx.getStorageSync(key) || {}
  },

  _initBasic(kemuType, type) {
    const special = this.getStorageSpecial()
    console.log('special', special)
    let { total = 0, successNumber = 0, wrongNumber = 0, topicIndex = 0 } = special[type]
    console.log(special[type])
    topicIndex = topicIndex < 0 ? 0 : topicIndex
    cacheList = getTopicListByType(kemuType, type)
    if (total !== cacheList.length) {
      total = cacheList.length
    }
    this.setData({
      total,
      successNumber,
      wrongNumber,
      topicIndex
    })
    const ref = this.selectComponent('.topic')
    ref._initTopicData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { kemuType, type } = options
    console.log('special', options)
    this.setData({
      kemuType,
      specialType: type
    })
    this._initBasic(kemuType, type)
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