const app = getApp()
Page({
	data: {
		pageNo: 1,
		orderStatus: 7,
		pageSize: 10,
		isIng: false,
		isEnd: false,
		total: 0,
		orderList: []
	},
	resetParams() {
		this.setData({
			isIng: false,
			isEnd: false,
			total: 0,
			orderList: []
		})
	},
	async getOrderList() {
		console.log('start-->')
		if (this.data.isIng || this.data.isEnd) {
			return
		}
		this.setData({
			isIng: true
		})
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/orderDetail/findPage',
			data: {
				pageNo: this.data.pageNo,
				orderStatus: this.data.orderStatus,
				pageSize: this.data.pageSize,
			}
		})
		this.setData({
			isIng: false,
			total: res.data.total
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			var orderList =  [...this.data.orderList, ...res.data.records]
			this.setData({
				orderList,
				isEnd: this.data.total == orderList.length
			})
		}
	},
	async onReachBottom() {
		if (this.data.isEnd || this.data.isIng) {
			return
		}
		if (this.data.orderList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo + 1
			})
			await this.getOrderList()
		}
	},
	selectTab(e) {
		const {
			status
		} = e.currentTarget.dataset
		this.setData({
			orderStatus: Number(status)
		})
		this.resetParams()
		this.getOrderList()
	},
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	goOrderInfo(e) {
		const {
			id
		} = e.currentTarget.dataset
		wx.navigateTo({
			url:`/pages/orderInfo/index?orderId=${id}`
		})
	},
	onLoad(parmas) {
		console.log(parmas);
		let {
			status
		} = parmas
		if (status) {
			status = Number(status)
		} else {
			status = 7
		}
		this.setData({
			orderStatus: status
		})
		this.getOrderList()
	},
});
