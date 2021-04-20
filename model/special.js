import Request from '../utils/http.js';
class SpecialModel extends Request {
  getSpecialOne(type) {
    const data = { type };
    return this.request(`/${type}`, 'GET').then(res => {
      let { list = [], total } = res;
      list = list.map(item => ({
        ...item,
        options: item.options.map(opt => ({
          description: opt,
          className: '',
        })),
      }));
      return {
        ...res,
        list,
      };
    });
  }
}

export default SpecialModel;
