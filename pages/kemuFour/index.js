// pages/kemuOne/index.js
import { getKeyFromStorage, getErrorIdLists } from '../../utils/util';

import { getServerTopicList } from '../../service/subjectone'
import { getTopicListByKemuType } from '../../utils/cache'
import { getUserStorage } from '../../utils/storage'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showVip: false
  },
  _gotoCollection(from) {
    const key = 'four_COLLECTION'
    const collection = getKeyFromStorage(key) || {};
    const ids = Object.keys(collection);
    if (ids.length) {
      this.navigateFrom(from)
      return true
    }
    wx.showToast({
      icon: 'none',
      title: '暂无收藏',
      duration: 1000,
    });
    return false
  },
  _gotoVip(from) {
    const user = getUserStorage()
    if (user && user.isVip) {
      wx.navigateTo({
        url: `/pages/vipDetail/index?kemuType=four&from=${from}`,
      });
      return
    }
    wx.navigateTo({
      url: `/pages/payPage/index?kemuType=four&from=${from}`,
    });
  },
  _gotoError(from) {
    const key = 'four_ERROR'
    const errNums = wx.getStorageSync(key) || {}
    const len = Object.keys(errNums).length
    if (len > 0) {
      this.navigateFrom(from)
      return false
    }
    wx.showToast({
      icon: 'none',
      title: '暂无错题',
      duration: 1000,
    });
  },
  _gotoMockExam(from) {
    wx.navigateTo({
      url: `/pages/bfeoueExam/index?kemuType=four&from=${from}`,
    });
  },
  _gotoSpecial(from) {
    wx.navigateTo({
      url: `/pages/special/special?kemuType=four&from=${from}`,
    });
  },
  gotoGrade() {
    wx.navigateTo({
      url: `/pages/grade/grade?kemuType=four`
    })
  },
  navigateFrom(from) {
    wx.navigateTo({
      url: `/pages/test/test?kemuType=four&from=${from}`,
    });
  },
  gotoSubject: function (type) {
    const from = type.currentTarget.id
    console.log(type.currentTarget.id)
    switch (from) {
      case 'MOCK':
        this._gotoMockExam(from);
        break;
      case 'special':
        this._gotoSpecial(from);
        break;
      case 'VIP':
        this._gotoVip(from);
        break;
      case 'grade':
        this.gotoGrade();
        break;
      case 'ERROR':
        this._gotoError(from)
        break
      case 'COLLECTION':
        this._gotoCollection(from)
        break
      default:
        this.navigateFrom(from)
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('four')
    const showVip = wx.getStorageSync('showVip')
    this.setData({
      showVip
    })
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
