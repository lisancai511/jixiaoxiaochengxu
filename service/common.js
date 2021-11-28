const { post, get } = require('../utils/request')

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

