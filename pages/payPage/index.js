
const { setUserStorage } = require('../../utils/storage')

Page({
  data: {
    kemuType: '',
    from: ''
  },
  getOpenid() {
    const { kemuType, from } = this.data
    wx.redirectTo({
      url: `/pages/result/result?kemuType=${kemuType}&from=${from}&openid=oEQlf5Aw-x8SDGcazlK_mc6SNQLI`,
    });
    // wx.cloud.callFunction({
    //   name: "pay",
    //   success(res) {
    //     const { openid, timeStamp, nonceStr, package: pk, signType, paySign } = res.result
    //     wx.requestPayment({
    //       timeStamp,
    //       nonceStr,
    //       package: pk,
    //       signType,
    //       paySign,
    //       success: res => {
    //         //支付成功
    //         openVip(openid).then(res => {
    //           const { code, data } = res
    //           if (code === 0) {
    //             setUserStorage(data)
    //             wx.redirectTo({
    //               url: `/pages/test/test?kemuType=${kemuType}&from=${from}&payType=success`,
    //             });
    //           } else {

    //           }
    //         })
    //       },
    //       fail: err => {
    //         wx.redirectTo({
    //           url: `/pages/result/result?kemuType=${kemuType}&from=${from}&payType=error`,
    //         });
    //       }
    //     })
    //   },
    //   fail(res) {
    //     console.log(res, 744)
    //   }
    // })
  },
  onLoad(options) {
    const { kemuType, from } = options
    this.setData({
      kemuType,
      from
    })
  }
})