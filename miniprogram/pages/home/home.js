// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPage:0,
    pageSize:2,
    informationDates:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryInformationDate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    /**
   * 获取页面资讯数据
   */
  queryInformationDate:function(){
    var that = this
    wx.cloud.init({env:'cytravel'})
     // 1. 获取数据库引用
     const db = wx.cloud.database()
     // 2. 构造查询语句
     // collection 方法获取一个集合的引用
     // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
     // get 方法会触发网络请求，往数据库取数据
     db.collection('information').skip(that.data.startPage).limit(that.data.pageSize).get({
       success: function(res) {
         // 输出 [{ "title": "The Catcher in the Rye", ... }]
         console.log(res.data)
       if(res.data.length!=0){
         let  arr  = that.data.informationDates.concat(res.data)
        that.setData({
          informationDates:arr
        })
       }
      }
     })
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
      this.data.startPage = (this.data.startPage+1)*this.data.pageSize;
      this.queryInformationDate();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})