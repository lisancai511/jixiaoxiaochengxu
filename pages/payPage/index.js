Page({
  data: {
    kemuType: '',
    from: ''
  },
  getOpenid() {
    const { kemuType, from } = this.data
    wx.cloud.callFunction({
      name: "pay",
      success(res) {
        const { openid, timeStamp, nonceStr, package: pk, signType, paySign } = res.result
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: pk,
          signType,
          paySign,
          success: res => {
            //支付成功
            wx.redirectTo({
              url: `/pages/result/result?kemuType=${kemuType}&from=${from}&openid=${openid}`,
            });
          },
          // fail: err => {
          //   wx.redirectTo({
          //     url: `/pages/result/result?kemuType=${kemuType}&from=${from}&payType=error`,
          //   });
          // }
        })
      },
      fail(res) {
        console.log(res, 744)
      }
    })
  },
  onLoad(options) {
    const { kemuType, from } = options
    this.setData({
      kemuType,
      from
    })
  }
})