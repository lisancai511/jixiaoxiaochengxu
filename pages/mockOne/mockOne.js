// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getUserStorage } from '../../utils/storage'
import { getMockSubjectOne } from '../../service/subjectone'
import { addGrade } from '../../service/common'
import { getTopicListByKemuType, getSubjectOneCollection } from '../../utils/cache'
import { TOPIC, TOTAL, RESULT, ERROR_NUMBER, SUCCESS_NUMBER, TOPIC_INDEX, TIME } from '../../utils/constant'
const app = getApp();

const COUNT_DOWN_TIME = '45:00'
const COUNT_DOWN_TIME_NUMBER = 45 * 60
let cacheList = [];
let collection = {};
let timer = null
let countDownTimer = null
let resultKey = ''
let topicKey = ''
let errorNumberKey = ''
let successNumberKey = ''
let topicIndexKey = ''
let totalKey = ''
let timeKey = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    topicIndex: 0,
    total: 100,
    successNumber: 0,
    wrongNumber: 0,
    countDownTime: COUNT_DOWN_TIME,
    kemuType: '',
    from: ''
  },
  calculateTime(timeNumber) {
    let minute = Math.floor(timeNumber / 60)
    let second = timeNumber % 60
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }
    return `${minute}:${second}`
  },
  renderTimeByStr(timeStr) {
    const timeNumber = this.getTimeNumByTimeStr(timeStr)
    let timeString = this.calculateTime(timeNumber)
    this.setData({
      countDownTime: timeString
    })
  },
  renderTimeByNum(timeNumber) {
    let timeString = this.calculateTime(timeNumber)
    this.setData({
      countDownTime: timeString
    })
  },
  getTimeNumByTimeStr(countDownTime) {
    let [m, s] = countDownTime.split(':')
    m = Number(m)
    s = Number(s)
    return m * 60 + s
  },
  forceSubmit() {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '时间已到，需要立刻交卷！',
      confirmText: '我知道了',
      success(res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/record/record'
          })
        }
      }
    })
  },
  renderCountDownTime(timeStr) {
    let timeNumber = this.getTimeNumByTimeStr(timeStr)
    countDownTimer = setInterval(() => {
      timeNumber--
      if (timeNumber === 0) {
        clearInterval(countDownTimer)
        this.forceSubmit()
      }
      this.renderTimeByNum(timeNumber)
    }, 1000)
    this.renderTimeByNum(timeNumber)
  },
  jumpToItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(topicIndexKey, topicIndex)
  },
  slideItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(topicIndexKey, topicIndex)
  },
  toggleCollect(e) {
    const key = e.detail
    const { kemuType } = this.data
    collection = getSubjectOneCollection(kemuType)
    if (collection[key]) {
      collection[key] = null;
      collection = cancelCollection(kemuType, key);
    } else {
      collection[key] = true;
      collection = saveCollection(kemuType, key);
    }
  },
  _getTopicId(topicIndex) {
    const id = cacheList[topicIndex] && cacheList[topicIndex].id
    return id || null
  },
  _getTopicRecord(topicId, res) {
    const subjectResult = wx.getStorageSync(resultKey) || {}
    let successNumber = wx.getStorageSync(successNumberKey) || 0
    let wrongNumber = wx.getStorageSync(errorNumberKey) || 0
    if (subjectResult[topicId]) {
      if (subjectResult[topicId] === true) {
        // 之前都是作对的题目
        if (res !== true) {
          successNumber--
          wrongNumber++
        }
      } else {
        // 之前做错了
        if (res === true) {
          successNumber++
          wrongNumber--
        }
      }
    } else {
      if (res === true) {
        successNumber++
      } else {
        wrongNumber++
      }
    }
    subjectResult[topicId] = res
    wx.setStorageSync(resultKey, subjectResult)
    wx.setStorageSync(successNumberKey, successNumber)
    wx.setStorageSync(errorNumberKey, wrongNumber)
    return { successNumber, wrongNumber }
  },
  checkOptionItem(e) {
    const { topicId, res } = e.detail
    const { successNumber, wrongNumber } = this._getTopicRecord(topicId, res)
    this.setData({
      wrongNumber,
      successNumber
    })
  },
  async getMockSubjectOne(reset) {
    const cache = wx.getStorageSync(topicKey)
    if (cache && !reset) {
      return cache
    }
    const { kemuType } = this.data
    let { list: data } = await getMockSubjectOne(kemuType)
    wx.setStorageSync(topicKey, data)
    return data
  },
  async _initAppData(reset = false) {
    let list = await this.getMockSubjectOne(reset)
    cacheList = list
    const index = wx.getStorageSync(topicIndexKey) || 0
    const topicIndex = index < 0 ? 0 : index
    this.setData({
      topicIndex
    })
    const ref = this.selectComponent('.topic')
    ref._initTopicData()
  },
  _initErrorAndSuccess() {
    const successNumber = wx.getStorageSync(successNumberKey) || 0
    const wrongNumber = wx.getStorageSync(errorNumberKey) || 0
    this.setData({
      successNumber,
      wrongNumber
    })
  },

  _resetMock() {
    wx.removeStorageSync(topicKey)
    wx.removeStorageSync(resultKey)
    wx.removeStorageSync(topicIndexKey)
    wx.removeStorageSync(timeKey)
    wx.removeStorageSync(successNumberKey)
    wx.removeStorageSync(errorNumberKey)
  },
  _checkCache() {
    const cache = wx.getStorageSync(resultKey) || null
    if (cache) {
      wx.showModal({
        title: '温馨提示',
        content: '你有正在进行的考试，是否继续？',
        cancelText: '重新进行',
        confirmText: '继续考试',
        success: (res) => {
          if (res.confirm) {
            this._initErrorAndSuccess()
            this._initAppData()
            const countTime = wx.getStorageSync(timeKey)
            this.renderCountDownTime(countTime)
          } else if (res.cancel) {
            this._resetMock()
            this._initAppData(true)
            this.renderCountDownTime(COUNT_DOWN_TIME)
          }
        }
      })
    } else {
      const { countDownTime } = this.data
      this._resetMock()
      this.renderCountDownTime(countDownTime)
      this._initAppData()
    }
  },
  saveCountTime() {
    const cache = wx.getStorageSync(resultKey) || null
    if (cache) {
      const { countDownTime } = this.data
      wx.setStorageSync(timeKey, countDownTime)
    }
  },
  takeSubmit() {
    if (countDownTimer) {
      clearInterval(countDownTimer)
    }
    const { successNumber, wrongNumber, total } = this.data
    const reset = total - (successNumber + wrongNumber)
    let content = '是否确认提交试卷？'
    if (reset !== 0) {
      content = `您还有 ${reset} 道题目未完成，是否确认提交试卷？`
    }
    wx.showModal({
      content,
      cancelText: '确认提交',
      confirmText: '继续答题',
      success: (res) => {
        console.log(res)
        const { confirm, cancel } = res
        if (confirm) {
          const { countDownTime } = this.data
          this.renderCountDownTime(countDownTime)
        }
        if (res.cancel) {
          const score = wx.getStorageSync(successNumberKey)
          this.sendScoreToServer()
          wx.redirectTo({
            url: '/pages/gradeResult/gradeResult',
          })
        }
      },
    })
  },
  _getUsedTimeStr() {
    const { countDownTime } = this.data
    const timeNumber = this.getTimeNumByTimeStr(countDownTime)
    const usedTimeNumber = COUNT_DOWN_TIME_NUMBER - timeNumber
    const usedTimeStr = this.calculateTime(usedTimeNumber)
    return usedTimeStr
  },
  sendScoreToServer() {
    const user = getUserStorage()
    const { kemuType } = this.data
    if (user && user.id) {
      const score = wx.getStorageSync(successNumberKey) || 0
      const useTime = this._getUsedTimeStr()
      const params = {
        wxUserId: user.id,
        score,
        useTime,
        type: kemuType === 'one' ? '1' : '4'
      }
      addGrade(params)
    }

  },
  createStorageKey(key) {
    const { kemuType, from } = this.data
    return `${kemuType}_${from}_${key}`
  },
  initKey() {
    totalKey = this.createStorageKey(TOTAL)
    resultKey = this.createStorageKey(RESULT)
    topicKey = this.createStorageKey(TOPIC)
    errorNumberKey = this.createStorageKey(ERROR_NUMBER)
    successNumberKey = this.createStorageKey(SUCCESS_NUMBER)
    topicIndexKey = this.createStorageKey(TOPIC_INDEX)
    timeKey = this.createStorageKey(TIME)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { kemuType, from } = options
    this.setData({
      kemuType,
      from
    })
    this.initKey()
    this._checkCache()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.saveCountTime()
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    this.saveCountTime()
    if (timer) {
      clearTimeout(timer)
    }
    if (countDownTimer) {
      clearInterval(countDownTimer)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
});