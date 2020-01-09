import Request from '../utils/http.js'
class ClassicModel extends Request {
  getClassic(data) {
    return this.request('/subject', 'GET', data)
  }
  getFiftySubject(){
    return this.request('/fiftysubject', 'GET')
  }
  
  
}

export default ClassicModel