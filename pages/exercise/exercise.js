// pages/exercise/exercise.js
import ClassicModel from '../../model/classic.js';
import {
  saveUserAnswer,
  getKeyFromStorage,
  saveCollection,
  cancelCollection,
} from '../../utils/util.js';
const classicModel = new ClassicModel();
const app = getApp();
const MAX_SWIPER_LENGTH = 3;
const LIMIT_NUMS = 1;
let cacheList = [];
let currentPage = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    exerciseList: [],
    isCircular: true,
    currentItemId: '',
    total: 0,
    collection: {}, //收藏
    // 当前屏幕对应的题目索引
    topicIndex: 0,
    swiperIndex: 0,
    answerOwnId: {},
    isShowResult: false,
    buttonPage: [
      {
        title: '1-200',
      },
      {
        title: '201-400',
      },
      {
        title: '401-600',
      },
    ],
  },
  _getTopicId() {
    const idx = this.data.topicIndex;
    return cacheList[idx].id || null;
  },
  _getClassicList(data) {
    return classicModel.getClassic(data).then(res => res.list);
  },
  getDotClassName(item) {
    const { ta, id } = item;
    let answerObj = getKeyFromStorage('answerOwnId');
    // if (answerObj[id] === ta) {
    //   return 'success';
    // } else {
    //   return 'error';
    // }
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
  _toNextTopic(current) {
    let { topicIndex } = this.data;
    const idx = current + 1 > 2 ? 0 : current + 1;
    const key = 'exerciseList[' + idx + ']';
    // const casheIdx = topicIndex + 2 > cacheList.length - 1 ? 0 : topicIndex + 2;
    // const index = topicIndex === cacheList.length - 1 ? 0 : topicIndex + 1;
    // console.log('idx---', idx, topicIndex, cacheList.length, index);
    this.setData({
      [key]: cacheList[topicIndex + 2],
      topicIndex: topicIndex + 1,
    });
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
      limit: 5,
    };
    this._getClassicList(params).then(res => {
      cacheList = cacheList.concat(res);
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
      // if (resIdx % 100 === 3) {
      if (cacheList.length - resIdx === 3) {
        this._getMoreData(resIdx);
      }
      console.log('右滑', resIdx);
    } else {
      this._toLastTopic(current);
    }
  },
  collectionItem(e) {
    const currentId = this._getTopicId();
    if (currentId) {
      if (!this.data.collection[currentId]) {
        this.data.collection[currentId] = currentId;
      } else {
        delete this.data.collection[currentId];
        cancelCollection(currentId);
      }
    }
    this.setData({
      collection: this.data.collection,
    });
  },
  /**
   * 底部模态框
   */

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
    });
  },

  hideModal(e) {
    this.setData({
      modalName: null,
    });
  },
  _initAppData() {
    const collection = getKeyFromStorage('collectionIds') || {};
    cacheList = app.globalData.arrOne;
    let { topicIndex } = this.data;
    let exerciseList = [];
    let start = 0;
    if (topicIndex > 0) {
      // exerciseList = cacheList.slice(0, 3);
      start = topicIndex - 1;
    }
    exerciseList = cacheList.slice(start, start + 3);
    console.log('exerciseList', exerciseList);
    this.setData({
      exerciseList,
      topicIndex,
      currentItemId: app.globalData.arrOne[0].id,
      total: app.globalData.total,
      collection,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.type);
    this._initAppData();
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
