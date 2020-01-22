const app = getApp()
Page({
	data: {
		toView: '',
		pageNo: 1,
		pageSize: 20,
		categoryList: [],
		goodsList: [],
		tabIndex: 0,
		loading: false
	},
	async clickScroll(e) {
		var {id,index} = e.currentTarget.dataset
		await this.getCategoryData(id)
		this.setData({
			tabIndex: index
		})
	},
	async getCategoryData(productGroupId) {
		if (this.data.loading) {
			return
		}
		wx.utils.Loading()
		this.setData({
			loading: true
		})
		const res = await wx.utils.Http.get({
			url: `/home/listProductPage`,
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				productGroupId
			}
		})
		wx.utils.hideLoading()
		this.setData({
			loading: false
		})
		if (res.code === 0) {
			this.setData({
				goodsList: res.data.records
			})
		}
		console.log('单个分类数据', res, res.data.records)
	},
	async getAllCategory() {
		const res = await wx.utils.Http.get({
			url: '/productCategory/findAllCategory'
		})
		if (res.code === 0) {
			this.setData({
				categoryList: res.data
			})
			this.getCategoryData(res.data[this.data.tabIndex].id) // 默认第一个
		}		
	},
	goGoods(e) {
		const {item} = e.currentTarget.dataset
	    wx.navigateTo({
			url: `/pages/goods/index?id=${item.id}`
		})
	},
	async onLoad(parmas) {
		// console.log(parmas)
		await this.getAllCategory()
		// this.getCategoryData(1)
	}
});
