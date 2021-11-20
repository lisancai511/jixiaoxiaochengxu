import { ANSWER_ONE_ID_USER, ERROR_ONE_ID, SUBJECT_ONE, SUBJECT_ONE_COLLECTION } from '../utils/constant';
const formatTime = date => {
  if (!date) {
    date = new Date()
  }
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const getErrorIdLists = key => {
  let errorOneIds = getKeyFromStorage(key) || {};
  return Object.keys(errorOneIds);
};

const saveErrorAnswer = (item, answer) => {
  const { id } = item;
  let errorOneIds = getKeyFromStorage(ERROR_ONE_ID) || {};
  if (item.ta !== answer) {
    errorOneIds[id] = answer;
    wx.setStorageSync(ERROR_ONE_ID, errorOneIds);
  }
};

const saveUserAnswer = (item, answer) => {
  const { id } = item;
  let answerObj = getKeyFromStorage(ANSWER_ONE_ID_USER) || {};
  answerObj[id] = answer;
  wx.setStorageSync(ANSWER_ONE_ID_USER, answerObj);
  saveErrorAnswer(item, answer);
};

const getKeyFromStorage = key => {
  if (key) {
    return wx.getStorageSync(key);
  } else {
    console.error('key is not be undefined');
  }
};

const saveCollection = id => {
  const idObj = getKeyFromStorage(SUBJECT_ONE_COLLECTION) || {};
  if (id) {
    idObj[id] = true;
  }
  wx.setStorageSync(SUBJECT_ONE_COLLECTION, idObj);
  return idObj;
};

const cancelCollection = id => {
  const idObj = getKeyFromStorage(SUBJECT_ONE_COLLECTION) || {};
  if (idObj[id]) {
    delete idObj[id];
  }
  wx.setStorageSync(SUBJECT_ONE_COLLECTION, idObj);
  return idObj;
};

const getSubjectOneList = () => {
  const list = getKeyFromStorage(SUBJECT_ONE)
  if (list) {
    return list
  }
  return []
}

module.exports = {
  formatTime: formatTime,
  saveUserAnswer,
  getKeyFromStorage,
  saveCollection,
  cancelCollection,
  getErrorIdLists,
  getSubjectOneList
};
