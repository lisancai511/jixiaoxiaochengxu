const { isIos, getopenid } = require('../../utils/common')
const { addOrUpdateUser } = require('../../service/login')
const { getIsShowVip } = require('../../service/common')
const { setUserStorage } = require('../../utils/storage')
Component({
  // properties: {
  //   tabIndex: {
  //     type: String,
  //     value: '1',
  //   }
  // },
  data: {
    TabCur: '1',
    showVip: false
  },
  methods: {
    tabSelect(e) {
      console.log(1111)
      this.setData({
        TabCur: e.target.id
      })
    },
    onSlideChangeEnd(e) {
      this.setData({
        TabCur: e.detail.currentItemId
      })
      this.renderKemu()
    },
  },

  renderKemu() {
    const idMap = {
      1: '#kemuOne',
      4: '#kemuFour'
    }
    let myComponent = this.selectComponent(idMap[this.data.TabCur]); // 页面获取自定义组件实例
    myComponent.onLoad && myComponent.onLoad()
  },
  async addOrUpdateUser() {
    const openId = await getopenid()
    const res = await addOrUpdateUser({
      openId
    })
    setUserStorage(res.data)
    return res
  },
  async initIcon() {
    let showVip = false
    if (isIos()) {
      const res = await getIsShowVip()
      if (res && res.showVip) {
        showVip = true
      }
      const user = await this.addOrUpdateUser()
      if (user && user.data && user.data.isVip) {
        showVip = true
      }
    } else {
      showVip = true
      this.addOrUpdateUser()
    }
    console.log(1)
    wx.setStorageSync('showVip', showVip)
  },
  // async onLoad() {
  //   await this.initIcon()
  //   this.renderKemu()
  // }
})