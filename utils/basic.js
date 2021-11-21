const { VIP, ERROR, COLLECTION, EXERCISE } = require('./constant')
const topic = {
  one: {
    vip: VIP,
    error: ERROR,
    collection: COLLECTION,
    exercise: EXERCISE
  },
  four: {
    vip: VIP,
    error: ERROR,
    collection: COLLECTION,
    exercise: EXERCISE
  }
}

function createBasicInfo(kemuType) {
  const topicMap = topic[kemuType]
  let specialInfo = {}
  for (let key in topic) {
    specialInfo[key] = {
      total: topicMap[key].ids.length,
      topicIndex: 0,
      successNumber: 0,
      wrongNumber: 0,
      result: {}
    }
  }
  return specialInfo
}