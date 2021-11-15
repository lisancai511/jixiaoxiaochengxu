//app.js
const { getCurrentUser } = require('./utils/common')

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
  onLaunch: async function () {
    console.log('app')
    // 获取系统状态栏信息
    this.getNavInfo()
    await getCurrentUser(true)
  },
  globalData: {
    userInfo: null,
    fiftySubject: [],
    arrOne: []
  }
})