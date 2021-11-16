const { get } = require('../utils/request1')
const api = require('../api/index')

export async function getSubjectOneList(params) {
  let { data, ...other } = await get(api.subjectOne, params)
  data = data.map((item, i) => {
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
  return {
    ...other,
    list: data
  }
}

export async function getMockSubjectOne(params) {
  let { data, ...other } = await get(api.mockSubjectOne, params)
  data = data.map(item => {
    let { options } = item
    options = options.split(', ')
    return {
      ...item,
      options: item.options.map(opt => ({
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

export async function getSpecialOne(type) {
  return get(`/${type}`).then(res => {
    let { data = [], ...other } = res;
    data = data.map(item => {
      let { options } = item
      options = options.split(', ')
      return {
        ...item,
        options: item.options.map(opt => ({
          description: opt,
          className: '',
        })),
      }
    });
    return {
      ...other,
      list: data,
    };
  });
}
