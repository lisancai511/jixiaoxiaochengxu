const { getSubjectOneList } = require('../service/subjectone')
const { getSubjectFourList } = require('../service/subjectfour')
const constant = require('../utils/constant')
// 渲染已经做过的题目
function getTopicClassName(list, result) {
  return list.map(item => {
    const { id, options, ta } = item
    if (result[id] != undefined) {
      item.className = 'success'
      item.own_res = result[id] - 0 + 1 + ''
      item.options[ta - 1].className = 'success'
      if (result[id] !== true) {
        item.options[result[id]].className = 'error'
        item.className = 'error'
      }
    }
    return item
  })
}
// 获取科目一的数据，拿到之后存入storage中，取得时候先从storage中取，没有则重新调取接口
export async function getSubjectOne(data) {
  try {
    let list = wx.getStorageSync('one_TOPIC')
    let result = wx.getStorageSync('one_ORDER_RESULT')
    let total = wx.getStorageSync('one_ORDER_TOTAL')
    if (list) {
      list = getTopicClassName(list, result)
      console.log("ll--", list)
      return {
        list,
        total
      }
    }
    const res = await getSubjectOneList(data)
    list = getTopicClassName(res.list, result)
    total = res.total || 0
    wx.setStorageSync('one_TOPIC', list)
    wx.setStorageSync('one_ORDER_TOTAL', total)
    return res
  } catch (e) {
    console.log('getSubjectOne fail', e)
    return {
      list: [],
      total: 0
    }
  }
}

export async function getSubjectFour(data) {
  try {
    let list = wx.getStorageSync(constant.SUBJECT_FOUR)
    let total = wx.getStorageSync(constant.SUBJECT_FOUR_TOTAL)
    if (list) {
      return {
        list,
        total
      }
    }
    const res = await getSubjectFourList(data)
    list = res.list || []
    total = res.total || 0
    wx.setStorageSync(constant.SUBJECT_FOUR, list)
    wx.setStorageSync(constant.SUBJECT_FOUR_TOTAL, total)
    return res
  } catch (e) {
    console.log('getSubjectFOUR fail', e)
    return {
      list: [],
      total: 0
    }
  }
}

export function getSubjectOneCollection() {
  return wx.getStorageSync('one_ORDER_COLLECTION') || {}
}

export function getSubjectFourCollection() {
  return wx.getStorageSync(constant.SUBJECT_FOUR_COLLECTION) || {}
}