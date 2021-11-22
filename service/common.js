const { post, get } = require('../utils/request')

export function addGrade(data) {
  return post('/wx/addGrade', data)
}

export function getGradeList(data) {
  return post('/wx/getGradeList', data)
}

