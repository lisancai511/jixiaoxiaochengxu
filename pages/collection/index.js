// pages/exercise/exercise.js
import CollectionModel from '../../model/collection';
import {
  saveUserAnswer,
  getKeyFromStorage,
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
const collectionModel = new CollectionModel();
const app = getApp();
const MAX_SWIPER_LENGTH = 3;
const LIMIT_NUMS = 1;
let cacheList = [];
let currentPage = 1;
let collection = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    exerciseList: [],
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
  },
  _getTopicId() {
    const idx = this.data.topicIndex;
    return (cacheList[idx] && cacheList[idx].id) || null;
  },
  _getClassicList(data) {
    return collectionModel.getColectOne(data).then(res => res.list);
  },
  getDotClassName(item) {
    const { ta, id } = item;
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
    const { item, index, optidx } = e.currentTarget.dataset;
    console.log('index', index);
    const { own_res } = this.data.exerciseList[index];
    if (!own_res && !this.data.isShowResult) {
      this.data.exerciseList[index].own_res = optidx + 1 + '';
      saveUserAnswer(item.id, optidx + 1 + '');
      // if (this.data.exerciseList[index].own_res === item.ta) {
      //   console.log('in');
      //   setTimeout(() => {
      //     this.setData({
      //       currentPage: index + 1,
      //     });
      //   }, 1000);
      // }
      console.log(index);
      let { options } = this.data.exerciseList[index];
      console.log(options);
      this.data.exerciseList[index].options[optidx].className = 'error';
      console.log('---', item.ta - 1);
      console.log('---options', options);
      this.data.exerciseList[index].options[item.ta - 1].className = 'success';
      console.log('this.data.exerciseList', this.data.exerciseList);
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
    const { swiperIndex } = this.data;
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
    }
  },
  _toNextTopic(current) {
    let { topicIndex } = this.data;
    this._checkBorder(current, topicIndex);
    const idx = current + 1 > 2 ? 0 : current + 1;
    const key = 'exerciseList[' + idx + ']';
    // const casheIdx = topicIndex + 2 > cacheList.length - 1 ? 0 : topicIndex + 2;
    // const index = topicIndex === cacheList.length - 1 ? 0 : topicIndex + 1;
    // console.log('idx---', idx, topicIndex, cacheList.length, index);
    const topicInfo = cacheList[topicIndex + 2] || {};
    this.setData({
      [key]: topicInfo,
      topicIndex: topicIndex + 1,
    });
    console.log('cacheList[topicIndex + 2]', topicInfo);
    return this.data.topicIndex;
  },
  _toLastTopic(current) {
    const { topicIndex } = this.data;
    const idx = current - 1 < 0 ? 2 : current - 1;
    const key = 'exerciseList[' + idx + ']';
    this.setData({
      [key]: cacheList[topicIndex - 2],
      topicIndex: topicIndex - 1,
    });
  },
  onSlideChangeEnd(e) {
    console.log('e', e);
    const { currentItemId, current } = e.detail;
    let isRight = this._checkSwipeDirec(current);
    this.setData({
      swiperIndex: current,
      currentItemId,
    });
    if (isRight) {
      const resIdx = this._toNextTopic(current);
      if (resIdx % 100 === 3) {
        // if (cacheList.length - resIdx === 3) {
        // this._getMoreData(resIdx);
      }
      console.log('右滑', resIdx);
    } else {
      this._toLastTopic(current);
    }
    this._checkStar();
    this._setCircular();
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
    const { topicIndex, isCircular } = this.data;
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    console.log(cacheList);
    if (topicIndex === 0 || topicIndex >= cacheList.length - 1) {
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
    const { total } = this.data;
    this.setData({
      modalName: e.currentTarget.dataset.target,
    });
  },

  hideModal(e) {
    this.setData({
      modalName: null,
    });
  },
  _getCollectionData(type) {
    let ids = [];
    if (type === 'collectionOne') {
      collection = getKeyFromStorage('collectionIds') || {};
      ids = Object.keys(collection);
      return this._getClassicList(ids);
    } else {
      collection = getKeyFromStorage('collectionFourIds') || {};
      ids = Object.keys(collection);
      return this._getClassicList(ids);
    }
  },
  _initData(type) {
    this._getCollectionData(type).then(res => {
      cacheList = res;
      let { topicIndex } = this.data;
      let exerciseList = [];
      let start = 0;
      if (topicIndex > 0) {
        start = topicIndex - 1;
      }
      exerciseList = cacheList.slice(start, start + 3);
      this.setData({
        exerciseList,
        topicIndex,
        currentItemId: cacheList[0].id,
        total: cacheList.length,
      });
    });
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
  onLoad: function(options) {
    console.log('-------', options.type);
    this._initData(options.type);
    this._checkStar();
    this._setCircular();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
});
