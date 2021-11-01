const { post } = require('../utils/request1')
const api = require('../api/index')
export function wxLogin(js_code) {
  return post('/wxLogin', {js_code})
}

export function bindPhone(data) {
  return post(api.bindPhone, data)
}