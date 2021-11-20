const { post, get } = require('../utils/request1')

export function addGrade(data) {
  return post('/wx/addGrade', data)
}

export function getGradeList(data) {
  return post('/wx/getGradeList', data)
}

