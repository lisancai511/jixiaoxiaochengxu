import Request from '../utils/http.js';
import { ERROR_ONE_ID } from '../utils/constant';
import { getErrorIdLists } from '../utils/util';
import { wrapData, saveCacheData, getCachedData } from '../utils/request';
const CLASSIC_ONE = 'classicOne';
class SubjectWrongModel extends Request {
  getSubjectOneWrong() {
    const data = getErrorIdLists(ERROR_ONE_ID);
    return this.request('/subjectOne/wrong', 'POST', data).then(res => {
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

export default SubjectWrongModel;
