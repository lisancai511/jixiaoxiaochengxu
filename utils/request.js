function wrapData(data) {
  const timp = new Date().getTime();
  return {
    ...data,
    timp,
  };
}

function checkTimp(data) {
  const { timp } = data;
  const currentTime = new Date().getTime();
  const fixedTime = 24 * 60 * 60;

  return currentTime - timp > fixedTime;
}

function getCachedData(key) {
  try {
    const value = wx.getStorageSync(key);
    if (value && checkTimp(value)) {
      return value;
    } else {
      return false;
    }
  } catch (e) {
    console.log('getData error', e);
  }
}

function saveCacheData(key, data) {
  try {
    wx.setStorageSync(key, wrapData(data));
  } catch (e) {
    console.log('saveCacheData error', e);
  }
}

module.exports = {
  wrapData,
  checkTimp,
  saveCacheData,
  getCachedData,
};
