// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page({
	data: {
		goodsList: [],
		backgroundColorTop: 'transparent'
	},
	// 事件处理函数
	goSearch() {
		wx.navigateTo({
			url: '/pages/search/index',
		});
	},
	getUserinfo(data) {
		console.log('data---', data)
	},
	getPhoneNumber(data) {
		console.log('getPhoneNumber', data)
	},
	onPageScroll(e) {
		let {scrollTop} = e
		if (scrollTop>=100) {
			this.setData({
				backgroundColorTop: '#f12b5f'
			})
		} else {
			this.setData({
				backgroundColorTop: 'transparent'
			})
		}
	},
	// 获取首页商品列表
	async getHomeGoodsList() {
		const res = await wx.utils.http.get({url: `/home/listProductPage?pageNo=1&pageSize=20&productGroupId=2`});
		// console.log('res--->', res, res.code === 0);
		if (res.code==0) {
			this.setData({
				goodsList: res.data.records
			})
			console.log('res.code', this.data.goodsList)
		}
	},
	async onLoad() {
		await this.getHomeGoodsList();
	}
});
