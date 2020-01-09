// pages/exercise/exercise.js
import ClassicModel from '../../model/classic.js'
const classicModel = new ClassicModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    exerciseList: [],
    currentItemId: null,
    collection: {},  //收藏
    currentPage: 1
  },
  clickItem(e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.type)
    this.setData({
      exerciseList: app.globalData.arrOne,
      currentItemId: app.globalData.arrOne[0].id
    })
  },

  onSlideChangeEnd(e) {
    console.log(e)
    this.data.currentItemId = e.detail.currentItemId
    this.setData({
      currentItemId: e.detail.currentItemId
    })
  },

  collectionItem(e) {
    if(!this.data.collection[this.data.currentItemId]) {
      this.data.collection[this.data.currentItemId] = this.data.currentItemId
    } else {
      delete this.data.collection[this.data.currentItemId]
    }
    this.setData({
      collection: this.data.collection
    })
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

  }
})