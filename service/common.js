const { post, get } = require('../utils/request')
const { fetchCacheData } = require('../utils/cache')
const api = require('../api/index')

export function addGrade(data) {
  return post('/wx/addGrade', data)
}

export function getGradeList(data) {
  return post('/wx/getGradeList', data)
}
export function getStudentGrade(data) {
  return post('/wx/getStudentGrade', data)
}

export function openVip(openId = '') {
  return post('/wx/openVip', { openId })
}

export function getIsShowVip() {
  return get('/showVip')
}

export function getOneTotal() {
  return fetchCacheData('/subjectOneTotal')
}


export function getFourTotal() {
  return fetchCacheData('/subjectFourTotal')
}

export async function getSubjectTopic(kemuType = 'one', params = {}) {
  const apiMap = {
    one: api.subjectOne,
    four: api.subjectFour
  }
  const key = `${kemuType}_topic_list`
  const { offset = 0, limit = 400 } = params
  const url = `${apiMap[kemuType]}?offset=${offset}&limit=${limit}`
  const subjectMap = wx.getStorageSync(key) || {}
  if (subjectMap[url]) {
    return subjectMap[url]
  }
  const res = await get(url)
  let data = []
  if (res && res.data) {
    data = res.data.map((item, i) => {
      let { options } = item
      options = options.split(', ')
      return {
        ...item,
        index: i,
        options: options.map(opt => ({
          description: opt,
          className: '',
        })),
      }
    });
  }
  subjectMap[url] = data
  wx.setStorageSync(key, subjectMap)
  return data
}

// export function getSubjectTopic(kemuType = 'one', params = {}) {
//   const apiMap = {
//     one: api.subjectOne,
//     four: api.subjectFour
//   }
//   const key = `${kemuType}_topic_list`
//   const { offset = 0, limit = 400 } = params
//   const url = `${apiMap[kemuType]}?offset=${offset}&limit=${limit}`
//   const subjectMap = wx.getStorageSync(key) || {}
//   if (subjectMap[url]) {
//     return subjectMap[url]
//   }
//   get(url).then()
//   subjectMap[url] = res.data
//   wx.setStorageSync(key, subjectMap)
//   return res.data
// }

