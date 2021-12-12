const { pay } = require("../../service/login");
const { getCurrentUser, getopenid } = require("../../utils/common");
const md5 = require('../../utils/md5')
Page({
  data: {
    kemuType: "",
    from: "",
  },
  async getOpenid() {
    const { kemuType, from } = this.data;
    const openId = await getopenid();
    const params = {
      openid: openId,
      type: kemuType,
      time: new Date().getTime()
    }
    const key = `CHDtype=${params.type}PCDopenid=${params.openid}dkhtime=${params.time}`
    params.sign = md5(key)
    let res = await pay(params);
    const { openid, timeStamp, nonceStr, package: pk, signType, paySign } = res;
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: pk,
      signType,
      paySign,
      success: (res) => {
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
    });
    // wx.cloud.callFunction({
    //   name: "pay",
    //   success(res) {
    //     const {
    //       openid,
    //       timeStamp,
    //       nonceStr,
    //       package: pk,
    //       signType,
    //       paySign,
    //     } = res.result;
    //     wx.requestPayment({
    //       timeStamp,
    //       nonceStr,
    //       package: pk,
    //       signType,
    //       paySign,
    //       success: (res) => {
    //         //支付成功
    //         wx.redirectTo({
    //           url: `/pages/result/result?kemuType=${kemuType}&from=${from}&openid=${openid}`,
    //         });
    //       },
    //       // fail: err => {
    //       //   wx.redirectTo({
    //       //     url: `/pages/result/result?kemuType=${kemuType}&from=${from}&payType=error`,
    //       //   });
    //       // }
    //     });
    //   },
    //   fail(res) {
    //     console.log(res, 744);
    //   },
    // });
  },
  onLoad(options) {
    const { kemuType, from } = options;
    this.setData({
      kemuType,
      from,
    });
  },
});
