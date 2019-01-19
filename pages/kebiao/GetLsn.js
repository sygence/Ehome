const app = getApp()
import api from'../../utils/utils.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
      listData: '',
      tabs: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      activeIndex: 0,
      timeTable:''
    
      
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
 
    
  },//切换

  getToday: function (todayClassName) {
    api.getToday({
      query: {
        name: todayClassName
      },
      success: (res) => {
        let todayWeek = api.todayInfo(res.data.startTime)
        this.setData({ activeIndex: todayWeek.day - 1 })
      

      }
    })
  },//请求当天的日期
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('information') == "" || wx.getStorageSync('information')==" "){

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
    this.getToday('today')
    console.log(wx.getStorageSync('information'))
    var data = wx.getStorageSync('information')
    var classes = data.result.stu_timetable.classes
    console.log(classes)
    // this.setData({
    //   classes: classes

    // })
   
    var timeTable=[];
    var mon = [];
    var tues = [];
    var wed=[];
    var thur=[];
    var fri=[];
    var satur=[];
    var sund=[];
    for (var i=0;i<classes.length;i++)//遍历
    {
      
      if (classes[i].timeInTheWeek=='周一'){
        
        mon.push(classes[i])
    
      }
      
      if (classes[i].timeInTheWeek == '周二') {
        
        tues.push(classes[i])

      }
      if (classes[i].timeInTheWeek == '周三') {

        wed.push(classes[i])

      }
      if (classes[i].timeInTheWeek == '周四') {

        thur.push(classes[i])

      }
      if (classes[i].timeInTheWeek == '周五') {

        fri.push(classes[i])

      }
      if (classes[i].timeInTheWeek == '周六') {

        satur.push(classes[i])

      }
      if (classes[i].timeInTheWeek == '周日') {

        sund.push(classes[i])

      }
     

    };
    
    timeTable.push(mon);
    timeTable.push(tues);
    timeTable.push(wed);
    timeTable.push(thur);
    timeTable.push(fri);
    timeTable.push(satur);
    timeTable.push(sund);
    
   
  
    console.log(timeTable);
    this.setData({
      timeTable:timeTable

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

