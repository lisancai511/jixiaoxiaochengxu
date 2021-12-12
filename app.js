//app.js
const { getTopicListByKemuType, checkTopicOne } = require('./utils/cache')
const { setStorageSpecial, kemuType } = require('./utils/specialOne')
const { getOneTotal, getFourTotal } = require('./service/common')

App({
  getNavInfo() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },

  /**
   * 初始化科目一和科目四的本地存储
   */
  initSpecialStorage() {
    const suffix = 'SPECIAL'
    for (let key in kemuType) {
      const storageKey = `${kemuType[key]}_${suffix}`
      const value = wx.getStorageSync(storageKey)
      if (!value) {
        setStorageSpecial(key)
      }
    }
  },

  async getTotal() {
    console.log('i n')
    const res = await getOneTotal()
    console.log('res--', res)
  },

  onLaunch: function () {
    // 获取系统状态栏信息
    // checkTopicOne()
    // this.getTotal()
    getTopicListByKemuType('one')
    getTopicListByKemuType('four')
    this.initSpecialStorage()
    this.getNavInfo()
    // await getCurrentUser(true)
    // 云开发环境初始化
    // wx.cloud.init({
    //   env: "cloud1-7gi5jb4120c33dbf"
    // })

  },
  globalData: {
    userInfo: null,
    fiftySubject: [],
    arrOne: [],
    showVip: false,
  }
})