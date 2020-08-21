// miniprogram/pages/booking/booking.js
import {isNotNull,chechLogin} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // text:"这是一个页面"
    actionSheetHidden:true,
    serviceAddress:'重庆市巴南区云峰兰亭',
    serviceName:'请选择',
    serviceTime:'请选择',
    serviceDate:[],
    phone:'',
    desc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检验是否登录
    let userPhone = chechLogin();
    console.log(userPhone);
    this.setData({
      phone: userPhone
    })
    //加载服务类型数据
    this.queryServiceDate();
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

  },
   /**
   * 获取页面资讯数据
   */
  queryServiceDate:function(){
    var that = this
    console.log("信息");
    wx.cloud.init({env:'cytravel'})
     // 1. 获取数据库引用
     const db = wx.cloud.database()
     // 2. 构造查询语句
     // collection 方法获取一个集合的引用
     // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
     // get 方法会触发网络请求，往数据库取数据
     db.collection('service').get({
       success: function(res) {
         // 输出 [{ "title": "The Catcher in the Rye", ... }]
         console.log(res.data)
       if(res.data.length!=0){
         let  arr  = that.data.serviceDate.concat(res.data)
        that.setData({
          serviceDate:arr
        })
       }
      }
     })
  },
  // 显示/隐藏遮罩层
  actionSheetbindchange:function(e){
      this.setData({
        actionSheetHidden:!this.data.actionSheetHidden
      })
  },
  selectServiceItem:function(e){
    this.setData({
      actionSheetHidden:!this.data.actionSheetHidden,
      serviceName:e.currentTarget.dataset.text
    })
  },
  // 单击“插入数据”按钮调用该函数
  insertBookingData: function () {
    //判断是否登录
    let phone = this.data.phone;
    let isLogin = isNotNull(phone);
    if (!isLogin) {
      console.log("登录");
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return;
    }
    wx.cloud.init({ env: 'cytravel' })
    // 1. 获取数据库引用
    const  db  =  wx.cloud.database()
    const cont = db.collection('booking');
    var that = this 
    cont.add({
      data: {
        desc: that.data.desc,
        serviceTime: that.data.serviceTime,
        cdate: that.getNowDate(),
        serviceName:that.data.serviceName,
        phone:that.data.phone
      },
      success: function (res) {
        console.log(res._id)
        wx.showModal({
          title: '成功',
          content: '成功插入记录',
          showCancel: false
        })
      }
    });
  },
  getNowDate:function(){
    var myDate = new Date();
    myDate.getFullYear();
    myDate.getMonth();
    myDate.getDate();
    return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,跳转页面
      // wx.switchTab({
      //   url: '/pages/home/home',    //这里填入要跳转目的页面的url
      //   success: (result) => {
      //     console.log("跳转到首页");
      //   },
      //   fail: () => { }
      // });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您拒绝了授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回”');
          }
        }
      });
    }
  }
})