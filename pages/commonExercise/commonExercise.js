// pages/exercise/exercise.js
import {
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSpecialOne } from '../../service/subjectone'
const app = getApp();
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
    answerList: []
  },
  // 点击每一个选项
  clickItem(e) {
    const { item, index, optidx } = e.currentTarget.dataset;
    let { topicIndex, exerciseList, isShowResult } = this.data
    const { own_res } = exerciseList[index];
    let key = 'answerList[' + topicIndex + ']';
    let value = {
      index: topicIndex,
      class: ''
    }
    if (!own_res && !isShowResult) {
      this.data.exerciseList[index].own_res = optidx + 1 + '';
      if (Number(optidx) + 1 == Number(item.ta)) {
        value.class = 'success'
      } else {
        value.class = 'error'
      }
      this.data.exerciseList[index].options[optidx].className = 'error';
      this.data.exerciseList[index].options[item.ta - 1].className = 'success';
      this.setData({
        [key]: value,
        exerciseList: this.data.exerciseList
      });

    }
  },
  gotoItem(e) {
    const { index } = e.target.dataset
    this._initSubject(index)
    this.hideModal()

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
    if (!cacheList[topicIndex + 1]) {
      wx.showModal({
        title: '提示',
        content: '已经是最后一题了',
        showCancel: false,
        confirmText: '我知道了',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定');
            this.setData({
              swiperIndex: current - 1,
            });
            this._slideItem(current - 1)
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
  _slideItem(current) {
    let isRight = this._checkSwipeDirec(current);
    this.setData({
      swiperIndex: current,
    });
    if (isRight) {
      this._toNextTopic(current);
    } else {
      this._toLastTopic(current);
    }
    this._setCircular();
  },
  // 滑动滑块结束
  onSlideChangeEnd(e) {
    console.log('eeeeeeeeeee-------eeeeee', e);
    const { current, source } = e.detail;
    if (source === 'touch') {
      this._slideItem(current)
    }
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
  },
  _setCircular() {
    console.log(this.data.topicIndex);
    const {
      topicIndex,
      isCircular,
      total
    } = this.data;
    console.log('topicIndex', topicIndex);
    if(total <= 3) {
      this.setData({
        isCircular: false,
      });
      return
    }
    if (topicIndex === 0 || topicIndex > cacheList.length - 1) {
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
  },

  async _initAppData(type) {
    wx.showLoading({
      title: '数据加载中',
    })
    const {list, total} = await getSpecialOne(type)
    // console.log('list', list)
    this.setData({
      total
    })
    cacheList = list
    this._initSubject()
    this._renderModal()
    wx.hideLoading()
  },
  _renderModal() {
    let { total } = this.data
    let list = []
    for (let i = 0; i < total; i++) {
      list.push({
        index: i,
        class: ''
      })
    }
    this.setData({
      answerList: list,
      renderModal: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {type} = options
    this._initAppData(type);
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