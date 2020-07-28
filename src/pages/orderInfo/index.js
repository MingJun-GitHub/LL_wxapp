const app = getApp()
Page({
	data: {
		orderId: '',
		orderInfo: null,
		address: null
	},
	async getOrderInfo() {
		// wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/orderDetail/findOrderDetailByOrderId',
			data: {
				orderId: this.data.orderId
			}
		})
		// wx.utils.hideLoading()
		if (res.code ==0) {
			var address = JSON.parse(res.data.receiveAddress)
			console.log('address', address)
			this.setData({
				orderInfo: res.data,
				address
			})
		}
	},
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	// 等微信支付
	async goPay() {
		await wx.utils.wxPay(this.data.orderId)
		this.getOrderInfo()
	},
	async onLoad(parmas) {
		const {
			orderId
		} = parmas
		this.setData({
			orderId
		})
		this.getOrderInfo()
	}
});
