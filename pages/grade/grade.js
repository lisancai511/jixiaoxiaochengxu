// pages/special/special.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        score: '92',
        useTime: '04:55',
        createAt: '2021.11.18 14:56'
      },
      {
        score: '86',
        useTime: '04:55',
        createAt: '2021.11.18 14:56'
      },
      {
        score: '99',
        useTime: '04:55',
        createAt: '2021.11.18 14:56'
      },
      {
        score: '100',
        useTime: '04:55',
        createAt: '2021.11.18 14:56'
      }
    ],
    TabCur: '1'
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.target.id
    })
  },
  onSlideChangeEnd(e) {
    this.setData({
      TabCur: e.detail.currentItemId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
});
