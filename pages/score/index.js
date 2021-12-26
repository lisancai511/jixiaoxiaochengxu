// pages/score/index.js
const { getopenid } = require("../../utils/common");
const { setUserStorage } = require("../../utils/storage");
import { addOrUpdateUser } from '../../service/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openType: "getPhoneNumber",
    userName: ''
  },
  gotoCash() {
    wx.navigateTo({
      url: '/pages/takecash/index',
    })
  },
  bindKeyInput(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  async addOrUpdateUser(encryptedData, iv) {
    const { userName } = this.data
    const openId = await getopenid();
    const sessionKey = wx.getStorageSync('session_key')

    const res = await addOrUpdateUser({
      openId,
      sessionKey,
      encryptedData,
      iv,
      userName
    });
    setUserStorage(res.data);
    return res;
  },
  async joinPlan() {
    // 发送请求
    const { openType, userName } = this.data
    const encryptedData = wx.getStorageSync('encryptedData')
    const iv = wx.getStorageSync('iv')
    if (userName.length > 1 && openType == undefined && encryptedData && iv) {
      await this.addOrUpdateUser(encryptedData, iv)
      wx.removeStorageSync('encryptedData')
      wx.removeStorageSync('iv')
      this.setData({
        openType: 'getPhoneNumber'
      })
    } else {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
    }
  },
  getPhoneNumber(e) {
    console.log('e', e)
    const { errMsg, encryptedData, iv } = e.detail
    if (errMsg !== 'getPhoneNumber:ok') {
      wx.showModal({
        title: '温馨提示',
        content: '请务必填写真实姓名，否则无法提取佣金！',
        confirmText: '我知道了',
        showCancel: false
      })
      return
    }
    const { userName } = this.data
    if (userName.length > 1) {
      // 发送请求
      this.addOrUpdateUser(encryptedData, iv)
    } else {
      wx.setStorageSync('encryptedData', encryptedData)
      wx.setStorageSync('iv', iv)
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
      this.setData({
        openType: null
      })
    }
    console.log(this.data.userName)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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