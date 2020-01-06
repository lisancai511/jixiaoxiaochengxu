// pages/subject/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 123)
    switch (options.type) {
      case 'order':
        this.setData({
          from: '从顺序练习来的'
        })
        break;
      case 'wrongSubject':
        this.setData({
          from: '从我的错题来的'
        })
        break;
      case 'vip':
        this.setData({
          from: '从vip课程来的'
        })
        break;
      case 'special':
        this.setData({
          from: '从专项练习来的'
        })
        break;
      case 'mockExam':
        this.setData({
          from: '从模拟考试来的'
        })
        break;
      case 'collection':
        this.setData({
          from: '从我的收藏来的'
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  goBack: function() {
    wx.navigateBack()
  }
})