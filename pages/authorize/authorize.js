var app = getApp();
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    info: '',
    nickName: '',
  },
  activLogin() {
    wx.showLoading({
      title: "登录中...",
      mask: true
    })
    app.libs.login.login(err => {
      wx.hideLoading()
      if (err && (err.code == 200000 || err.code == 200001)) {
        wx.showModal({
          title: '无法快速授权',
          content: '您需要打开授权设置页面，授权我们获取您公开信息。',
          confirmText: '打开设置',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  wx.request({
                    url: getApp().globalData.svr_url + "login.php",
                    method: "post",
                    header: { "content-type": "application/x-www-form-urlencoded" },
                    data: {
                      token: wx.getStorageSync("token"),
                      username: wx.getStorageSync("nickName"),
                      password: wx.getStorageSync("openid"),
                    },
                    success: function (resp) {
                      console.log(resp);
                      var resp_dict = resp.data;
                      if (resp_dict.err_code == 0) {
                        wx.showToast({
                          title: '登录成功',
                        });
                        wx.setStorage({
                          key: 'token',
                          data: resp_dict.data.token,
                        });
                        wx.setStorage({
                          key: 'login',
                          data: 1,
                        });
                        wx.setStorage({
                          key: 'username',
                          data: that.data.username,
                        })
                        // wx.switchTab({
                        //   url: "../start/start"
                        // });
                      } else {
                        getApp().showSvrErrModal(resp);
                      }
                    }
                  })
                  if (res.authSetting['scope.userInfo']) {
                    this.activLogin()
                  }
                }
              })
            }
          }
        })
      } else if (err != null) {
        wx.showModal({
          content: err.msg
        })
      } else {
        app.globalData.isLogin = true
        if (typeof app.globalData.login_cb === 'function') {
          app.globalData.login_cb()
          delete app.globalData.login_cb
        } else {
         wx.navigateBack({
            url: '/pages/start/start'
          })
        }
      }
    })
  },
  /*
 * 授权获取用户信息
 * @withCredentials 是否带上登录态信息
 * @doSuccess 成功获取用户信息的回调
 */
  authorize: function (withCredentials, doSuccess) {
    let _pageCxt = this;
    // 通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
    wx.getSetting({
      success: res => {
        // 先判断用户是否授权获取用户信息，如未授权，则会弹出授权框
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          _pageCxt.getUserInfo(withCredentials, doSuccess);
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              _pageCxt.getUserInfo(withCredentials, doSuccess);
            },
            fail() {
              wx.showToast({
                title: '授权获取信息失败',
                icon: 'loading',
                duration: 1500
              });
            }
          });
        }
      }
    });
  },

  /**
   * 获取微信用户信息
   */
  getUserInfo: function (withCredentials, doSuccess) {
    let _pageCxt = this;
    wx.getUserInfo({
      withCredentials: withCredentials,
      success: function (res) {
        _pageCxt.onSuccess(res, doSuccess);
        console.log('获取用户信息', res)
        wx.request({
          url: getApp().globalData.svr_url + "register.php",
          method: "post",
          header: { "content-type": "application/x-www-form-urlencoded" },
          data: {
            token: wx.getStorageSync("token"),
            username: encodeURI(that.data.username),
            password: that.data.password,
            email: "12312312@qq.com",
          },
          success: function (resp) {
            console.log(resp);
            var resp_dict = resp.data;
            if (resp_dict.err_code == 0) {
              wx.showToast({
                title: '登录成功',
              });
              wx.setStorage({
                key: 'token',
                data: resp_dict.data.token,
              });
              wx.setStorage({
                key: 'login',
                data: 1,
              });
              wx.setStorage({
                key: 'username',
                data: that.data.username,
              })
              // wx.switchTab({
              //   url: "../user/user"
              // });
            } else {
              getApp().showSvrErrModal(resp);
            }
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'loading',
          duration: 1200
        });
      }
    });
  },
  onSuccess: function (data, doSuccess) {
    if (typeof doSuccess == 'function') {
      doSuccess(data);
    }
  },
  bindGetUserInfo: function (e) {
    console.log('用户信息',e.detail.userInfo)
    console.log(e.detail.errMsg)
    console.log(e.detail.rawData)
    // wx.setStorageSync('userInfo', e.data.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }
  },


})