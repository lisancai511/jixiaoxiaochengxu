const {
  OPEN_ID,
  CURRENT_USER,
  TOPIC, TOTAL, RESULT, ERROR_NUMBER, SUCCESS_NUMBER, TOPIC_INDEX, TIME } = require('./constant')

export function setUserStorage(user) {
  if (typeof user === 'object') {
    wx.setStorageSync(CURRENT_USER, user)
  }
}

export function getUserStorage() {
  const user = wx.getStorageSync(CURRENT_USER)
  return user || null
}

export function getOpenIdStorage() {
  const openid = wx.getStorageSync(OPEN_ID)
  return openid || null
}

function getKey(kemuType, from) {
  const prefix = `${kemuType}_${from}_`
  return function (key) {
    return `${prefix}${key}`
  }
}


export function resetMockOne(kemuType, from) {
  const createStorageKey = getKey(kemuType, from)
  const totalKey = createStorageKey(TOTAL)
  const resultKey = createStorageKey(RESULT)
  const errorNumberKey = createStorageKey(ERROR_NUMBER)
  const successNumberKey = createStorageKey(SUCCESS_NUMBER)
  const topicIndexKey = createStorageKey(TOPIC_INDEX)
  const timeKey = createStorageKey(TIME)
  wx.removeStorageSync(totalKey)
  wx.removeStorageSync(resultKey)
  wx.removeStorageSync(topicIndexKey)
  wx.removeStorageSync(timeKey)
  wx.removeStorageSync(successNumberKey)
  wx.removeStorageSync(errorNumberKey)
}
