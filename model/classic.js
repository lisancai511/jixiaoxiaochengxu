import Request from '../utils/http.js';
import { wrapData, saveCacheData, getCachedData } from '../utils/request';
const CLASSIC_ONE = 'classicOne';
class ClassicModel extends Request {
  getClassic(data) {
    const { page = 1 } = data;
    return this.request('/subjectOne', 'GET', data).then(res => {
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
  // getClassic(data) {
  //   const value = getCachedData(CLASSIC_ONE);
  //   const {page = 1} = data
  //   if (value) {
  //     return Promise.resolve(value[page]);
  //   } else {
  //     return this._getClassic(data);
  //   }
  // }
  getFiftySubject() {
    return this.request('/fiftysubjectOne', 'GET');
  }
}

export default ClassicModel;
