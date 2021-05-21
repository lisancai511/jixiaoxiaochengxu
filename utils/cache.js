const {getSubjectOneList} = require('../service/subjectone')
const {getSubjectFourList} = require('../service/subjectfour')
const constant = require('../utils/constant')
// 获取科目一的数据，拿到之后存入storage中，取得时候先从storage中取，没有则重新调取接口
export async function getSubjectOne(data) {
  try {
    let list = wx.getStorageSync(constant.SUBJECT_ONE)
    let total = wx.getStorageSync(constant.SUBJECT_ONE_TOTAL)
    if(list) {
      return {
        list,
        total
      }
    }
    const res = await getSubjectOneList(data)
    list = res.list || []
    total = res.total || 0
    wx.setStorageSync(constant.SUBJECT_ONE, list)
    wx.setStorageSync(constant.SUBJECT_ONE_TOTAL, total)
    return res
  } catch(e) {
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
    if(list) {
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
  } catch(e) {
    console.log('getSubjectFOUR fail', e)
    return {
      list: [],
      total: 0
    }
  } 
}

export function getSubjectOneCollection() {
  return wx.getStorageSync(constant.SUBJECT_ONE_COLLECTION) || {}
}

export function getSubjectFourCollection() {
  return wx.getStorageSync(constant.SUBJECT_FOUR_COLLECTION) || {}
}