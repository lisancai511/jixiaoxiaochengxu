//index.js
//获取应用实例
const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    
  },
  
  methods: {
    share: function () {
      wx.showShareMenu()
    }
  }
})