const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const saveUserAnswer = (id, answer) => {
  let answerObj = getUserAnswer() || {}
  console.log('answerObj', answerObj)
  if (!answerObj[id]) {
    answerObj[id] = answer
  }
  wx.setStorageSync('answerOwnId', answerObj)
}

const getUserAnswer = (key = 'answerOwnId') => {
  return wx.getStorageSync(key)
}

module.exports = {
  formatTime: formatTime,
  saveUserAnswer,
  getUserAnswer
}

