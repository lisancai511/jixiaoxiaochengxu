import { getTopicBasic } from '../../utils/specialOne'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  gotoItem(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/commonExercise/commonExercise?from=one&type=${item.type}`,
    });
  },
  getTopicSpecial(type) {
    const list = getTopicBasic(type)
    this.setData({
      list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopicSpecial(options.from)
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
