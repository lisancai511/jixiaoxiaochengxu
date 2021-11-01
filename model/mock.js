import Request from '../utils/http.js';
class MockModel extends Request {
  getMockOne() {
    return this.request('/mockSubjectOne', 'GET').then(res => {
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
  getFiftySubject() {
    return this.request('/fiftysubjectOne', 'GET');
  }
}

export default MockModel;
