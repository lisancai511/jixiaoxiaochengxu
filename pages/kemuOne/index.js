// pages/kemuOne/index.js
import { getKeyFromStorage, getErrorIdLists } from '../../utils/util';
import { SUBJECT_ONE_COLLECTION, SUBJECT_ONE_ERROR_NUMBER } from '../../utils/constant';
import ClassicModel from '../../model/classic.js';
const classicModel = new ClassicModel();
import { getSubjectOneList } from '../../service/subjectone'
import { getSubjectOne } from '../../utils/cache'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  async _getClassicList() {
    wx.showLoading({
      title: '数据加载中...',
    })
    const { list, total } = await getSubjectOne({ limit: 100000 })
    app.globalData.arrOne = list;
    app.globalData.total = total;
    wx.hideLoading()

  },
  _gotoCollection() {
    const collection = getKeyFromStorage(SUBJECT_ONE_COLLECTION) || {};
    const ids = Object.keys(collection);
    if (ids.length) {
      wx.navigateTo({
        url: `/pages/collection/collection?type=collectionOne`,
      });
    } else {
      wx.showToast({
        icon: 'none',
        title: '暂无收藏',
        duration: 1000,
      });
    }
  },
  _gotoVip() {
    wx.navigateTo({
      url: `/pages/payPage/index?type=vipOne`,
    });
  },
  _gotoError() {
    const errNums = wx.getStorageSync(SUBJECT_ONE_ERROR_NUMBER)
    console.log(errNums)
    if (errNums > 0) {
      wx.navigateTo({
        url: `/pages/error/error?type=errorOne`,
      });
      return false
    }
    wx.showToast({
      icon: 'none',
      title: '暂无错题',
      duration: 1000,
    });
  },
  _gotoMockExam() {
    wx.navigateTo({
      url: `/pages/mockOne/mockOne?type=mockOne`,
    });
  },
  _gotoSpecial() {
    wx.navigateTo({
      url: `/pages/special/special?type=specialOne`,
    });
  },
  gotoSubject: function (type) {
    switch (type.currentTarget.id) {
      case 'mockExam':
        this._gotoMockExam();
        break;
      case 'wrongSubject':
        this._gotoError();
        break;

      case 'special':
        this._gotoSpecial();
        break;
      case 'collection':
        this._gotoCollection();
        break;
      case 'vip':
        this._gotoVip();
        break;
      default:
        this._getClassicList().then(() => {
          wx.navigateTo({
            url: `/pages/exercise/exercise?type=${type.currentTarget.id}`,
          });
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
