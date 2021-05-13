const {get} = require('../utils/request1')
const api = require('../api/index')

export async function getSubjectOneList(data) {
  let {list, ...other} = await get(api.subjectOne, data)
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

export async function getMockSubjectOne(data) {
  let {list, ...other} = await get(api.mockSubjectOne, data)
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

export async function getSpecialOne(type) {
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
