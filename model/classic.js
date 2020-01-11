import Request from '../utils/http.js'
class ClassicModel extends Request {
  getClassic(data) {
    return this.request('/subjectOne', 'GET', data)
  }
  getFiftySubject(){
    return this.request('/fiftysubjectOne', 'GET')
  }
  
  
}

export default ClassicModel