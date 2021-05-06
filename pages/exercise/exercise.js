// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSubjectOne, getSubjectOneCollection } from '../../utils/cache'
import { SUBJECT_ONE_ERROR, SUBJECT_ONE_RESULT, SUBJECT_ONE_SUCCESS, SUBJECT_ONE_TOPIC_INDEX, SUBJECT_ONE_ERROR_NUMBER, SUBJECT_ONE_SUCCESS_NUMBER } from '../../utils/constant'
const app = getApp();
const MAX_SWIPER_LENGTH = 3;
let cacheList = [];
let collection = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    exerciseList: [],
    // 是否循环
    isCircular: true,
    renderModal: false,
    // 当前屏幕对应的题目索引
    topicIndex: 0,
    total: 0,
    swiperIndex: 0,
    answerOwnId: {},
    hasCollected: false,
    isShowResult: false,
    listNum: 0,
    successNumber: 0,
    wrongNumber: 0,
    classicList: [],
    answerList: []
  },
  toggle() {
    this.setData({
      swiperIndex: 1
    })
  },
  // 点击每一个选项
  clickItem(e) {
    const { item, index, optidx } = e.currentTarget.dataset;
    let { topicIndex, exerciseList, isShowResult, answerList } = this.data
    const { own_res } = exerciseList[index];
    let successNumber = 0
    let wrongNumber = 0
    let key = 'answerList[' + topicIndex + ']';
    let value = {
      index: topicIndex,
      class: ''
    }
    if (!own_res && !isShowResult) {
      this.data.exerciseList[index].own_res = optidx + 1 + '';
      if (Number(optidx) + 1 == Number(item.ta)) {
        value.class = 'success'
        const res = this._getTopicRecord(topicIndex, true)
        successNumber = res.successNumber
        wrongNumber = res.wrongNumber
        console.log('success', this.data.answerList[topicIndex])
      } else {
        value.class = 'error'
        const res = this._getTopicRecord(topicIndex, optidx + '')
        successNumber = res.successNumber
        wrongNumber = res.wrongNumber
      }
      this.data.exerciseList[index].options[optidx].className = 'error';
      this.data.exerciseList[index].options[item.ta - 1].className = 'success';
      this.setData({
        [key]: value,
        exerciseList: this.data.exerciseList,
        successNumber,
        wrongNumber
      });

    }
  },
  gotoItem(e) {
    const { index } = e.target.dataset
    wx.setStorageSync(SUBJECT_ONE_TOPIC_INDEX, index)
    this._initSubject(index)
    this.hideModal()

  },
  _getTopicRecord(topicIndex, res) {
    const subjectResult = wx.getStorageSync(SUBJECT_ONE_RESULT) || {}
    let successNumber = wx.getStorageSync(SUBJECT_ONE_SUCCESS_NUMBER) || 0
    let wrongNumber = wx.getStorageSync(SUBJECT_ONE_ERROR_NUMBER) || 0
    if (subjectResult[topicIndex]) {
      if (subjectResult[topicIndex] === true) {
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
    console.log('ininini---')
    subjectResult[topicIndex] = res
    wx.setStorageSync(SUBJECT_ONE_RESULT, subjectResult)
    wx.setStorageSync(SUBJECT_ONE_SUCCESS_NUMBER, successNumber)
    wx.setStorageSync(SUBJECT_ONE_ERROR_NUMBER, wrongNumber)
    return {successNumber, wrongNumber}
  },
  changeRecite() {
    this.setData({
      isShowResult: !this.data.isShowResult,
    });
  },
  /**
   * 判断滑动的方向
   * @param {number} currentIdx 当前swiper的index
   * @return true - 向右滑动 false - 向左滑动
   */
  _checkSwipeDirec(currentIdx) {
    const {
      swiperIndex
    } = this.data;
    // 右滑 0 - 1 1 - 2 2 - 0   左滑 0 - 2 2 - 1 1 - 0
    return currentIdx - swiperIndex === 1 || currentIdx - swiperIndex === -2;
  },
  _checkBorder(current, topicIndex) {
    const _this = this;
    if (!cacheList[topicIndex + 1]) {
      wx.showModal({
        title: '提示',
        content: '已经是最后一题了',
        showCancel: false,
        confirmText: '我知道了',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            _this.setData({
              swiperIndex: current - 1,
            });
          }
        },
      });
      return false
    }
    return true
  },
  // 下一道题目
  _toNextTopic(current) {
    let { topicIndex } = this.data;
    this._checkBorder(current, topicIndex);
    const idx = current + 1 > 2 ? 0 : current + 1;
    const key = 'exerciseList[' + idx + ']';
    const topicInfo = cacheList[topicIndex + 2] || {};
    this.setData({
      [key]: topicInfo,
      topicIndex: topicIndex + 1,
    });
    console.log('cacheList[topicIndex + 2]', topicInfo);
    return this.data.topicIndex;
  },
  // 上一道题目
  _toLastTopic(current) {
    let { topicIndex } = this.data;
    if (topicIndex === 1) {
      this.setData({
        isCircular: false
      })
    }
    console.log('last', topicIndex)
    const idx = current - 1 < 0 ? 2 : current - 1;
    const key = 'exerciseList[' + idx + ']';
    topicIndex = topicIndex - 1
    this.setData({
      [key]: cacheList[topicIndex - 1],
      topicIndex
    });
  },
  // 滑动滑块结束
  onSlideChangeEnd(e) {
    console.log('eeeeeeeeeee-------eeeeee', e);
    const { current, source } = e.detail;
    if (source === 'touch') {
      let isRight = this._checkSwipeDirec(current);
      this.setData({
        swiperIndex: current,
      });
      if (isRight) {
        this._toNextTopic(current);
      } else {
        this._toLastTopic(current);
      }
      console.log('end topicIndex', this.data.topicIndex)
      this._setCircular();
      this._checkStar();
      this._saveTopicIndex()
    }
  },
  _saveTopicIndex() {
    const { topicIndex } = this.data
    wx.setStorageSync(SUBJECT_ONE_TOPIC_INDEX, topicIndex)
  },
  collectionItem(e) {
    const { topicIndex } = this.data
    if (collection[topicIndex]) {
      collection[topicIndex] = null;
      collection = cancelCollection(topicIndex + '');
    } else {
      collection[topicIndex] = true;
      collection = saveCollection(topicIndex + '');
    }
    this._checkStar(true);
    console.log(collection);
  },
  _checkStar(showMsg = false) {
    const { topicIndex } = this.data
    collection = getSubjectOneCollection()
    console.log(111, collection, topicIndex)
    const hasStar = !!collection[topicIndex];
    const msg = hasStar ? '收藏成功' : '已取消收藏';
    showMsg &&
      wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1000,
      });
    this.setData({
      hasCollected: hasStar,
    });
  },
  _setCircular() {
    console.log(this.data.topicIndex);
    const {
      topicIndex,
      isCircular
    } = this.data;
    console.log('topicIndex', topicIndex);
    if (topicIndex === 0 || topicIndex >= cacheList.length - 1) {
      console.log('in', isCircular)
      if (isCircular) {
        this.setData({
          isCircular: false,
        });
      }
    } else {
      if (!isCircular) {
        this.setData({
          isCircular: true,
        });
      }
    }
  },
  /**
   * 底部模态框
   */

  showModal(e) {
    // listNum
    console.log(e);
    const {
      total
    } = this.data;
    this.setData({
      modalName: e.currentTarget.dataset.target,
    });
  },

  hideModal() {
    this.setData({
      modalName: null,
    });
  },
  async _initSubject(topicIndex = 0) {
    if (topicIndex > cacheList.length - 1) {
      topicIndex = cacheList.length - 1
    }
    let exerciseList = [];
    let start = 0
    let end = start + 3
    // let swiperIndex = 0
    let restIndex = topicIndex % 3
    console.log('--------', topicIndex, restIndex)
    if (topicIndex === 0) {
      // swiperIndex = 0
      exerciseList = cacheList.slice(start, end)
    } else {
      if (restIndex === 0) {
        exerciseList[0] = cacheList[topicIndex]
        exerciseList[1] = cacheList[topicIndex + 1]
        exerciseList[2] = cacheList[topicIndex - 1]
      }
      if (restIndex === 1) {
        exerciseList[0] = cacheList[topicIndex - 1]
        exerciseList[1] = cacheList[topicIndex]
        exerciseList[2] = cacheList[topicIndex + 1]
      }
      if (restIndex === 2) {
        exerciseList[0] = cacheList[topicIndex + 1]
        exerciseList[1] = cacheList[topicIndex - 1]
        exerciseList[2] = cacheList[topicIndex]
      }
    }
    this.setData({
      swiperIndex: restIndex,
      topicIndex,
      exerciseList,
    })
    this._setCircular();
    this._checkStar();
  },

  async _initAppData() {
    const { list, total } = await getSubjectOne()
    this.setData({
      total
    })
    cacheList = list
    const index = wx.getStorageSync(SUBJECT_ONE_TOPIC_INDEX) || 0
    const topicIndex = index < 0 ? 0 : index
    this._initSubject(topicIndex)
    this._renderModal()
  },
  _checkObjIsEqual(a, b) {
    let hasChanged;
    if (Object.keys(a).length !== Object.keys(b).length) {
      hasChanged = true;
    } else {
      for (let key in a) {
        if (b[key] === a[key]) {
          hasChanged = false;
        } else {
          hasChanged = true;
          break;
        }
      }
    }
    return hasChanged;
  },
  _initErrorAndSuccess() {
    const successNumber = wx.getStorageSync('SUBJECT_ONE_SUCCESS_NUMBER') || 0
    const wrongNumber = wx.getStorageSync('SUBJECT_ONE_ERROR_NUMBER') || 0
    this.setData({
      successNumber,
      wrongNumber
    })
  },
  _renderModal() {
    let { total } = this.data
    let list = []
    const subjectOneResult = wx.getStorageSync(SUBJECT_ONE_RESULT) || {}
    for (let i = 0; i < total; i++) {
      if (subjectOneResult[i] === true) {
        list.push({
          index: i,
          class: 'success'
        })
        continue
      }
      if (subjectOneResult[i]) {
        list.push({
          index: i,
          class: 'error'
        })
        continue
      }
      // if()
      list.push({
        index: i,
        class: ''
      })
    }
    console.log(list)
    this.setData({
      answerList: list,
      renderModal: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.type);
    this._initAppData();
    this._initErrorAndSuccess()
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
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
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