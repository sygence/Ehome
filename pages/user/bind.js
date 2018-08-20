// pages/other/bind.js
var app = getApp()
const config = require("../../config/index")
const md5 = require("../../utils/md5")

Page({
    data: {
      inputPassword: false,
      student_id: '',
      password: '',
      isLoading: false,
      },
    username() {
      this.setData({
        inputPassword: false
      })
    },
    pwdFocus() {
      this.setData({
        inputPassword: true
      })
    },
       formSubmit: function (e) {
         var that=this
         that.setData({
           isLoading: true,
           duration: 15000

         })
         var objData = e.detail.value;
          console.log(objData)
          if (objData.student_id && objData.password) {
          wx.request({
            url: getApp().globalData.get_url + 'cmd.php?act=os_wxapi&v=v1&mode=gettable',
            data: {
              stu_id: objData.student_id,
              stu_password: objData.password
            },
            method: 'GET',
            
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              var toastr = require('../../utils/toastr-wxapp.js');
              console.log("学号登录", res.data.result)
              // console.log(res['data'])
              wx.setStorageSync('information', res['data'])
             
              wx.request({
                url: getApp().globalData.get_url + 'cmd.php?act=os_wxapi&v=v1&mode=getgrade',
                data: {
                  stu_id: objData.student_id,
                  stu_password: objData.password
                },
                method: 'GET',
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                
                success: function (res) {
                 
                  // wx.setStorageSync('stu_grade', res.data.result.stu_grade)
                  // console.log('成绩信息储存',res.data.result.stu_grade)
                  // console.log('整体储存',res.data)
                
                  if (res.data.result.error == '' || res.data.result.error == null ){
                    console.log("成绩获取", res)
                    wx.setStorageSync('result', res['data'])
                    that.setData({
                      isLoading: false
                    });
                    
                    
                    wx.switchTab({
                      url: '/pages/home/index',
                    })
                    
                    toastr.ok({
                      title: '登录成功',
                      duration: 1000,
                    });
                    

                  }else{
                    that.setData({
                      isLoading: false
                    });


                    wx.showToast({
                      title: '账号或密码错误',
                      icon: 'loading',
                      duration: 1000,
                      isLoading: false

                    },
                     

                   )}
                  
                  
                  
                },
                false: function (res) {
                  console.log('request fail', res)
                  wx.showToast({
                    title: '无法获取教务信息',
                    icon: 'loading',
                    duration: 1000,


                  })
                  that.setData({
                    isLoading: false,
                    duration: 1000
                  })

                }
              })

            
            },
            fail: function (res) {
              console.log('request fail', res)
              wx.showToast({
                title: '无法获取教务信息',
                icon: 'loading',
                duration: 1000,


              })
              that.setData({
                isLoading: false,
                duration: 1000
              })
            
             
              
            }
          })
         
        }else{
            var toastr = require('../../utils/toastr-wxapp.js');
            toastr.error({
              title: '不能为空',
              duration: 1000,
            });
            that.setData({
              isLoading: false,
            })

        }
          
       },
      
      onLoad() {
        //登录前清除缓存
        wx.clearStorageSync()
        console.log('清除缓存')
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#4A699F',
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
          }
        })
      }

})
