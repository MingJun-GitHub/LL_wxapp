const app = getApp()
Page({
	data: {
		payType: 0,
		orderId: null,
		totalMoney: 0,
		payStatus: false,
	},
	// 查看订单
	lookOrder() {
		wx.redirectTo({
			url: `/pages/orderInfo/index?orderId=${this.data.orderId}`
		})
	},
	async goPay() {
		const status = await wx.utils.wxPay(this.data.orderId)
		if (status==1) {
			setTimeout(() => {
				this.lookOrder()
			}, 1.5e3)
		}
	},
	onLoad(parmas) {
		const {
			payType,
			orderId,
			totalMoney,
			payStatus
		} = parmas
		this.setData({
			payType,
			orderId,
			totalMoney,
			payStatus: payStatus == 'true' ? true : false
		})
	}
});
