const {
  OPEN_ID,
  CURRENT_USER,
  SUBJECT_ONE_MOCK,
  SUBJECT_ONE_MOCK_RESULT,
  SUBJECT_ONE_MOCK_TOPIC_INDEX,
  SUBJECT_ONE_MOCK_TIME,
  SUBJECT_ONE_MOCK_SUCCESS_NUMBER,
  SUBJECT_ONE_MOCK_ERROR_NUMBER } = require('./constant')

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

export function resetMockOne() {
  wx.removeStorageSync(SUBJECT_ONE_MOCK)
  wx.removeStorageSync(SUBJECT_ONE_MOCK_RESULT)
  wx.removeStorageSync(SUBJECT_ONE_MOCK_TOPIC_INDEX)
  wx.removeStorageSync(SUBJECT_ONE_MOCK_TIME)
  wx.removeStorageSync(SUBJECT_ONE_MOCK_SUCCESS_NUMBER)
  wx.removeStorageSync(SUBJECT_ONE_MOCK_ERROR_NUMBER)
}
