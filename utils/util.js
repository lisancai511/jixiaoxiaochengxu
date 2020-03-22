const formatTime = date => {
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

const saveUserAnswer = (id, answer) => {
  let answerObj = getKeyFromStorage() || {};
  console.log('answerObj', answerObj);
  answerObj[id] = answer;
  wx.setStorageSync('answerOwnId', answerObj);
};

const getKeyFromStorage = key => {
  if (key) {
    return wx.getStorageSync(key);
  } else {
    console.error('key is not be undefined');
  }
};

const saveCollection = id => {
  const idObj = getKeyFromStorage('collectionIds') || {};
  if (id) {
    idObj[id] = id;
  }
  wx.setStorageSync('collectionIds', idObj);
  return idObj;
};

const cancelCollection = id => {
  const idObj = getKeyFromStorage('collectionIds') || {};
  if (idObj[id]) {
    delete idObj[id];
  }
  wx.setStorageSync('collectionIds', idObj);
  return idObj;
};

module.exports = {
  formatTime: formatTime,
  saveUserAnswer,
  getKeyFromStorage,
  saveCollection,
  cancelCollection,
};
