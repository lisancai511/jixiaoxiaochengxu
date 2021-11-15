const { wxLogin, getUserInfoByOpenId } = require('../service/login')
const { post } = require('../utils/request1')
/**
 * 判断是session是否有效
 * @returns {Promise} string openid
 */
export function checkLoginFromWechat() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        // 如果有效，但是本地没有openid，则视为失败
        const openid = wx.getStorageSync('openid')
        if (openid) {
          resolve(openid)
        } else {
          reject()
        }
      },
      fail(err) {
        reject()
      }
    })
  })
}

/**
 * 微信登录，获取openid和session_key
 * @returns {Promise} 
 */
export function wechatLogin() {
  return new Promise((resolve, reject) => {
    checkLoginFromWechat().then((openid) => {
      resolve(openid)
    }).catch(() => {
      wx.login({
        success({ code }) {
          wxLogin(code).then(res => {
            const { openid, session_key } = res
            wx.setStorageSync('openid', openid)
            wx.setStorageSync('session_key', session_key)
            resolve(openid)
          }).catch(() => {
            reject()
          })
        },
        fail() {
          reject()
        }
      })
    })
  })
}
export async function getopenid() {
  try {
    let openid = wx.getStorageSync('openid')
    if (openid) {
      return openid
    }
    openid = await wechatLogin()
    return openid
  } catch (e) {
    console.log('getopenid fail', e)
    throw new Error(e)
  }
}



// 通过openid获取用户信息，如果有返回，如果没有返回null
export async function getUserFromopenid() {
  try {
    // 获取openid
    const openid = await getopenid()
    // 通过openid获取用户信息
    if (openid) {
      const res = await getUserInfoByOpenId(openid)
      if (res.data) {
        // 如果有存储本地信息
        wx.setStorageSync('currentUser', res.data)
      }
      return res.data || null
    }
    return null
  } catch (e) {
    console.log('getUserFromopenid fail', e)
    throw new Error(e)
  }
}

export async function getCurrentUser(refresh = false) {
  try {
    let user = ''
    if (!refresh) {
      user = wx.getStorageSync('currentUser')
      if (user) {
        return user
      }
    }
    user = await getUserFromopenid()
    return user
  } catch (e) {
    console.log('getCurrentUser fail', e)
    throw new Error(e)
  }
}