const {SUBJECT_ONE_RESULT, SUBJECT_ONE} = require('./constant')
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

module.exports = {
  getSubjectOneErrorList
};