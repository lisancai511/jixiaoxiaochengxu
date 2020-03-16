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
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    exerciseList: [],
    cacheList: [],
    currentItemId: null,
    total: 0,
    collection: {}, //收藏
    topicIndex: 0,
    currentPage: 1,
    currentIdx: 0,
    swiperIndex: 0,
    lastIdx: 0,
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
    const { topicIndex, cacheList } = this.data;
    if (current === 2 && (topicIndex === 2 || topicIndex > 2)) {
      this.setData({
        'exerciseList[0]': cacheList[topicIndex + 1],
        topicIndex: topicIndex + 1,
      });
      console.log(this.data.exerciseList.map(item => item.id));
      return false;
    }
    if (current === 0 && topicIndex > 2) {
      this.setData({
        'exerciseList[1]': cacheList[topicIndex + 1],
        topicIndex: topicIndex + 1,
      });
      console.log(this.data.exerciseList.map(item => item.id));
      return false;
    }
    if (current === 1 && topicIndex > 2) {
      this.setData({
        'exerciseList[2]': cacheList[topicIndex + 1],
        topicIndex: topicIndex + 1,
      });
      console.log(this.data.exerciseList.map(item => item.id));
      return false;
    }
  },
  onSlideChangeEnd(e) {
    console.log('e', e);
    const { currentItemId, current } = e.detail;
    console.log('current', current);
    let isRight = this._checkSwipeDirec(current);
    if (isRight) {
      this._toNextTopic(current);
    }
    this.setData({
      swiperIndex: current,
      currentItemId,
    });
  },
  collectionItem(e) {
    if (!this.data.collection[this.data.currentItemId]) {
      this.data.collection[this.data.currentItemId] = this.data.currentItemId;
      saveCollection(this.data.currentItemId);
    } else {
      delete this.data.collection[this.data.currentItemId];
      cancelCollection(this.data.currentItemId);
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
    const collection = getKeyFromStorage('collectionIds');
    const cacheList = app.globalData.arrOne;
    let { topicIndex } = this.data;
    let exerciseList = [];
    if (topicIndex === 0) {
      exerciseList = cacheList.slice(0, 3);
      topicIndex = 2;
    } else {
      exerciseList = cacheList.slice(topicIndex - 1, topicIndex + 2);
      topicIndex = topicIndex + 1;
    }
    this.setData({
      cacheList,
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
