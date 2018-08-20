var app = getApp()

const config = require("../../config/index")
const utils = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    theme: '',
    token:''

    
  },
  contactImput(e) {
    this.setData({
      theme: e.detail.value
    })
  },
  contentImput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  onLoad: function () {
    
  },

  formSubmit(e) {
    var that = this;
    var formData = e.detail.value;
    var token = app.getSt("token", '');
    wx.setStorageSync("token", token)
    console.log('token获取成功', token);
    console.log('提交的数据数据为：', e.detail.value)
    wx.request({
      url: 'https://ehome.susmote.com/forum/wmapi/add_thread.php',
      data: {
        token: token,
        theme: formData['theme'],
        content: formData['content'],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(wx.getStorageSync("token"))
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
          console.log(wx.getStorageSync("token"))
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