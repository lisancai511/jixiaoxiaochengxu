const BASE_URL = 'https://yilianguo.com/api';

class Request {
  request(url, method = 'GET', data) {
    let user = wx.getStorageSync('user');
    const Token = (user && user.token) || '';
    console.log('Token', Token);
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method,
        data,
        header: {
          'X-Token': Token,
        },
        success(res) {
          if (res.statusCode >= 200 && res.statusCode <= 300) {
            resolve(res.data);
          } else {
            res.data.message &&
              wx.showToast({
                icon: 'none',
                title: res.data.message,
                duration: 2000,
              });
            reject(res.data);
          }
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '网络异常',
            duration: 2000,
          });
          reject(err);
        },
      });
    });
  }
}

export default Request;
