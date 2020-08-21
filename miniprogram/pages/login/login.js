// miniprogram/pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginText:'登录',
    verCodeText:'获取验证码',
    // 手机号
    loginPhone: '',
    // 验证码
    verCode: '',
    //验证码是否正确
    useVerCode:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },// 手机验证
  getLoginPhone: function (e) {
    let phone = e.detail.value;
    this.setData({ loginPhone: phone });
  },
  // // 验证码输入
  getVerCode: function (e) {
    this.setData({
      verCode: e.detail.value
    })
  },
  // 验证码按钮
  sendVerCode: function () {
    //let loveChange = this.data.loveChange;
    //console.log(loveChange)
    let loginPhone = this.data.loginPhone;
    console.log(loginPhone)
    if (!(/^1[34578]\d{9}$/.test(loginPhone))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    //let verCode = this.data.verCode;
    //console.log(verCode)
    let n = 59;
    let that = this;
    let verCodeTime = setInterval(function () {
      let str = n + '秒'
      that.setData({
        verCodeText: str
      })
      if (n <= 0) {
        that.setData({
          verCodeText: '重新获取'
        })
        clearInterval(verCodeTime);
      }
      n--;
    }, 1000);
    //获取验证码接口写在这里
    //例子 并非真实接口
    // app.agriknow.sendMsg(phone).then(res => {
    //   console.log('请求获取验证码.res =>', res)
    // }).catch(err => {
    //   console.log(err)
    // })
    //
    let code = this.createCode(4, 60, loginPhone);
    console.log(code);
    this.sendSMS(loginPhone,code);
  },
  //form表单提交
  formSubmit(e) {
    let val = e.detail.value
    console.log('val', val)
    var phone = val.phone //电话
    var phoneCode = val.phoneCode //验证码
    let result = this.validateCode(phone, phoneCode);
    if(result=='ok'){
      //注册成为会员
      //首先使用电话查询用户是否注册
      //没注册进行注册
      this.queryMemberDate(phone);
    }else{
      wx.showToast({
          title: '验证码错误',
          icon: 'none',
          duration: 1000
        })
    }
  },
  ///验证码工具
  //生成验证码
  createCode:function (length, seconds, number) {
    var that = this;
    //生成验证码
    var code = '';
    for (var i = 0; i < length; i++) {
      //设置随机数范围,这设置为0 ~ 9
      code += Math.floor(Math.random() * 9);
    }
    wx.setStorageSync('sms_number', number);
    wx.setStorageSync('sms_code', code);
    var expire = new Date().getTime() + seconds * 1000;
    wx.setStorageSync('sms_code_expire', expire);
    return code;
  },
//验证验证码
validateCode:function (number, code) {
    var oldNumber = wx.getStorageSync('sms_number');
    if (typeof (oldNumber) == "undefined" || oldNumber == '') {
      return 'empty';
    }
    var oldCode = wx.getStorageSync('sms_code');
    if (typeof (oldCode) == "undefined" || oldCode == '') {
      return 'empty';
    }
    if (number != oldNumber)
      return 'number_error';
    if (code != oldCode)
      return 'code_error';
    var expire = wx.getStorageSync('sms_code_expire');
    if (new Date().getTime() > expire)
      return 'code_expired';
    wx.setStorageSync('sms_number', '');
    wx.setStorageSync('sms_code', '');
    return 'ok';
  },
  /**
   * 查询用户是否存在
   */
  queryMemberDate: function (loginPhone) {
    var that = this
    console.log("信息");
    wx.cloud.init({ env: 'cytravel' })
    // 1. 获取数据库引用
    const  db  =  wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('member').where({ 
      phone: loginPhone 
    }).get({
      success:  function (res)  {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        if (res.data.length == 0) {
          that.insertMemberData(loginPhone);
        }else{
          // wx.switchTab({
          //   url: '/pages/home/home',    //这里填入要跳转目的页面的url
          //   success: (result) => {
          //     console.log("跳转到首页");
          //   },
          //   fail: () => { }
          // });
          //1.存用户信息到本地存储
          wx.setStorageSync('userPhone', loginPhone)
          //2.存用户信息到全局变量
          var app = getApp();
          app.globalData.userPhone = loginPhone;
          let pages = getCurrentPages(); //当前页面栈
          console.log(pages.length);
          if (pages.length == 1){
            console.log("首页");
            // wx.redirectTo({
            //   url: '/pages/home/home'
            // })
            wx.switchTab({
              url: '/pages/home/home',    //这里填入要跳转目的页面的url
              success: (result) => {
                console.log("跳转到首页");
              },
              fail: () => { }
            });
          }else{
            let prevPage = pages[pages.length - 2];//上一页面
            wx.navigateBack({
              delta: prevPage,//返回上一个页面
            })
          }
        }
      }
    })
  },
  insertMemberData: function (loginPhone) {
    wx.cloud.init({ env: 'cytravel' })
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    const cont = db.collection('member');
    var that = this
    cont.add({
      data: {
        phone: loginPhone,
        cdate: that.getNowDate()
      },
      success: function (res) {
        // wx.switchTab({
        //   url: '/pages/home/home',    //这里填入要跳转目的页面的url
        //   success: (result) => {
        //     console.log("跳转到首页");
        //   },
        //   fail: () => { }
        // });
        //1.存用户信息到本地存储
        wx.setStorageSync('userPhone', loginPhone)
        //2.存用户信息到全局变量
        var app = getApp();
        app.globalData.userPhone = loginPhone;
        wx.navigateBack({
          delta: 1,//返回上一个页面
        })
      }
    });
  },
  getNowDate: function () {
    var myDate = new Date();
    myDate.getFullYear();
    myDate.getMonth();
    myDate.getDate();
    return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
  },
  sendSMS:function(phone,code){
    wx.cloud.callFunction({
      name: "sendSMS",
      data: {
        phone: phone,
        code: code //生成4位的验证码
      }
    }).then(res => {
      console.log('发送成功', res)
    }).catch(res => {
      console.log('发送失败', res)
    })
  }
})