import { getSubjectOneErrorList } from '../../utils/one'
const MAX_SWIPER_LENGTH = 3;
let cacheList = [];
let collection = {};
let timer = null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topicCacheKey: {
      type: String,
      value: ''
    },
    topicIndex: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 0
    },
    collectionKey: {
      type: String,
      value: ''
    },
    successNumber: {
      type: Number,
      value: 0
    },
    wrongNumber: {
      type: Number,
      value: 0
    },
    // hasCollected: {
    //   type: Boolean,
    //   value: false
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    exerciseList: [],
    // 是否循环
    isCircular: true,
    renderModal: false,
    swiperIndex: 0,
    answerOwnId: {},
    hasCollected: false,
    isShowResult: false,
    classicList: [],
    answerList: [],
    showActionsheet: true,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击每一个选项
    clickItem(e) {
      const { item, index, optidx } = e.currentTarget.dataset;
      let { topicIndex, exerciseList, isShowResult, swiperIndex } = this.data
      const { own_res } = exerciseList[index];
      let key = 'answerList[' + topicIndex + ']';
      let value = {
        index: topicIndex,
        class: ''
      }
      if (!own_res && !isShowResult) {
        this.data.exerciseList[index].own_res = optidx + 1 + '';
        if (Number(optidx) + 1 == Number(item.ta)) {
          value.className = 'success'
          const params = {
            topicIndex,
            res: true
          }
          swiperIndex = swiperIndex + 1 > 2 ? 0 : swiperIndex + 1
          exerciseList[index].options[item.ta - 1].className = 'success';
          this.setData({
            [key]: value,
            exerciseList
          })
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            this.setData({
              swiperIndex
            })
            this._toNextTopic(swiperIndex);
            this._setCircular();
            this._checkStar();
          }, 400)
          this.triggerEvent('checkOptionItem', params)
        } else {
          value.className = 'error'
          const params = {
            topicIndex,
            res: optidx + ''
          }
          exerciseList[index].options[optidx].className = 'error';
          exerciseList[index].options[item.ta - 1].className = 'success';
          this.setData({
            [key]: value,
            exerciseList
          });
          this.triggerEvent('checkOptionItem', params)
        }

      }
    },
    gotoItem(e) {
      const { index } = e.target.dataset
      this.triggerEvent("jumpToItem", index)
      this._jumpToSubject(index)
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
              _this._slideItem(current - 1)
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
      this.triggerEvent('slideItem', topicIndex + 1)
      this.setData({
        [key]: topicInfo,
      });
    },
    // 上一道题目
    _toLastTopic(current) {
      let { topicIndex } = this.data;
      topicIndex = topicIndex - 1 < 0 ? 0 : topicIndex - 1
      const idx = current - 1 < 0 ? 2 : current - 1;
      const key = 'exerciseList[' + idx + ']';
      this.triggerEvent('slideItem', topicIndex)
      this.setData({
        [key]: cacheList[topicIndex - 1] || {}
      });
    },
    _setCircular() {
      let { topicIndex, isCircular } = this.data;
      if (topicIndex <= 1 || topicIndex > cacheList.length - 1) {
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
      // console.log(this.data.exerciseList)
      // console.log(this.data.exerciseList.map(item => item.index))
      this._setCircular();
      this._checkStar();
    },
    // 滑动滑块结束
    onSlideChangeEnd(e) {
      const { current, source } = e.detail;
      if (source === 'touch') {
        if (timer) {
          clearTimeout(timer)
        }
        this._slideItem(current)
      }
    },
    _getTopicId() {
      const { topicIndex } = this.data
      const id = cacheList[topicIndex] && cacheList[topicIndex].id
      return id || null
    },
    collectionItem(e) {
      const key = this._getTopicId()
      console.log(key, collection)
      if (key) {
        this.triggerEvent("toggleCollect", key)
        this._checkStar(true);
      }
    },
    _checkStar(showMsg = false) {
      const { collectionKey } = this.data
      collection = wx.getStorageSync(collectionKey) || {}
      console.log('col', collection)
      const key = this._getTopicId()
      console.log('key', key)
      const hasStar = !!collection[key];
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

    /**
     * 底部模态框
     */

    showModal(e) {
      console.log(e);
      const {
        total
      } = this.data;
      this.setData({
        modalName: e.currentTarget.dataset.target,
        // renderModal: true
      });
    },

    hideModal() {
      this.setData({
        modalName: null,
        // renderModal: false
      });
    },
    // 根据当前的topicIndex 判断swiper的index
    _getSwiperIndexByTopicIndex(topicIndex = 0) {
      return topicIndex % MAX_SWIPER_LENGTH
    },
    _getInitTopicIndex(topicIndex = 0) {
      // 兼容处理
      if (topicIndex < 0) {
        topicIndex = 0
      }
      if (topicIndex > cacheList.length - 1) {
        topicIndex = cacheList.length - 1
      }
      return topicIndex
    },
    _getPageTopicList(topicIndex, cacheList) {
      topicIndex = this._getInitTopicIndex(topicIndex)
      let exerciseList = [];
      let start = 0
      let end = start + MAX_SWIPER_LENGTH
      let restIndex = this._getSwiperIndexByTopicIndex(topicIndex)
      if (topicIndex === 0) {
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
      return exerciseList
    },
    async _jumpToSubject(topicIndex) {
      const exerciseList = this._getPageTopicList(topicIndex, cacheList)
      // console.log(exerciseList.map(item => item.index))
      const swiperIndex = this._getSwiperIndexByTopicIndex(topicIndex)
      this.setData({
        exerciseList,
        swiperIndex
      })
      this._checkStar()
      this._setCircular()
    },
    getCacheList() {
      const { topicCacheKey } = this.data
      switch (topicCacheKey) {
        case 'SUBJECT_ONE_ERROR':
          return getSubjectOneErrorList()
        default:
          return wx.getStorageSync(this.data.topicCacheKey) || []
      }

    },
    async _initTopicData() {
      cacheList = this.getCacheList()
      const { topicIndex } = this.data
      const exerciseList = this._getPageTopicList(topicIndex, cacheList)
      const swiperIndex = this._getSwiperIndexByTopicIndex(topicIndex)
      this._checkStar()
      this._setCircular()
      this.setData({
        exerciseList,
        swiperIndex
      })
      this._renderModal()
    },
    _renderModal() {
      const list = cacheList.map((item, index) => ({
        index,
        className: item.className
      }))
      this.setData({
        answerList: list,
        renderModal: true
      })
    }
  },
  detached: function () {
    if (timer) {
      clearTimeout(timer)
    }
  }
})
