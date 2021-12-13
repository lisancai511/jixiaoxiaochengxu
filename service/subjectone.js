const { get } = require('../utils/request')
const api = require('../api/index')

export async function getServerTopicList(kemuType = 'one') {
  const apiMap = {
    one: api.subjectOne,
    four: api.subjectFour
  }
  let { data, ...other } = await get(apiMap[kemuType], { offset: 0, limit: 400 })
  data = data.map((item, i) => {
    let { options, ta } = item
    const taObj = {}
    const taList = ta.split('')
    taList.forEach(t => {
      taObj[t] = true
    })
    const taAnswer = ta.replace('1', 'A').replace('2', 'B').replace('3', 'C').replace('4', 'D')
    options = options.split(', ')
    return {
      ...item,
      index: i,
      taObj,
      taAnswer,
      options: options.map(opt => ({
        description: opt,
        className: '',
      })),
    }
  });

  return {
    ...other,
    list: data
  }
}

export async function getMockSubjectOne(kemuType = 'one') {
  const apiMap = {
    one: api.mockSubjectOne,
    four: api.mockSubjectFour
  }
  let { data, ...other } = await get(apiMap[kemuType], { limit: 10000 })
  data = data.map(item => {
    let { options } = item
    options = options.split(', ')
    return {
      ...item,
      options: options.map(opt => ({
        description: opt,
        className: '',
      })),
    }
  });
  return {
    ...other,
    list: data,
  };
}



export async function getVipTopicList(kemuType = 'one') {
  const apiMap = {
    one: api.vipOne,
    four: api.vipFour
  }
  let { data, ...other } = await get(apiMap[kemuType], { limit: 10000 })
  data = data.map(item => {
    let { options } = item
    options = options.split(', ')
    return {
      ...item,
      options: options.map(opt => ({
        description: opt,
        className: '',
      })),
    }
  });
  return {
    ...other,
    list: data,
  };
}
