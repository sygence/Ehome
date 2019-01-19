//index.js
//获取应用实例
const app = getApp()
const updateManager = wx.getUpdateManager();


const config = require("../../config/index")
const utils = require("../../utils/util")

Page({
  data: {
    // imgUrls: [
    //   '/images/photo_3.jpg',
    //   '/images/photo_2.jpg',
    //   '/images/photo_1.jpg',
    // ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    extraData: 32604
  },
  
  onLoad: function () {
    var that = this;
    wx.checkSession({
      success: function () {
        console.log('check success');
        var token = app.getSt("token", '');
        wx.setStorageSync("token", token);
        console.log(token);
        if (token == null || token == undefined || token == '') {
          wx.login({
            success: function (res) {
              if (res.code) {
                //console.log(res);
                wx.request({
                  url: getApp().globalData.svr_url + 'get_token.php',
                  method: 'POST',
                  header: { "content-type": "application/x-www-form-urlencoded" },
                  data: {
                    code: res.code,
                  },
                  success: function (resp) {
                    console.log(resp);
                    var resp_dict = resp.data;
                    if (resp_dict.err_code == 0) {
                      console.log('Set token...');
                      app.putSt('token', resp.data.data.token, 7100);
                      wx.setStorageSync('token', resp.data.data.token)
                      // that.reloadIndex();
                    } else {
                      getApp().showSvrErrModal(resp);
                    }
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          });
        } 
      },
      fail: function () {
        console.log('check fail');
        wx.login({
          success: function (res) {
            if (res.code) {
              //console.log(res);
              wx.request({
                url: getApp().globalData.svr_url + 'get_token.php',
                method: 'POST',
                header: { "content-type": "application/x-www-form-urlencoded" },
                data: {
                  code: res.code,
                },
                success: function (resp) {
                  console.log(resp);
                  var resp_dict = resp.data;
                  if (resp_dict.err_code == 0) {
                    console.log('Set token...');
                    app.putSt('token', resp.data.data.token, 7100);
                    // that.reloadIndex();
                  } else {
                    getApp().showSvrErrModal(resp);
                  }
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    }),
     
      //小程序更新
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })



   

  },
    
  

    onReady() {
        // 读取缓存，执行2小时缓存效果方案
        var home_cache = wx.getStorageSync('home_cache')
        var home_cache_times = wx.getStorageSync('home_cache_times')
        if (home_cache && home_cache_times && (new Date).getTime() - home_cache_times < 2 * 60 * 60 * 1000) {
            this.setData(home_cache)
        } else {
             this.loadData()
        }
    },

    onShow: function () {

    },
    
   
    /**
     * 加载数据
     */
    loadData(page = 1, cb) {
      console.log(app);
      console.log(app.libs)
        if (this.data.loading) return this
        this.setData({
            loading: true,
            loadend: false
        })
        app.libs.api.req("home", {page}, (err, res) => {
            this.setData({
                loading: false
            })
            if (err) {
                app.msg(err.msg)
            } else {
                this.handlerListData(res.list)
                var list = []
                if (page > 1) {
                    list = this.data.list.slice();
                }
                list = list.concat(res.list)
                this.setData({
                    list,
                    page: res.page,
                    pages: res.pages,
                    pagenext: res.pagenext,
                    loadend: res.page >= res.pages
                })

                if (page == 1) {
                    this.setData({
                        medias: (() => {
                            var len = res.medias.length
                            if (len%2 == 1) len = len - 1
                            return res.medias.slice(0, len)
                        })()
                    })
                    // 首页缓存
                    var info = {
                        list: this.data.list,
                        medias: this.data.medias,
                        page: this.data.page,
                        pages: this.data.pages,
                        pagenext: this.data.pagenext,
                        loadend: this.data.loadend
                    }
                    // 判断是否有swiper
                    if (res.swiper) {
                        res.swiper.map(item => {
                            item.img = item.Imgurl
                            delete item.Imgurl
                            delete item.Order
                            delete item.Related
                            delete item.Type
                            delete item.Status
                            delete item.ID
                        })
                        this.setData({
                            swiper: res.swiper
                        })
                        info.swiper = res.swiper
                    }
                    wx.setStorage({
                        key: "home_cache",
                        data: info
                    })
                    wx.setStorage({
                        key: "home_cache_times",
                        data: (new Date).getTime()
                    })
                }
            }
            cb && cb()
        })
    },
    
    /**
     * 处理list的数据
     */
     handlerListData(list) {
         list.map(item => {
             item.PostDate = (function() {
                 var date = new Date()
                 date.setTime(parseInt(item.PostTime)*1000)
                 return utils.formatDate(date)
             })()
         })
     },
  
     clickForum() {
       wx.navigateTo({
         url: '/pages/introduce/introduce',
       })

      //  wx.navigateToMiniProgram({
      //    appId: 'wx8abaf00ee8c3202e',
      //    // 目标为吐个槽社区小程序AppID(固定)
      //    extraData: {
      //      id: '32604',  // 来源为吐个槽上申请的产品ID 
      //      customData: {
      //        clientInfo: ' iPhone OS 10.3.1 / 3.2.0.43 / 0 ',
      //        imei: ' 7280BECE2FC29544172A2B858E9E90D0 '
      //      }
      //    }
      //  })

    },
   

  clickOfficial() {
    wx.navigateTo({
      url: '/pages/web/web',
    })

    },
  clickCB(){
    // wx.showModal({
    //   title: '温馨提示',
    //   content: '此功能暂未上线',

    // })
    wx.navigateTo({
     url: '/pages/kebiao/GetLsn',
    })

  },
  clickAchievement() {
    wx.navigateTo({
      url: '/pages/achievement/achievement',
    })

  },
  /**
    * 下拉刷新
    */
  onPullDownRefresh() {
    this.loadData(1, () => {
      app.msg("刷新成功")
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 上拉加载
   */
  onReachBottom() {
    if (!this.data.pagenext) return this
    if (this.data.page == this.data.pages) return this
    this.loadData(this.data.pagenext)
  },
  //分享功能
  onShareAppMessage() {
    var title = "欢迎使用" + config.name + "的小程序"
    if (config.share && config.share.home) {
      title = config.share.home
    }
    return {
      title,
      path: '/pages/home/index'
    }
  },
 
})