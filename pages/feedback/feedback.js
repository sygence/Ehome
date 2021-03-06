var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    contact:''
  },
  contactImput(e){
    this.setData({
       contact:e.detail.value
    })
  },
  contentImput(e) {
    this.setData({
      content:e.detail.value
    })
  },
  
  formSubmit(e){
    if (wx.getStorageSync("information")) {
    var that = this;
    var formData = e.detail.value;
    var index = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.request({
      url: 'https://eh.susmote.com/zb_system/cmd.php?act=os_wxapi&v=v1&mode=feedback',
      data: {
        content: formData['content'],
        contact: formData['contact'],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.code === 100000) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            mask: true,
            duration: 2000
          })

          wx.reLaunch({
            url: '/pages/home/index',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'loading',
            duration: 1000
          })

        }
      }, fail() {
        wx.showToast({
          title: '提交错误',
          icon: 'loading'
        })
      }
    })
    
    }else{
      wx.showModal({
        title: '提示',
        content: '请先使用教务系统登录账户',
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

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync("information")) {
      wx.showModal({
        title: '提示',
        content: '请先使用教务系统登录账户否则提交失败',
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
