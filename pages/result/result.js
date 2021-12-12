// pages/result/result.js
const { openVip } = require('../../service/common')
const { setUserStorage } = require('../../utils/storage')
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    payType: 'waiting',
    kemuType: '',
    from: '',
    desc: 'VIP开通结果查询中, 请耐心等待1-3秒',
    title: '等待中...',
    hasRes: false
  },
  takeVip(openid) {
    const { kemuType } = this.data
    const params = {
      openid,
      type: kemuType,
      time: new Date().getTime()
    }
    const key = `CHDtype=${params.type}PCDopenid=${params.openid}dkhtime=${params.time}`
    params.sign = md5(key)
    openVip(params).then(res => {
      const { code, data } = res
      if (code === 0) {
        setUserStorage(data)
        this.setData({
          hasRes: true,
          payType: 'success',
          title: '开通成功',
          desc: '您已成功开通Vip会员，快去答题练习吧！'
        })

      } else {
        this.setData({
          hasRes: false,
          payType: 'warn',
          title: '开通失败',
          desc: '开通Vip会员失败，请联系管理员！'
        })
      }
    }).catch(err => {
      this.setData({
        hasRes: false,
        payType: 'warn',
        title: '支付失败',
        desc: '开通Vip会员失败，请联系管理员！'
      })
    })
  },
  gotoVip() {
    const { kemuType, from } = this.data
    wx.redirectTo({
      url: `/pages/vipDetail/index?kemuType=${kemuType}&from=${from}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { openid, kemuType, from } = options
    this.takeVip(openid)
    this.setData({
      kemuType,
      from
    })
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