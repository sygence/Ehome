//获取应用实例
var app = getApp();


Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    info: '',
    nickName:'',
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
                        wx.switchTab({
                          url: "../user/user"
                        });
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
          wx.switchTab({
            url: '/pages/home/index'
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
        console.log('获取用户信息',res)
        wx.request({
          url: getApp().globalData.svr_url + "register.php",
          method: "post",
          header: { "content-type": "application/x-www-form-urlencoded" },
          data: {
            token: wx.getStorageSync("token"),
            username: encodeURI(that.data.username),
            password: that.data.password,
            
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
              wx.switchTab({
                url: "../user/user"
              });
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

/**
 * 获取信息成功的回调
 */
onSuccess: function (data, doSuccess) {
    if (typeof doSuccess == 'function') {
      doSuccess(data);
    }
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    console.log(e.detail.errMsg)
    console.log(e.detail.rawData)
    console.log(e.data.userInfo)
    wx.setStorageSync('userInfo',e.data.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }
  },
 
  navInform:function (){
    wx.navigateTo({
      url: '/pages/information/information',
    })

  },
  navAuthentication: function (){
    wx.navigateTo({
      url: '/pages/user/bind',
    })

  },
  aboutAs: function () {
    wx.navigateTo({
      url: '/pages/user/about',
    })

  },
  
  
  

  //分享我们
  onShareAppMessage: function (n) {
    return {
      title: "计算机学院宿舍E家小程序，欢迎您的使用！",
      path: "/pages/home/index",
      success: function (n) { },
      fail: function (n) { }
    };
  },
  //退出登录后的提示
  changeAccount() {
    wx.showModal({
      title: '提示',
      content: '确认切换账户吗？（将会清除缓存）',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/user/bind',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  /* 动画部分 */
  util: function (currentStatu) {

    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})