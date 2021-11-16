const { SUBJECT_ONE_RESULT, SUBJECT_ONE_COLLECTION } = require('./constant')
import { getSubjectOneList } from '../utils/util'
const getSubjectOneErrorList = () => {
  const errorList = []
  const res = wx.getStorageSync(SUBJECT_ONE_RESULT)
  const oneList = getSubjectOneList()
  oneList.forEach(item => {
    const { id } = item
    if (res[id] !== true) {
      errorList.push(item)
    }
  })
  return errorList
}

const getSubjectOneCollectionList = () => {
  const topicList = []
  const collection = wx.getStorageSync(SUBJECT_ONE_COLLECTION)
  const oneList = getSubjectOneList()
  oneList.forEach(item => {
    const { id } = item
    if (collection[id] !== true) {
      topicList.push(item)
    }
  })
  return topicList
}

module.exports = {
  getSubjectOneErrorList,
  getSubjectOneCollectionList
};