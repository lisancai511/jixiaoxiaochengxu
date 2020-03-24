import Request from '../utils/http.js';

class CollectionModel extends Request {
  getColectOne(data) {
    return this.request('/subjectOne/collection', 'POST', data).then(res => {
      let { list = [] } = res;
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
  getColectFour(data) {
    return this.request('/subjectFour/collection', 'POST', data).then(res => {
      let { list = [] } = res;
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

export default CollectionModel;
