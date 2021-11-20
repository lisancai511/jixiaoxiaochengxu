// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getMockSubjectOne } from '../../service/subjectone'
import { getSubjectOne, getSubjectOneCollection } from '../../utils/cache'
import { SUBJECT_ONE_MOCK, SUBJECT_ONE_MOCK_TIME, SUBJECT_ONE_MOCK_RESULT, SUBJECT_ONE_MOCK_TOPIC_INDEX, SUBJECT_ONE_MOCK_ERROR_NUMBER, SUBJECT_ONE_MOCK_SUCCESS_NUMBER } from '../../utils/constant'
const app = getApp();

const COUNT_DOWN_TIME = 45 * 60
let cacheList = [];
let collection = {};
let timer = null
let countDownTimer = null
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
    countDownTime: '45:00'
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
  renderTimeString(timeNumber) {
    let timeString = this.calculateTime(timeNumber)
    this.setData({
      countDownTime: timeString
    })
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
  renderCountDownTime(timeNumber) {
    countDownTimer = setInterval(() => {
      timeNumber--
      if (timeNumber === 0) {
        clearInterval(countDownTimer)
        this.forceSubmit()
      }
      this.renderTimeString(timeNumber)
    }, 1000)
    this.renderTimeString(timeNumber)
  },
  getTimeNumByTimeStr(countDownTime) {
    let [m, s] = countDownTime.split(':')
    m = Number(m)
    s = Number(s)
    return m * 60 + s
  },

  jumpToItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(SUBJECT_ONE_MOCK_TOPIC_INDEX, topicIndex)
  },
  slideItem(e) {
    const topicIndex = e.detail
    this.setData({
      topicIndex
    })
    wx.setStorageSync(SUBJECT_ONE_MOCK_TOPIC_INDEX, topicIndex)
  },
  toggleCollect(e) {
    const key = e.detail
    collection = getSubjectOneCollection()
    if (collection[key]) {
      collection[key] = null;
      collection = cancelCollection(key);
    } else {
      collection[key] = true;
      collection = saveCollection(key);
    }
  },
  _getTopicId(topicIndex) {
    const id = cacheList[topicIndex] && cacheList[topicIndex].id
    return id || null
  },
  _getTopicRecord(topicIndex, res) {
    const key = this._getTopicId(topicIndex)
    console.log(key)
    const subjectResult = wx.getStorageSync(SUBJECT_ONE_MOCK_RESULT) || {}
    let successNumber = wx.getStorageSync(SUBJECT_ONE_MOCK_SUCCESS_NUMBER) || 0
    let wrongNumber = wx.getStorageSync(SUBJECT_ONE_MOCK_ERROR_NUMBER) || 0
    if (subjectResult[key]) {
      if (subjectResult[key] === true) {
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
    subjectResult[key] = res
    wx.setStorageSync(SUBJECT_ONE_MOCK_RESULT, subjectResult)
    wx.setStorageSync(SUBJECT_ONE_MOCK_SUCCESS_NUMBER, successNumber)
    wx.setStorageSync(SUBJECT_ONE_MOCK_ERROR_NUMBER, wrongNumber)
    return { successNumber, wrongNumber }
  },
  checkOptionItem(e) {
    const { topicIndex, res } = e.detail
    console.log(topicIndex, res)
    const { successNumber, wrongNumber } = this._getTopicRecord(topicIndex, res)
    this.setData({
      wrongNumber,
      successNumber
    })
  },
  async getMockSubjectOne(reset) {
    const cache = wx.getStorageSync(SUBJECT_ONE_MOCK)
    if (cache && !reset) {
      return cache
    }
    let { list: data } = await getMockSubjectOne()
    wx.setStorageSync(SUBJECT_ONE_MOCK, data)
    return data
  },
  async _initAppData(reset = false) {
    let list = await this.getMockSubjectOne(reset)
    cacheList = list
    const index = wx.getStorageSync(SUBJECT_ONE_MOCK_TOPIC_INDEX) || 0
    const topicIndex = index < 0 ? 0 : index
    this.setData({
      topicIndex
    })
    const ref = this.selectComponent('.topic')
    ref._initTopicData()
  },
  _initErrorAndSuccess() {
    const successNumber = wx.getStorageSync(SUBJECT_ONE_MOCK_SUCCESS_NUMBER) || 0
    const wrongNumber = wx.getStorageSync(SUBJECT_ONE_MOCK_ERROR_NUMBER) || 0
    this.setData({
      successNumber,
      wrongNumber
    })
  },

  _resetMock() {
    wx.removeStorageSync(SUBJECT_ONE_MOCK)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_RESULT)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_TOPIC_INDEX)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_TIME)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_SUCCESS_NUMBER)
    wx.removeStorageSync(SUBJECT_ONE_MOCK_ERROR_NUMBER)
  },
  _checkCache() {
    const cache = wx.getStorageSync(SUBJECT_ONE_MOCK_RESULT) || null
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
            const timeNum = wx.getStorageSync(SUBJECT_ONE_MOCK_TIME)
            const countTime = this.getTimeNumByTimeStr(timeNum)
            this.renderCountDownTime(countTime)
          } else if (res.cancel) {
            this._resetMock()
            this._initAppData(true)
          }
        }
      })
    } else {
      this._resetMock()
      this.renderCountDownTime(COUNT_DOWN_TIME)
      this._initAppData()
    }
  },
  saveCountTime() {
    const cache = wx.getStorageSync(SUBJECT_ONE_MOCK_RESULT) || null
    if (cache) {
      const { countDownTime } = this.data
      wx.setStorageSync(SUBJECT_ONE_MOCK_TIME, countDownTime)
    }
  },
  takeSubmit() {
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
        if (res.cancel) {
          // this._resetMock()
          wx.redirectTo({
            url: '/pages/record/record'
          })
          // wx.showToast({
          //   title: '提交成功',
          //   icon: 'success'
          // })
          // if(timer) {
          //   clearTimeout(timer)
          // }
          // timer = setTimeout(() => {
          //   console.log('123')
          //   wx.navigateBack()
          // }, 3000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.type);
    // 判断是否正在考试未交卷的情况
    // this.renderCountDownTime()
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