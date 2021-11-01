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
    wrongNumber: 0,
    liIndex: 0,
    liNum: 0
  },
  /**
   * 判断滑动的方向
   * @param {number} currentIdx 当前swiper的index
   * @return true - 向右滑动 false - 向左滑动
   */
 
  
  onSlideChangeEnd(e) {
    const { current } = e.detail;
    console.log(current,e.detail.source, 50000)
    if(e.detail.source === 'touch') {
      const isright = this.isRight(current)
      let liNum = this.data.liNum
      let exerciseList = this.data.exerciseList
      if(isright) {
        liNum = liNum+1
        if(liNum>=10 && liNum%10 === 0) {
          exerciseList[3] = cacheList[liNum]
        }
        if(liNum>=10 && liNum%10 === 1) {
          exerciseList[4] = cacheList[liNum+4]
        }
        if(liNum%10 === 2) {
          exerciseList[0] = cacheList[liNum+3]
        }
        if(liNum%10 === 3) {
          exerciseList[1] = cacheList[liNum+3]
        }
        if(liNum%10 === 4) {
          exerciseList[2] = cacheList[liNum+3]
        }
        if(liNum%10 === 5) {
          exerciseList[3] = cacheList[liNum+3]
        }
        if(liNum%10 === 6) {
          exerciseList[4] = cacheList[liNum+3]
        }
        if(liNum%10 === 7) {
          exerciseList[0] = cacheList[liNum+3]
        }
        if(liNum%10 === 8) {
          exerciseList[1] = cacheList[liNum+3]
        }
        if(liNum%10 === 9) {
          exerciseList[2] = cacheList[liNum+3]
        }
        // console.log(liNum, exerciseList, 22777)
      } else {
        liNum = liNum-1
      }
      this.setData({
        liIndex: current,
        liNum,
        exerciseList
      })
    } else {
      return
    }
    
  },
  isRight(val) {
    console.log(val, this.data.liIndex, 238888888888)
    if(val === 0 && this.data.liIndex === 4) {
      return true
    } else if(val > this.data.liIndex) {
       return true
     } else {
       return true
     }
  },
 
  async _initSubject(topicIndex = 0) {
    const {list, total} = await getSubjectOne()
    // 将数据存储在内存中，不放置在data里面这里是全部的数据无需在页面渲染
    cacheList = list
    let swiperIndex = 0
    let liNum = 0
    let exerciseList = list.slice(0, 5)
    console.log(exerciseList, 3255555)
    this.setData({
      total,
      swiperIndex,
      topicIndex,
      liNum,
      exerciseList,
      currentItemId: exerciseList[0].id
    })
  },

  async _initAppData() {
    this._initSubject()
    collection = await getSubjectOneCollection()
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