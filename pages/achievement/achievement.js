Page({

  data: {
    index:0, 
    stu_grade:[],
    tableStyle:"show",
    year:"",
    term:''
  }, 
  
  onLoad: function (res) {
    var that=this
    if (wx.getStorageSync('result'))
    {
      console.log(wx.getStorageSync('result')) 
      that.setData({
        stu_grade: wx.getStorageSync('result')['result']['stu_grade'],
        index: wx.getStorageSync('result')['result'].length,
        year: wx.getStorageSync('result')['result']['stu_grade']['0'].year,
        term: wx.getStorageSync('result')['result']['stu_grade']['0'].term

      })
      
    } else{
     
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
          //   url: getApp().globalData.get_url + 'cmd.php?act=os_wxapi&v=v1&mode=getgrade',
          //   data: {
          //     stu_id: wx.getStorageSync("information")['result']['stu_info'].id,
          //     stu_password: '5211314'
          //   },
          //   method: 'GET',
          //   header: {
          //     'content-type': 'application/x-www-form-urlencoded' // 默认值
          //   },
          //   success: function (res) {
              

          //     that.setData({
          //       stu_grade: res.data.result.stu_grade,
          //       index: res.data.result.stu_grade.length
          //     })
          //     console.log(that.data.stu_grade)
          //     wx.setStorageSync('result', res['data'])

          //   },
          //   false: function (res) {
          //     console.log('request fail', res)

          //   }
          // })


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