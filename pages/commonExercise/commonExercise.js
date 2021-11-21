// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSubjectOne, getSubjectOneCollection } from '../../utils/cache'
import { topicOne, getKeyFromType, getTopicListByType } from '../../utils/specialOne'
const { SPECIAL } = require('../../utils/basic')
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
    const { specialType } = this.data
    const key = this._getTopicId(topicIndex)
    const special = this.getStorageSpecial()
    let { result = {}, successNumber = 0, wrongNumber = 0, } = special[specialType]
    if (result[key]) {
      if (result[key] === true) {
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
    result[key] = res
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
    const { topicIndex, res } = e.detail
    console.log(topicIndex, res)
    const { successNumber, wrongNumber } = this._getTopicRecord(topicIndex, res)
    this.setData({
      wrongNumber,
      successNumber
    })
  },
  getStorageSpecial() {
    const key = this.getStorageKey()
    console.log('key', key)
    setTimeout(() => {

      console.log(wx.getStorageSync('ONE_SPECIAL'))
    }, 500)
    return wx.getStorageSync(key) || {}
  },

  _initBasic(from, type) {
    const special = this.getStorageSpecial()
    console.log('special', special)
    let { total = 0, successNumber = 0, wrongNumber = 0, topicIndex = 0 } = special[type]
    console.log(special[type])
    topicIndex = topicIndex < 0 ? 0 : topicIndex
    cacheList = getTopicListByType(from, type)
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
    // this._initAppData();
    const { from, type } = options
    this.setData({
      kemuType: from,
      specialType: type
    })
    this._initBasic(from, type)
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