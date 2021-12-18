const { getIsShowVip } = require("../../service/common");
const { isIos, getopenid } = require("../../utils/common");
const { addOrUpdateUser } = require("../../service/login");
const { setUserStorage } = require("../../utils/storage");

const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    PageCur: "simulation",
    TabCur: "1",
    showVip: false,
    vipOne: false,
    vipFour: false,
    done: false,
  },
  getPhoneNumber(e) {
    console.log(e);
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.target.id,
    });
  },
  onSlideChangeEnd(e) {
    this.setData({
      TabCur: e.detail.currentItemId,
    });
  },
  NavChange(e) {
    const PageCur = e.currentTarget.dataset.cur;
    console.log("PageCur", PageCur);
    this.setData({
      PageCur,
    });
    if (PageCur === "mine") {
      let myComponent = this.selectComponent(`#${PageCur}`); // 页面获取自定义组件实例
      myComponent.onLoad && myComponent.onLoad();
    }
  },
  async onShareAppMessage() {
    const openId = await getopenid();
    return {
      title: "新规题库，精编考题，仿真模拟，轻松get驾考知识点!",
      imageUrl: "/images/share.jpg",
      path: `/pages/index/index?shareId=${openId}`,
    };
  },
  async addOrUpdateUser() {
    const openId = await getopenid();
    const res = await addOrUpdateUser({
      openId,
    });
    setUserStorage(res.data);
    return res;
  },
  async initIcon() {
    let vipOne = false;
    let vipFour = false;
    if (isIos()) {
      const res = await getIsShowVip();
      if (res && res.showVip) {
        vipOne = true;
        vipFour = true;
        this.addOrUpdateUser();
      } else {
        const user = await this.addOrUpdateUser();
        if (user && user.data && user.data.vipOne) {
          vipOne = true;
        }
        if (user && user.data && user.data.vipFour) {
          vipFour = true;
        }
      }
    } else {
      vipOne = true;
      vipFour = true;
      this.addOrUpdateUser();
    }
    this.setData({
      vipOne,
      vipFour,
      done: true,
    });
    console.log("done", this.data.done);
    wx.setStorageSync("vipOne", vipOne);
    wx.setStorageSync("vipFour", vipFour);
  },
  onLoad(options) {
    console.log(options, 9000);
    this.initIcon();
  },
  onShow() {
    // const { PageCur } = this.data
    // const id = `#${PageCur}`
    // if (id === 'mine') {
    //   let myComponent = this.selectComponent(id); // 页面获取自定义组件实例
    //   myComponent.onLoad && myComponent.onLoad()
    // }
    // console.log('index onshow')
  },
});
