//app.js
const { getCurrentUser, getopenid } = require('./utils/common')
const { addOrUpdateUser } = require('./service/login')
const { setUserStorage } = require('./utils/storage')
const { setStorageSpecial, kemuType } = require('./utils/specialOne')

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
  async addOrUpdateUser() {
    const openId = await getopenid()
    const res = await addOrUpdateUser({
      openId
    })
    setUserStorage(res.data)
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
  function() {

  },
  onLaunch: async function () {
    // 获取系统状态栏信息
    this.initSpecialStorage()
    this.getNavInfo()
    this.addOrUpdateUser()
    // await getCurrentUser(true)
    // 云开发环境初始化
    wx.cloud.init({
      env: "cloud1-7gi5jb4120c33dbf"
    })

  },
  globalData: {
    userInfo: null,
    fiftySubject: [],
    arrOne: []
  }
})