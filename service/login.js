const { post, get } = require('../utils/request')
const api = require('../api/index')
export function wxLogin(js_code) {
  return post('/wxLogin', { js_code })
}

export function bindPhone(data) {
  return post(api.bindPhone, data)
}

export function getUserInfoByOpenId(openid) {
  return get(`/wx/getUser/${openid}`)
}


export function addOrUpdateUser(data) {
  return post('/wx/addOrUpdateUser', data)
}


