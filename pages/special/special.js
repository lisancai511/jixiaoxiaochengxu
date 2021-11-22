import { getTopicBasic } from '../../utils/specialOne'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    kemuType: '',
    from: ''
  },
  gotoItem(e) {
    const item = e.currentTarget.dataset.item;
    const { kemuType } = this.data
    wx.navigateTo({
      url: `/pages/commonExercise/commonExercise?kemuType=${kemuType}&type=${item.type}`,
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
    console.log(options)
    const { kemuType, from } = options
    this.setData({
      kemuType,
      from
    })
    this.getTopicSpecial(kemuType)
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
