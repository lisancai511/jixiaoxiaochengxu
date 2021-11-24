// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const tenpay = require('tenpay');
const config = {
  appid: 'wx3480a47e52458952',
  mchid: '1600903263',
  partnerKey: 'lisancai123456789123456789123456',
  notify_url: 'https://www.baidu.com',
  spbill_create_ip: '127.0.0.1'
};


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const api = tenpay.init(config)
  const openid = wxContext.OPENID
  let result = await api.getPayParams({
    out_trade_no: Date.now(),
    body: '开通vip',
    total_fee: 1,
    openid
  });
  return { ...result, openid }
}