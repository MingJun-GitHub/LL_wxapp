const app = getApp()
Page({
	data: {
		cartList: null,
		hasCheckedList: [],
		allCheckedStauts: false,
		totalMoney: 0
	},
	// 购物车列表
	async getCartList() {
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/buycar/listBuyCar'
		})
		if (res.code == 0) {
			res.data.map(item => {
				item.is_checked = false
			})
			this.setData({
				cartList: res.data
			})
			this.filterHasChecked()
		}
		wx.utils.hideLoading()
		console.log('购物车列表', res)
	},
	filterHasChecked() {
		var hasCheckedList = [...this.data.cartList]
		// 过滤
		hasCheckedList = hasCheckedList.filter(item => {
			return item.is_checked
		})
		this.setData({
			hasCheckedList,
			allCheckedStauts: hasCheckedList.length === this.data.cartList.length
		})
		this.getTotalMonkey()
	},
	selectSku(e) {
		const {
			index
		} = e.currentTarget.dataset
		this.setData({
			[`cartList[${index}].is_checked`]: !this.data.cartList[index].is_checked
		})
		this.filterHasChecked()
	},
	// POST /buycar/updateProductCount 题名新
	async updateProductCount(e) {
		const {
			index,
			type,
			item
		} = e.currentTarget.dataset
		let productQuantity =  this.data.cartList[index].productQuantity
		if (type == 'add') {
			productQuantity++
		} else {
			if (this.data.cartList[index].productQuantity == 1) {
				return
			}
			productQuantity--
			this.setData({
				[`cartList[${index}].sku_num`]: this.data.cartList[index].productQuantity - 1
			})
		}
		wx.utils.showLoading()
		const res = await wx.utils.Http.post({
			url: '/buycar/updateProductCount',
			data: {
				id: item.id,
				productQuantity
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			this.setData({
				[`cartList[${index}].productQuantity`]: productQuantity
			})
		} else {
			wx.utils.Toast('更新失败,请稍后重试')
		}
		this.filterHasChecked()
	},
	// 统计金额
	async getTotalMonkey() {
		var buyCarDtos = []
		this.data.hasCheckedList.map(item => {
			item.is_checked && buyCarDtos.push({
				productId: item.productId,
				productQuantity: item.productQuantity,
				skIdGroup: item.skIdGroup,
				skuMsg: ''
			})
		})
		const res = await wx.utils.Http.post({
			url: '/buycar/getBuyCarTotalMoney',
			data: buyCarDtos
		})
		this.setData({
			totalMoney: res.code == 0 ? res.data.totalMoney : 0
		})
	},
	checkedAll(e) {
		var cartList = [...this.data.cartList]
		cartList.map(item => {
			item.is_checked = !this.data.allCheckedStauts
		})
		this.setData({
			cartList,
			allCheckedStauts: !this.data.allCheckedStauts
		})
		this.filterHasChecked()
	},
	goForm() {
		console.log('this.data.hasCheckedList', this.data.hasCheckedList)
		wx.setStorageSync('skuList', this.data.hasCheckedList)
		wx.setStorageSync('buyType', 1)
		setTimeout(() => {
			wx.navigateTo({
				url: '/pages/form/index'
			})
		}, 500)
	},
	async deleteSku(e) {
		const {
			id
		} = e.currentTarget.dataset
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: `/buycar/deleteBuyCarById?id=${id}`
		})
		wx.utils.hideLoading()
		await this.getCartList()
	},
	// 购物车
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	async onShow() {
		await this.getCartList()
	}
});
