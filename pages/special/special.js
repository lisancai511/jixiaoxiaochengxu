// pages/special/special.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        title: '距离题',
        type: 'distanceOne',
        number: '33',
      },
      {
        title: '罚款题',
        type: 'fineOne',
        number: '9',
      },
      {
        title: '速度题',
        type: 'speedOne',
        number: '57',
      },
      {
        title: '标线题',
        type: 'markingLineOne',
        number: '71',
      },
      {
        title: '手势题',
        type: 'gestureOne',
        number: '13',
      },
      {
        title: '信号灯题',
        type: 'signalLampOne',
        number: '59',
      },
      {
        title: '计分题',
        type: 'deductionOne',
        number: '35',
      },
      {
        title: '灯光题',
        type: 'lightingOne',
        number: '80',
      },
    ],
  },
  gotoItem(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/commonExercise/commonExercise?from=specialOne&type=${item.type}`,
    });
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
