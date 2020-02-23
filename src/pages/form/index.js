const app = getApp()
Page({
	data: {
		skuList: [],
		address: null,
		payType: 0,
		goodsMoney: 0,
		totalMoney: 0,
		expressName: [],
		expressList: [],
		expressIndex: 0,
		buyType: 1,
		mark: '',
		isIphoneHair: wx.utils.isIphoneHair
	},
	paySelect(e) {
		const {
			type
		} = e.currentTarget.dataset
		this.setData({
			payType: Number(type)
		})
	},
	// 选择收货地址
	selectAddress() {
		wx.navigateTo({
			url: `/pages/address/index?type=select`
		})
	},
	// 获取快递费用
	// GET /pay/getExpressFee
	async getExpressFee() {
		const res = await wx.utils.Http.get({
			url: '/pay/getExpressFee'
		})

		if (res.code == 0) {
			var expressName = []
			console.log('express', res.data)

			res.data.forEach(item => {
				expressName.push(item.expressTypeName)
			})
			this.setData({
				expressList: res.data,
				expressName
			})
		}
	},
	expressChange(e) {
		this.setData({
			expressIndex: e.detail.value
		})
		var totalMoney = this.data.goodsMoney + Number(this.data.expressList[this.data.expressIndex].fee)
		this.setData({
			totalMoney
		})
	},
	setMarkInfo(e) {
		this.setData({
			mark: e.detail.value
		})
	},
	// 获取地址
	async getAddressList() {
		console.log('获取地址')
		const res = await wx.utils.Http.get({
			url: '/address/listAddressByUserId'
		})
		if (res.code == 0) {
			this.setData({
				address: res.data.data[0] || null
			})
		}
	},
	async getTotalMoney() {
		var buyCarDtos = []
		this.data.skuList.map(item => {
			buyCarDtos.push({
				productId: item.productId,
				productQuantity: item.productQuantity,
				skIdGroup: item.skIdGroup,
				skuMsg: item.skuMsg //item.skuMsg
			})
		})
		console.log('buycardtos', buyCarDtos)
		const res = await wx.utils.Http.post({
			url: '/buycar/getBuyCarTotalMoney',
			data: buyCarDtos
		})
		var goodsMoney = res.code == 0 ? res.data.totalMoney : 0
		var totalMoney = goodsMoney + Number(this.data.expressList[this.data.expressIndex].fee)
		this.setData({
			totalMoney,
			goodsMoney
		})
	},
	// 生成订单
	async createOrder() {
		if (!this.data.address) {
			wx.utils.Toast('请先选择收货地址')
			return
		}
		// // 生成订单
		// if (this.data.payType == 0) {
		// 	wx.utils.Toast('微信支付暂时不支持...')
		// 	return
		// }
		wx.utils.showLoading()
		let buyType = this.data.buyType == 1 ? 1 : 2
		let buyCars = buyType == 1 ? [...this.data.skuList] : []
		let {
			productId,
			productQuantity,
			skIdGroup,
			skuMsg
		} = this.data.skuList[0]
		// 判断直接购买还是购特车购买
		const res = await wx.utils.Http.post({
			url: '/pay/createOrder',
			data: {
				buyCars,
				buyType, //  1购物车提交,2 直接购买
				payType: this.data.payType, //  0是微信，1是货到付款
				receiveAddress: JSON.stringify(this.data.address),
				productId,
				productQuantity,
				skIdGroup,
				skuMsg,
				mark: this.data.mark,
				expressId: this.data.expressList[this.data.expressIndex].id
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			if (res.data.orderId) {
				await this.orderCallBack(res.data.orderId)
				wx.removeStorageSync('skuList')
				wx.removeStorageSync('buyType')
				wx.redirectTo({
					url: `/pages/payResult/index?orderId=${res.data.orderId}&totalMoney=${res.data.totalMoney}&payType=${this.data.payType}`
				})
			} else {
				wx.utils.Toast('创建订单失败，请稍后再试...')
			}
		} else {
			x.utils.Toast('创建订单失败，请稍后再试...')
		}
	},
	async orderCallBack(orderId) {
		const res = await wx.utils.Http.post({
			url: this.data.payType == 0 ? '/pay/createWeiXinOrder' : '/pay/payOffLine',
			data: {
				orderId
			}
		})
		console.log('订单回调', res)
	},
	onShow() {
		this.getAddressList()
	},
	async onLoad(params) {
		const skuList = wx.getStorageSync('skuList')
		const buyType = wx.getStorageSync('buyType')
		this.setData({
			skuList,
			buyType
		})
		await this.getExpressFee()
		await this.getTotalMoney()
	}
});
