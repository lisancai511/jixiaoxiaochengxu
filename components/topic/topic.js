import { getTopicListByType } from '../../utils/specialOne'
import { getTopicListByKey, filterListByMap } from '../../utils/common'
import { getVipTopicList } from '../../service/subjectone'
import { getTopicClassName } from '../../utils/cache'
import vipTopicMap from '../../utils/vip'
const MAX_SWIPER_LENGTH = 3;
let cacheList = [];
let collection = {};
let timer = null
let errorKey = ''
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    kemuType: {
      type: String,
      value: 'one'
    },
    specialType: {
      type: String,
      value: ''
    },
    from: {
      type: String,
      value: 'one'
    },
    topicIndex: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 0
    },
    successNumber: {
      type: Number,
      value: 0
    },
    wrongNumber: {
      type: Number,
      value: 0
    },
    isShowRecite: {
      type: Boolean,
      value: true
    }
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
    bottomHeight: 280
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      return 'aaa'
    },
    transAnswer(ansStr) {
      const ansList = []
      ansStr.split('').sort((a, b) => a - b).forEach(item => {
        console.log('ii', item)
        const itemMap = {
          1: 'A',
          2: 'B',
          3: 'C',
          4: 'D',
        }
        ansList.push(itemMap[item])
      })
      return ansList.join('')
    },
    handleOk(e) {
      const { index } = e.currentTarget.dataset;
      let { topicIndex, exerciseList, isShowResult, swiperIndex } = this.data
      const { mul_own_res = '0', ta = '', id, options } = exerciseList[index]
      const params = {
        topicId: id,
        res: mul_own_res === ta
      }
      if (mul_own_res < 10) {
        wx.showToast({
          icon: 'none',
          title: '请至少选择两个选项',
          duration: 1000,
        });
        return
      }
      const successOptIdx = ta.split('')
      if (mul_own_res === ta) {
        successOptIdx.forEach(item => {
          options[item - 1].className = 'success'
        })
      } else {
        options.forEach((item, i) => {
          if (successOptIdx.indexOf(i + 1 + '') > -1) {
            item.className = 'success'
          } else {
            item.className = 'error'
          }
        })
      }
      exerciseList[index].options = options
      exerciseList[index].own_res = mul_own_res
      const resAnswer = this.transAnswer(mul_own_res)
      exerciseList[index].resAnswer = resAnswer
      this.setData({
        exerciseList
      })
      if (mul_own_res === ta) {
        swiperIndex = swiperIndex + 1 > 2 ? 0 : swiperIndex + 1
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
      } else {
        const errorStorage = wx.getStorageSync(errorKey) || {}
        if (errorStorage[id] == undefined) {
          errorStorage[id] = true
          wx.setStorageSync(errorKey, errorStorage)
        }
      }
      console.log(params)
      this.triggerEvent('checkOptionItem', params)
      console.log(exerciseList[index])
    },
    // 点击每一个选项
    clickItem(e) {
      const { item, index, optidx } = e.currentTarget.dataset;
      let { topicIndex, exerciseList, isShowResult, swiperIndex } = this.data
      const { mul_own_res = '', own_res, id, Type, ta } = exerciseList[index];
      let key = 'answerList[' + topicIndex + ']';
      let value = {
        index: topicIndex,
        className: ''
      }
      console.log("id>", exerciseList[index])
      if (Type === '3') {
        if (!exerciseList[index].options[optidx].className) {

          exerciseList[index].options[optidx].className = 'warn';
          const curRes = optidx + 1 + ''
          const exitedRes = mul_own_res || ''
          exerciseList[index].mul_own_res = exitedRes + curRes
          this.setData({
            exerciseList
          })
        }

      } else {
        if (!own_res && !isShowResult) {
          this.data.exerciseList[index].own_res = optidx + 1 + '';
          const resAnswer = this.transAnswer(optidx + 1 + '')
          this.data.exerciseList[index].resAnswer = resAnswer
          if (Number(optidx) + 1 == Number(item.ta)) {
            value.className = 'success'
            const params = {
              topicId: exerciseList[index].id,
              res: true
            }
            swiperIndex = swiperIndex + 1 > 2 ? 0 : swiperIndex + 1
            exerciseList[index].options[item.ta - 1].className = 'success';
            exerciseList[index].className = 'success'
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
              topicId: exerciseList[index].id,
              res: optidx + ''
            }
            const errorStorage = wx.getStorageSync(errorKey) || {}
            if (!errorStorage[id]) {
              errorStorage[id] = true
              wx.setStorageSync(errorKey, errorStorage)
            }
            console.log(exerciseList[index])
            exerciseList[index].className = 'error'
            exerciseList[index].options[optidx].className = 'error';
            exerciseList[index].options[item.ta - 1].className = 'success';
            this.setData({
              [key]: value,
              exerciseList
            });
            this.triggerEvent('checkOptionItem', params)
          }
          console.log(value)
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
      console.log('current', current)
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
      this._setCircular();
      this._checkStar();
      console.log('item', cacheList[this.data.topicIndex])
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
      const { kemuType } = this.data
      const collectionKey = `${kemuType}_COLLECTION`
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
      const result = this.getTopicResult()
      const answerList = this._getAnswerList(result)
      console.log(answerList[this.data.topicIndex])
      this.setData({
        modalName: e.currentTarget.dataset.target,
        answerList
      });
    },

    hideModal() {
      this.setData({
        modalName: null
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
    getVipTopicList(kemuType) {
      console.log('in==')
      const key = `${kemuType}_TOPIC`
      const allList = wx.getStorageSync(key) || []
      const list = filterListByMap(allList, vipTopicMap[kemuType])
      console.log('ll--', list)
      return list || []
    },
    getCacheList() {
      const { kemuType, from, specialType } = this.data
      let key = `${kemuType}_${from}`
      switch (from) {
        case 'ERROR':
          return getTopicListByKey(key)
        case 'COLLECTION':
          return getTopicListByKey(key)
        case 'SPECIAL':
          return getTopicListByType(kemuType, specialType)
        case 'VIP':
          return this.getVipTopicList(kemuType)
        case 'MOCK':
          key = `${kemuType}_${from}_TOPIC`
          const result = this.getTopicResult()
          const list = wx.getStorageSync(key) || []
          return getTopicClassName(list, result)
        default:
          key = `${kemuType}_TOPIC`
          return wx.getStorageSync(key) || []
      }
    },
    setHeight() {
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let num = 0
      if (windowHeight < 600) {
        num = 290
      }
      if (windowHeight < 650 && windowHeight > 600) {
        num = 310
      }
      if (windowHeight < 700 && windowHeight > 650) {
        num = 340
      }
      if (windowHeight < 750 && windowHeight > 700) {
        num = 370
      }
      if (windowHeight < 800 && windowHeight > 750) {
        num = 390
      }
      if (windowHeight < 850 && windowHeight > 800) {
        num = 420
      }
      if (windowHeight < 900 && windowHeight > 850) {
        num = 450
      }
      if (windowHeight < 950 && windowHeight > 900) {
        num = 470
      }
      this.setData({
        bottomHeight: num
      })
    },
    setErrorKey() {
      const { kemuType } = this.data
      errorKey = `${kemuType}_ERROR`
      console.log('errorKey', errorKey)
    },
    async _initTopicData() {
      this.setErrorKey()
      cacheList = this.getCacheList()
      this.setHeight()
      const { topicIndex } = this.data
      const exerciseList = this._getPageTopicList(topicIndex, cacheList)
      const swiperIndex = this._getSwiperIndexByTopicIndex(topicIndex)
      this._checkStar()
      this._setCircular()
      const result = this.getTopicResult()
      const answerList = this._getAnswerList(result)
      this.setData({
        exerciseList,
        swiperIndex,
        answerList,
        renderModal: true
      })
    },
    filterTopicClassName(result) {
      return cacheList.map((item, index) => {
        if (index === this.data.topicIndex) {
          console.log(item)
        }
        let { className, id } = item
        if (result[id] != undefined) {
          className = result[id] === true ? 'success' : 'error'
        }
        return {
          index,
          className
        }
      })
    },
    getTopicResult() {
      const { kemuType, from, specialType } = this.data
      let key = `${kemuType}_${from}_RESULT`
      let result = wx.getStorageSync(key)
      if (from === 'SPECIAL') {
        const title = {
          one: 'ONE',
          four: 'FOUR'
        }
        key = `${title[kemuType]}_${from}`
        const special = wx.getStorageSync(key) || {}
        result = special[specialType] && special[specialType].result
      }
      return result
    },
    _getAnswerList(result) {
      return this.filterTopicClassName(result)
    }
  },
  detached: function () {
    if (timer) {
      clearTimeout(timer)
    }
  },
  onLoad: function () {
    console.log(23424, this.data.kemuType)
  }
})
