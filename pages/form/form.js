var app = getApp();
Page({
  data: {
    showTopTips: false,
    pickerHidden: false,
    chosen: '',
    formData:'',
    name: '',
    stu_id: '',
    department: '',
    major: '',
    array: ["计算机学院", "商学院", "艺术学院", "环化学院", "体育学院","机械工程学院","电子工程学院","汽车工程学院","信息学院"],
    objectArray: [
      {
        id: 0,
        name: '计算机学院'
      },
      {
        id: 1,
        name: '商学院'
      },
      {
        id: 2,
        name: '艺术学院'
      },
      {
        id: 3,
        name: '环化学院'
      },
      {
        id: 4,
        name: '体育学院'
      },
      {
        id: 5,
        name: '机械工程学院'
      },
      {
        id: 6,
        name: '电子工程学院'
      },
      {
        id: 7,
        name: '汽车工程学院'
      },
      {
        id: 8,
        name: '信息学院'
      },
    ],
    arrayMajor: ["软件技术", "计算机网络技术", "计算机信息管理", "信息安全与管理", "物联网应技术", "数字媒体应用技术", ],
    Major: [
      {
        id: 0,
        name: '软件技术'
      },
      {
        id: 1,
        name: '计算机网络技术'
      },
      {
        id: 2,
        name: '计算机信息管理'
      },
      {
        id: 3,
        name: '信息安全与管理'
      },
      {
        id: 4,
        name: '物联网应技术'
      },
      {
        id: 5,
        name: '数字媒体应用技术'
      },
      
    ],
    
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      department: e.detail.value
    })
  },
  bindPickerChangeMajor: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      major: e.detail.value
    })
  },
  onLoad:function(res){
    // wx.getStorageSync("information")
    // console.log(wx.getStorageSync("information"))
    // this.setData({
      
    //   name: wx.getStorageSync("information")['result']['stu_info'].name,
    //   stu_id: wx.getStorageSync("information")['result']['stu_info'].id,
    //   department: wx.getStorageSync("information")['result']['stu_info'].class,
    //   major: wx.getStorageSync("information")['result']['stu_info'].major
    // })

  },
  
  
 
  
  formSubmit: function (e) {
    // if (wx.getStorageSync("information")){
    console.log(wx.getStorageSync('openid'));
    var that = this;
    var formData = e.detail.value;
    var index = e.detail.value;
   

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.request({
      url: 'https://ehome.susmote.com/zb_system/cmd.php?act=os_wxapi&v=v1&mode=reg',
      data: {
        "sessionid": wx.getStorageSync('sessionid') || "",
        openid: wx.getStorageSync('openid'),
        name : formData['name'],
        stu_id: formData['stu_id'],
        gender: formData['gender'],
        department: this.data.array[formData['department']],
        major: this.data.arrayMajor[formData['major']],
        class:formData['class'],
        dormitory:formData['dormitory'],
        room:formData['room'],
        qqnumber:formData['qqnumber'],
        phonenumber: formData['phonenumber']
      },
      method:"POST",
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(wx.getStorageSync('sessionid'))
        console.log(wx.getStorageSync('openid'))
        console.log(res.data.code)
        // wx.request({
        //   url: 'https://ehome.susmote.com/forum//wmapi/register.php',
        //   method: "POST",
        //   header: { "content-type": "application/x-www-form-urlencoded" },
        //   data: {
        //     token: wx.getStorageSync("token"),
        //     username: wx.getStorageSync('nickName'),
        //     password: wx.getStorageSync('openid'),
        //     email: formData['qqnumber'] + "@qq.com",
            
        //   },
        //   success: function (resp) {
        //     console.log('注册信息提交成功',wx.getStorageSync('nickName'));
        //     console.log('账号注册',resp);
        //     console.log('注册成功的返回值',resp.data.err_code)
        //     var resp_dict = resp.data;
        //     if (resp.data.err_code == 0) {
        //       wx.showToast({
        //         title: '登录成功',
        //       });
        //       // wx.setStorage({
        //       //   key: 'token',
        //       //   data: resp_dict.data.token,
        //       // });
        //       wx.setStorage({
        //         key: 'login',
        //         data: 1,
        //       });
        //       // wx.setStorage({
        //       //   key: 'username',
        //       //   data: that.data.username,
        //       // })
        //       wx.switchTab({
        //         url: "../home/index"
        //       });
        //     } else {
        //       getApp().showSvrErrModal(resp);
        //     }
        //   }
        // })
        if (res.data.code === 100000){
          wx.showToast({
            title: '请求成功',
            icon: 'success',
            mask: true,
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/home/index'
          })
          var toastr = require('../../utils/toastr-wxapp.js');
          toastr.ok({
            title: '登录成功',
            duration: 1000,
          });
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'loading',
            duration: 1000
            
          })
          
          
        }
          wx.setStorage({
            key: "account",
            data: formData
          }),//数据缓存
          that.setData({
            pickerHidden: true
          }),
          console.log('success:',res)
      }
    })
  // }else{
  //     wx.showModal({
  //       title: '提示',
  //       content: '请先使用教务系统登录账户',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           wx.navigateTo({
  //             url: '/pages/user/bind',
  //           })
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  // }
  

  }
  
});
