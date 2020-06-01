const app = getApp()
Page({
	data: {
		userInfo: null,
		isLogin: false,
		hasPhone: ''
	},
	goLogin() {
		if (this.data.isLogin) {
			return
		}
		wx.navigateTo({
			url: '/pages/login/index'
		})
	},
	goBindPhone() {
		wx.navigateTo({
			url: '/pages/login/index?opt=phone'
		})
	},
	goLoginCall(cb) {
		if (this.data.isLogin) {
			cb()
		} else {
			wx.navigateTo({
				url: '/pages/login/index'
			})
		}
	},
	goAddressList() {
		this.goLoginCall(() => {
			wx.navigateTo({
				url: '/pages/address/index'
			})
		})
	},
	goMyCollect() {
		this.goLoginCall(() => {
			wx.navigateTo({
				url: '/pages/collection/index'
			})
		})	
	},
	goOrderList(e) {
		const {
			status
		} = e.currentTarget.dataset

		this.goLoginCall(() => {
			wx.navigateTo({
				url: `/pages/order/index?status=${status}`
			})
		})

	},
	noOpen() {
		wx.utils.Toast('暂无开通')
	},
	async init() {
		wx.utils.showLoading()
		await wx.utils.Login.initUserInfo()
		this.setData({
			userInfo: wx.utils.Login.userInfo,
			isLogin: wx.utils.Login.isLogin,
			phone: wx.utils.Login.mobilePhone
		})
		console.log('userInfo', this.data.userInfo)
		wx.utils.hideLoading()
	},
	async onShow() {
		await this.init()
	}
});
