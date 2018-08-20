// page/API/pages/faceset-search/faceset-search.js
import FacesetControl from '../../facesetcontrol/facesetcontrol.js'

Page({
  data: {
    run_type:'setsearch',
    image_type: 'BASE64',
    latitude:'',
    longitude:'',
    address:''
  },

  //获取的经纬度转换成地理位置
  loadInfo: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude : res.latitude,
          longitude : res.longitude
        }) 
        wx.setStorageSync('latitude', that.data.latitude);
        wx.setStorageSync('longitude', that.data.longitude);
        // console.log(that.data.latitude)
        // console.log(that.data.longitude)
        wx.setStorage({
          key: 'latitude',
          data: 'latitude',
        })
        console.log("定位成功");
        var locationString = res.latitude + "," + res.longitude;   //获取的经度纬度
        wx.request({
          url: 'http://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',  //根据经纬度转换成具体地址
          data: {
            "key": "YLFBZ-WHAWI-ZXUGH-53Q65-TOJ7E-ADBNQ",
            "location": locationString
          },
          method: 'GET',
          success: function (res) {
          
            console.log("位置信息:" + res.data.result.address);
            that.setData({
              address: res.data.result.address
            }) 
          },
          fail: function () {
            
            console.log("请求失败");
          },
          complete: function () {
            
            console.log("请求完成");
          }
        })
  },
  fail: function () {
    // fail
    console.log("定位失败");
  },
  complete: function () {
    // complete
    console.log("定位完成");
  }
  })
  },
  
  chooseLocation: function (e) {

    wx.chooseLocation({

      success: function (res) {

        console.log(res);
      },
    })
  },


  onLoad(options) {
    let that = this
    this.imgPath = options.imgPath
    this.facesetControl = new FacesetControl(this)
      .on('ImageChanged', (imgPath) => {
        that.imgPath = imgPath
        console.log('imgPath', imgPath)
      })
      .on('DecodeStart', (imgPath) => {
        console.log('DecodeStart', this.data.user_name)
        wx.showLoading({
          title: '解析中',
          mask: true
        },
          console.log('imgPath:', imgPath))
      })
      .on('DecodeComplete', (res) => {
        if (res.code == 0) {
          wx.showModal({
            title: '',
            content: JSON.stringify(res.data),
          })
        } else {
          console.log('解析失败：' + res)
        }
        wx.hideLoading()
      })
  },

  onReady() {
    this.facesetControl.setImage(this.imgPath)
  }, onShow: function () {

  },

  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }


})
