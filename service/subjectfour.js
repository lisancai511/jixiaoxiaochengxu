const { get } = require('../utils/request')
const api = require('../api/index')

export async function getSubjectFourList(data) {
  let { list, ...other } = await get(api.subjectFour, data)
  list = list.map(item => ({
    ...item,
    options: item.options.map(opt => ({
      description: opt,
      className: '',
    })),
  }));
  return {
    ...other,
    list
  }
}

export async function getMockSubjectFour(data) {
  let { list, ...other } = await get(api.mockSubjectFour, data)
  list = list.map(item => ({
    ...item,
    options: item.options.map(opt => ({
      description: opt,
      className: '',
    })),
  }));
  return {
    ...other,
    list,
  };
}

export async function getSpecialFour(type) {
  return get(`/${type}`).then(res => {
    let { list = [], ...other } = res;
    list = list.map(item => ({
      ...item,
      options: item.options.map(opt => ({
        description: opt,
        className: '',
      })),
    }));
    return {
      ...other,
      list,
    };
  });
}
