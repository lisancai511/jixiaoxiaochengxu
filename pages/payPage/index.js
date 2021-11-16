// pages/payPage/index.js
Page({
  getOpenid() {
    wx.cloud.callFunction({
      name: "pay",
      success(res) {
        console.log(res, 77)
        wx.requestPayment({
          timeStamp: res.result.timeStamp,
          nonceStr: res.result.nonceStr,
          package: res.result.package,
          signType: res.result.signType,
          paySign: res.result.paySign,
          success: res => {
            //支付成功
          }
        })
      },
      fail(res) {
        console.log(res, 744)
      }
    })
  },
})