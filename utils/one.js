const {SUBJECT_ONE_RESULT, SUBJECT_ONE_COLLECTION} = require('./constant')
import {getSubjectOneList} from '../utils/util'
const getSubjectOneErrorList = () => {
  const errorIndex = []
  const errorList = []
  const res = wx.getStorageSync(SUBJECT_ONE_RESULT)
  const oneList = getSubjectOneList()
  for(let key in res) {
    if(res[key] !== true) {
      errorIndex.push(key)
    }
  }
  if(errorIndex.length) {
    errorIndex.forEach(i => {
      if(oneList[i]) {
        errorList.push(oneList[i])
      }
    })
  }
  return errorList
}

const getSubjectOneCollectionList = () => {
  const topicList = []
  const collection = wx.getStorageSync(SUBJECT_ONE_COLLECTION)
  const collectionIndexList = Object.keys(collection)
  const oneList = getSubjectOneList()
  if(collectionIndexList.length) {
    collectionIndexList.forEach(i => {
      if(oneList[i]) {
        topicList.push(oneList[i])
      }
    })
  }
  return topicList
}

module.exports = {
  getSubjectOneErrorList,
  getSubjectOneCollectionList
};