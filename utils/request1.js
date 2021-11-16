const BASE_URL = 'http://39.99.228.79:7003/api';
<<<<<<< HEAD
// const BASE_URL = 'http://127.0.0.1:7003/api';
=======
// const BASE_URL = 'http://127.0.0.1:7008/api';
>>>>>>> 94012121b262fcf57a704563598a4d9f7c6bbabb
function request(method) {
  return function (url, data = {}) {
    let user = wx.getStorageSync('user');
    const Token = (user && user.token) || '';
    console.log('Token', Token);
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method,
        data,
        // header: {
        //   'X-Token': Token,
        // },
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
          console.log(234234)
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
const get = request('GET')
const post = request('POST')

module.exports = {
  get,
  post
};
