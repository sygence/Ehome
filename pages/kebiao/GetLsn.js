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
      classes:'',
      monday:''
      
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
    this.getToday('today')
    console.log(wx.getStorageSync('information'))
    var data = wx.getStorageSync('information')
    var classes = data.result.stu_timetable.classes
    console.log(classes)
    // this.setData({
    //   classes: classes

    // })
    
    var kebiao=new Array;
    var name = [[], [], [], [], [] ];
    var teacher = [[], [], [], [], [],];
    var timeInTheTerm = [[], [], [], [], [],];
    var location = [[], [], [], [], [],];
    var temp = [];
    var monday = [[], [], [], []];
    var timeInTheDay = new Array(7)
    for (var i = 0; i < classes.length;i++)
    {
      
      // if (classes[i].timeInTheWeek == '周一')
      // {
      //   console.log(classes[i].name)
        
      //   console.log(classes[i].timeInTheDay)
      //   console.log(classes[i].timeInTheTerm)
      //   console.log(classes[i].location)
        
      // }
      if (classes[i].timeInTheWeek =="周一"){
        if (classes[i].timeInTheDay == "第1,2节")
        {
          name[0].unshift(classes[i].name)
          teacher[0].unshift(classes[i].teacher)
        }
       
        if (classes[i].timeInTheDay == "第3,4节") {
          name[1].unshift(classes[i].name)
          teacher[1].unshift(classes[i].teacher)
        }
        
        if (classes[i].timeInTheDay == "第5,6节") {
          name[2].unshift(classes[i].name)
          teacher[2].unshift(classes[i].teacher)
        }
        if (classes[i].timeInTheDay== "第7,8节") {
          name[3].unshift(classes[i].name)
          teacher[3].unshift(classes[i].teacher)
        }
        if (classes[i].timeInTheDay == "第9,10节") {
          name[4].unshift(classes[i].name)
          teacher[4].unshift(classes[i].teacher)
        }
        

      }
      
      // if (classes[i].timeInTheWeek == '周二') {
      //   console.log('周二',classes[i].name)
      //   console.log('周二',classes[i].timeInTheDay)
      //   console.log('周二',classes[i].timeInTheTerm)
      //   console.log('周二',classes[i].location)

      // }
     
    }
    monday[0].unshift(name);
    monday[1].unshift(teacher);
    console.log(name)
    console.log(teacher)
    this.setData({
      monday: monday

    })
    console.log(monday)
    console.log(monday[0][0])


  
    
   
    // console.log(name)
    // console.log(timeInTheDay)
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

