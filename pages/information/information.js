var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    stu_id:'',
    department:'',
    major:''
  },

  
  onLoad: function (options) {
    var that = this
    if (!wx.getStorageSync("information")){
    console.log(wx.getStorageSync('openid'));
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
    // wx.request({
    //   url: 'https://ehome.susmote.com/zb_system/cmd.php?act=os_wxapi&v=v1&mode=getinfo',
    //   data:{
    //     "sessionid": wx.getStorageSync('sessionid') || "",
    //      openid: wx.getStorageSync('openid'),
    //   },
    //   method:'POST',                                           
    //   header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   success: function (res) {
    //     console.log(res)
    //     wx.showToast({
    //       title: '请求成功',
    //       icon: 'success',
    //       mask: true,
    //       duration: 2000
    //     }),
    //       wx.setStorageSync("information", that.setData,),//数据缓存
          
    //       that.setData({
            
    //         name:res.data.result[0].mem_Name,
    //         stu_id: res.data.result[0].mem_Studentid,
    //         department:res.data.result[0].mem_Department,
    //         major:res.data.result[0].mem_Major
    //       }),
    //       console.log('success:', res)
    //   }
    // })
   
    //获取列表信息
    
    } else {
      wx.getStorageSync("information"),//数据缓存
        console.log(wx.getStorageSync("information"))
        that.setData({
          
          name: wx.getStorageSync("information")['result']['stu_info'].name,
          stu_id: wx.getStorageSync("information")['result']['stu_info'].id,
          department: wx.getStorageSync("information")['result']['stu_info'].class,
          major: wx.getStorageSync("information")['result']['stu_info'].major
        })

    }

    },

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