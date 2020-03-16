import Request from '../utils/http.js';
class ClassicModel extends Request {
  getClassic(data) {
    return this.request('/subjectOne', 'GET', data).then(res => {
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
  getFiftySubject() {
    return this.request('/fiftysubjectOne', 'GET');
  }
}

export default ClassicModel;
