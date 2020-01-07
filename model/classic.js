import Request from '../utils/http.js'
class ClassicModel extends Request {
  getClassic(data) {
    return this.request('/subject', 'GET', data)
  }
  
  
}

export default ClassicModel