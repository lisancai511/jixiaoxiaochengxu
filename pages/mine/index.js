// pages/mine/mine.js
const { checkLoginFromLocal, getCurrentUser,getPhoneNumber } = require('../../utils/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheckPhone: false,
    activeType: 1
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
    if(user) {
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
    // TODO 根据id去请求科一科四的数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInit()
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