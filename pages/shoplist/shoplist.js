// pages/shoplist/shoplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {},
    shopList:[],
    page: 1,
    pageSize: 10,
    total: 0,
    isLoading: false
  },

  getShopList(cb){
    this.setData({
      isLoading: true
    }),
    //展示loading效果
    wx.showLoading({
      title: '数据加载中...',
    }),
    wx.request({
      url: `https://www.escook.cn/categories/${this.data.query.id}/shops`,
      method: "GET",
      data:{
        _page: this.data.page,
        _limit: this.data.pageSize
      },
      success: (res) =>{
        console.log(res)
        this.setData({
          shopList: [...this.data.shopList, ...res.data],
          total: res.header['X-Total-Count'] - 0
        })
      },
      complete: () => {
        wx.hideLoading()
        this.setData({
          isLoading: false
        })
        // wx.stopPullDownRefresh()
        //判断用户有没有传cb这个回调函数
        cb && cb()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将传输的数据转存
    this.setData({
      query: options
    })
    //获取数据
    this.getShopList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.query.title,
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
    //需要充值关键的数据
    this.setData({
      page: 1,
      shopList: [],
      total: 0
    })
    //重新发起请求
    this.getShopList(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //判断是否还有下一页数据
    if(this.data.page * this.data.pageSize >= this.data.total){
      return wx.showToast({
        title: '数据加载完毕!',
        icon: 'none'
      })
    }
    //节流阀
    if(this.data.isLoading) return
    //页码+1
    this.setData({
      page: this.data.page+1
    })
    //获取下一页数据
    this.getShopList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})