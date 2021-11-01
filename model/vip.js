import Request from '../utils/http.js';
import { wrapData, saveCacheData, getCachedData } from '../utils/request';
const CLASSIC_ONE = 'classicOne';
class VipModel extends Request {
  getVipOne() {
    return this.request('/subjectOneVip', 'GET').then(res => {
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

export default VipModel;
