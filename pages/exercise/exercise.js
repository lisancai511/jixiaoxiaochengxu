// pages/exercise/exercise.js
import ClassicModel from '../../model/classic.js';
import {
  saveUserAnswer,
  getKeyFromStorage,
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
import { getSubjectOne, getSubjectOneCollection } from '../../utils/cache'
const classicModel = new ClassicModel();
const app = getApp();
const MAX_SWIPER_LENGTH = 3;
const LIMIT_NUMS = 1;
let cacheList = [];
let currentPage = 1;
let collection = {};
let errorOneTopic = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    exerciseList: [],
    // 是否循环
    isCircular: true,
    currentItemId: '',
    // 当前屏幕对应的题目索引
    topicIndex: 0,
    total: 0,
    swiperIndex: 0,
    answerOwnId: {},
    hasCollected: false,
    isShowResult: false,
    listNum: 0,
    rightNumber: 0,
    wrongNumber: 0
  },
  _getTopicId() {
    const idx = this.data.topicIndex;
    return (cacheList[idx] && cacheList[idx].id) || null;
  },
  _getClassicList(data) {
    return classicModel.getClassic(data).then(res => res.list);
  },
  getDotClassName(item) {
    const {
      ta,
      id
    } = item;
    // let answerObj = getKeyFromStorage('answerOwnId');
    // if (answerObj[id] === ta) {
    //   return 'success';
    // } else {
    //   return 'error';
    // }
  },
  back() {
    wx.navigateBack({
      delta: 1,
    });
  },
  clickItem(e) {
    const {
      item,
      index,
      optidx
    } = e.currentTarget.dataset;
    const {
      own_res
    } = this.data.exerciseList[index];
    if (!own_res && !this.data.isShowResult) {
      this.data.exerciseList[index].own_res = optidx + 1 + '';
      saveUserAnswer(item, optidx + 1 + '');
      if (Number(optidx) + 1 == Number(item.ta)) {
        this.setData({
          rightNumber: this.data.rightNumber + 1
        })
      } else {
        this.setData({
          wrongNumber: this.data.wrongNumber + 1
        })
      }
      this.data.exerciseList[index].options[optidx].className = 'error';
      this.data.exerciseList[index].options[item.ta - 1].className = 'success';
      this.setData({
        exerciseList: this.data.exerciseList,
      });
    }
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
    if (topicIndex === 0) {
      console.log('000')
      wx.showToast({
        title: '已经是第一题了',
        icon: 'none'
      })
      _this.setData({
        swiperIndex: current + 1,
        topicIndex: 0
      });
      return false
    }
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
    const res = this._checkBorder(current, topicIndex);
    if(!res) return
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
    // const res = this._checkBorder(current, topicIndex)
    // if(!res) return
    console.log('last', topicIndex)
    const idx = current - 1 < 0 ? 2 : current - 1;
    const key = 'exerciseList[' + idx + ']';
    topicIndex = topicIndex - 1
    // if (topicIndex === 0) {
    //   console.log(123)
    //   const exerciseList = [cacheList[0], cacheList[1], cacheList[2]]
    //   this.setData({
    //     exerciseList,
    //     swiperIndex: 0,
    //     isCircular: false,
    //     topicIndex: 0
    //   })
    // } else {
    // }
    if (topicIndex < 0) {
      wx.showToast({
        title: '已经是第一题了',
        icon: 'none'
      })
      topicIndex = 0
    }
    this.setData({
      [key]: cacheList[topicIndex - 2],
      topicIndex
    });
  },
  _getMoreData(resIdx) {
    // TODO:后续改成100条数据
    // const initIdx = Math.floor(resIdx / 100);
    // const page = initIdx ? 1 : initIdx;
    // const params = {
    //   page: page + 1,
    //   limit: 100,
    // };
    currentPage = currentPage + 1;
    const params = {
      page: currentPage,
      limit: 100,
    };
    this._getClassicList(params).then(res => {
      cacheList = cacheList.concat(res);
    });
  },
  onSlideChangeEnd(e) {
    console.log('e', e);
    const { currentItemId,current } = e.detail;
    let isRight = this._checkSwipeDirec(current);
    this.setData({
      swiperIndex: current,
      currentItemId,
    });
    if (isRight) {
      const resIdx = this._toNextTopic(current);
    } else {
      this._toLastTopic(current);
    }
    // this._setCircular();
    // this._checkStar();
  },
  collectionItem(e) {
    const currentId = this._getTopicId();
    if (currentId) {
      if (collection[currentId]) {
        collection[currentId] = null;
        collection = cancelCollection(currentId);
      } else {
        collection[currentId] = currentId;
        collection = saveCollection(currentId);
      }
    }
    this._checkStar(true);
    console.log(collection);
  },
  _checkStar(showMsg = false) {
    const currentId = this._getTopicId();
    const hasStar = !!collection[currentId];
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

  hideModal(e) {
    this.setData({
      modalName: null,
    });
  },
  async _initSubject(topicIndex = 0) {
    const {list, total} = await getSubjectOne()
    // 将数据存储在内存中，不放置在data里面这里是全部的数据无需在页面渲染
    cacheList = list
    let exerciseList = [];
    let start = 0;
    let swiperIndex = 0
    let end = 0
    // 如果为0，则查前三道题目
    if (topicIndex === 0) {
      end = start + 3
    }
    // 大于0，始终保持当前页面的swiper索引为1
    if (topicIndex > 0) {
      start = topicIndex - 1;
      end = start + 3
      swiperIndex = 1
      // 超过边界后，索引设置为2.
      if (end > list.length) {
        end = list.length
        start = end - 3
        swiperIndex = 2
      }
    }
    // console.log('start', start, end)
    exerciseList = cacheList.slice(start, end);
    // console.log('exerciseList', exerciseList)
    this.setData({
      total,
      swiperIndex,
      topicIndex,
      exerciseList,
      currentItemId: exerciseList[0].id
    })
  },

  async _initAppData() {
    this._initSubject(2)
    collection = await getSubjectOneCollection()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type);
    this._initAppData();
    // this._checkStar();
    // this._setCircular();
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
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

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