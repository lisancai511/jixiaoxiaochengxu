// pages/exercise/exercise.js
import ClassicModel from '../../model/classic.js'
import { saveUserAnswer, getUserAnswer } from '../../utils/util.js'
const classicModel = new ClassicModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    exerciseList: [],
    currentItemId: null,
    collection: {},  //收藏
    currentPage: 1,
    isShowResult: false
  },
  getDotClassName(item) {
    const {ta, id} = item
    let answerObj = getUserAnswer()
    if (answerObj[id] === ta) {
      return 'success'
    } else {
      return 'error'
    }
  },
  clickItem(e) {
    const { item, index, optidx} = e.currentTarget.dataset
    const { own_res } = this.data.exerciseList[index]
    if (!own_res) {
      this.data.exerciseList[index].own_res = optidx + 1 + ''
      saveUserAnswer(item.id, optidx + 1 + '')
      console.log(index)
      let { options } = this.data.exerciseList[index]
      console.log(options)
      this.data.exerciseList[index].options[optidx].className = 'error'
      console.log('---', item.ta - 1)
      console.log('---options', options)
      this.data.exerciseList[index].options[item.ta - 1].className = 'success'
      console.log('this.data.exerciseList', this.data.exerciseList)
      this.setData({
        exerciseList: this.data.exerciseList
      })
    }
    
  },
  changeRecite() {
    this.setData({
      isShowResult: !this.data.isShowResult
    })
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
 * 底部模态框
 */

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
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