//app.js
const api = require('function/api')
const login = require('function/login')

App({
  onLaunch: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo;
      }
    })
    that.get_token() // 获取token
  },
  libs: {
    api,
    login
  },
  globalData: {},
  onLaunch: function () {
    // 记录网络状态
    wx.getNetworkType({
      success: res => {
        this.globalData.networkType = res.networkType
      }
    })
    wx.onNetworkStatusChange(res => {
      this.globalData.networkType = res.networkType
    })
  },
  // 进入小程序验证一次
  onShow() {
    // 进入的时候就验证一次
    // 验证登录
    console.log('验证登录')
    if (!this.globalData.isLogin) {
      console.log("用户没有登录")
      login.check(err => {
        if (err) {
          // 用户登录
          console.log(err)
          console.log("用户开始登录")
          login.login(err => {
            if (!err) this.globalData.isLogin = true
          })
        } else {
          console.log(err)
          console.log("用户已经登录")
          this.globalData.isLogin = true
        }
      });
    }
  },
  msg(content) {
    wx.showToast({
      title: content,
      icon: "none"
    })
    return this
  },
  model(content) {
    wx.showModal({
      title: "提示",
      showCancel: false,
      content
    })
    return this
  },


  get_token: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          // console.log(res);
          wx.request({
            url: getApp().globalData.svr_url + 'get_token.php',
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              token: wx.getStorageSync("token"),
              code: res.code,
            },
            success: function (resp) {
              console.log('this token :', wx.getStorageSync("token"))
              console.log('Get token...');
              console.log('',resp);
              var resp_dict = resp.data;
              if (resp_dict.err_code == 0) {
                wx.setStorage({
                  key: 'token',
                  data: resp_dict.data.token,
                  success: function () {
                    console.log('Close wechat login...');
                    /*
                    if (resp_dict.data.has_login != 1) {
                        that.wxLogin();
                    }
                    */
                  }
                })
              } else {
                that.showSvrErrModal(resp)
              }
            }
          })
        } else {
          console.log('获取用户登录状态失败！' + res.errMsg)
        }
      }
    });
  },

  wxLogin: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var username = res.userInfo.nickName;
        var avatar_url = res.userInfo.avatarUrl;
        if (username && avatar_url) {
          wx.request({
            url: getApp().globalData.svr_url + 'wx_login.php',
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              token: wx.getStorageSync("token"),
              username: username,
              avatar_url: avatar_url
            },
            success: function (resp) {
              var resp_dict = resp.data;
              if (resp_dict.err_code == 0) {
                wx.setStorage({
                  key: 'token',
                  data: resp_dict.data.token,
                })
              } else {
                that.showSvrErrModal(resp);
              }
            }
          })
        }
      }
    });
  },

  showSvrErrModal: function (resp) {
    if (resp.data.err_code != 0 && resp.data.err_msg) {
      console.log(resp.data.err_msg)
      this.showErrModal(resp.data.err_msg);
    } else {
      console.log(resp);
      wx.request({
        url: getApp().globalData.svr_url + 'report_error.php',
        method: 'POST',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          token: wx.getStorageSync("token"),
          error_log: resp.data,
          svr_url: getApp().globalData.svr_url,
        },
        success: function (resp) {
          console.log(resp);
        }
      })
    }
  },

  checkLogin: function () {
    var that = this
    wx.getStorage({
      key: 'login',
      success: function (res) {
        if (!res.data) {
          that.unLoginModal()
        }
      },
      fail: function () {
        that.unLoginModal()
      }
    })
  },

  unLoginModal: function () {
    wx.showModal({
      content: '您还没有登录，请先登录！',
      showCancel: false,
      success: function () {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  },

  showErrModal: function (err_msg) {
    wx.showModal({
      content: err_msg,
      showCancel: false
    });
  },

  /* 封装微信缓存 Api */
  putSt: function (k, v, t) {
    wx.setStorageSync(k, v)
    var seconds = parseInt(t);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(k + 'dtime', timestamp + "")
    } else {
      wx.removeStorageSync(k + 'dtime')
    }
  },
  getSt: function (k, def) {
    var deadtime = parseInt(wx.getStorageSync(k + 'dtime'))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        if (def) { return def; } else { return; }
      }
    }
    var res = wx.getStorageSync(k);
    if (res) {
      return res;
    } else {
      return def;
    }
  },
  SetColor: function (t) {
    var a = wx.getStorageSync("StyleColor");
    t.setData({
      StyleColor: a,
      NavBarHeight: wx.getSystemInfoSync().statusBarHeight
    });
  },

  globalData: {
    base_url: 'https://ehome.susmote.com/forum/',
    svr_url: 'https://ehome.susmote.com/forum//wmapi/',
    get_url:'https://ehome.susmote.com/zb_system/',
    openid:'',
    userInfo: null,
    lite_switch: false,
  },
  "networkTimeout": {
    "request": 10000,
   
  }
})
