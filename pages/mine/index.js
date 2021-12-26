// pages/mine/mine.js
const { checkLoginFromLocal, getCurrentUser, getPhoneNumber, gotoCollectionPage } = require('../../utils/common')
import { getKeyFromStorage, getErrorIdLists } from '../../utils/util';
import { SUBJECT_ONE_COLLECTION, SUBJECT_FOUR_COLLECTION } from '../../utils/constant';
import { getStudentGrade } from '../../service/common'
import { getUserStorage } from '../../utils/storage'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheckPhone: false,
    activeType: '1',
    averageScore: 0,
    examNum: 0,
    takeNum: 0,
    takeRate: 0,
    scoreInfo: {}
  },
  gotoScore() {
    const user = getUserStorage()
    if (user && user.phone && user.userName) {
      wx.navigateTo({
        url: '/pages/score/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/joinPlan/index'
      })
    }
  },
  calculateNum() {
    const { activeType } = this.data
    const kemuType = activeType === '1' ? 'one' : 'four'
    const successKey = `${kemuType}_ORDER_SUCCESS_NUMBER`
    const errorKey = `${kemuType}_ORDER_ERROR_NUMBER`
    const successNum = wx.getStorageSync(successKey) || 0
    const errorNum = wx.getStorageSync(errorKey) || 0
    const takeNum = successNum + errorNum
    let takeRate = parseInt(successNum / takeNum * 100)
    if (takeNum === 0) {
      takeRate = 0
    }
    this.setData({
      takeNum,
      takeRate
    })
  },
  gotoExam() {
    const { activeType } = this.data
    const kemuType = activeType === '1' ? 'one' : 'four'
    wx.navigateTo({
      url: `/pages/bfeoueExam/index?kemuType=${kemuType}&from=MOCK`,
    });
  },
  async gotoItem(e) {
    try {
      const url = e.target.dataset.url
      const islogin = await checkLoginFromLocal()
      if (islogin) {
        wx.navigateTo({
          url
        })
      }
    } catch (e) {
      console.log('gotoItem fail', e)
    }
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: async (res) => {
        console.log('res', res)
        // TODO: 这里新增一个用户，只有openid
        // saveUser
        try {
          const phoneNumber = await getPhoneNumber()
          this.setData({
            isCheckPhone: !!phoneNumber
          })
        } catch (e) {
          console.log('getUserProfile fail', e)
        }
      },
      fail: () => {
        wx.showToast({
          title: "请允许微信授权！",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  // 通过openid查看手机号是否存在
  async userInit() {
    console.log('userInit')
    const user = await getCurrentUser()
    if (user) {
      this.setData({
        isCheckPhone: !!user.phone
      })
      return false
    }
  },
  inputPhoneNumber() {
    wx.navigateTo({
      url: '/pages/phoneNumber/phoneNumber'
    })
  },
  handleCheck(e) {
    this.setData({
      activeType: e.target.id
    })
    this.calculateNum()
    const { scoreInfo, activeType } = this.data
    const { averageScore, examNum } = this.renderScore(scoreInfo, activeType)
    this.setData({
      examNum,
      averageScore
    })
  },
  goToAbout() {
    wx.navigateTo({
      url: `/pages/about/about`,
    });
  },
  goToCollect() {
    const { activeType } = this.data
    const kemuType = activeType === '1' ? 'one' : 'four'
    gotoCollectionPage(kemuType)
  },
  renderScore(scoreInfo, activeType) {
    const item = scoreInfo[activeType] || {}
    return {
      averageScore: item.score || 0,
      examNum: item.total || 0,
    }
  },
  async getScore() {
    const user = getUserStorage()
    const { activeType } = this.data
    if (user && user.id) {
      const { data = [] } = await getStudentGrade({
        wxUserId: user.id,
      })
      const scoreInfo = {}
      data.forEach(item => {
        let { type, score, total } = item
        score = score.toFixed(2)
        scoreInfo[type] = {
          score,
          total
        }
      })
      const { averageScore, examNum } = this.renderScore(scoreInfo, activeType)
      this.setData({
        scoreInfo,
        examNum,
        averageScore
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInit()
    this.getScore()
    this.calculateNum()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('in')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(arguments)
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