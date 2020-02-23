const app = getApp()
Page({
	data: {
		payType: 0,
		orderId: null,
		totalMoney: 0
	},
	// 查看订单
	lookOrder() {
		wx.navigateTo({
			url: `/pages/orderInfo/index?orderId=${this.data.orderId}`
		})
	},
	onLoad(parmas) {
		const {
			payType,
			orderId,
			totalMoney
		} = parmas
		this.setData({
			payType,
			orderId,
			totalMoney
		})
		console.log(parmas);
	},
});
