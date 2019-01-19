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