const app = getApp()
Page({
	data: {
		toView: '',
		pageNo: 1,
		isIng: false,
		isEnd: false,
		total: 0,
		pageSize: 20,
		categoryList: [],
		goodsList: [],
		tabIndex: 0,
		categoryType: 0,
		loading: false
	},
	async clickScroll(e) {
		var {
			id,
			index
		} = e.currentTarget.dataset
		if (id == this.data.categoryType) {
			return
		}
		this.setData({
			tabIndex: index,
			categoryType: Number(id)
		})
		this.resetParams()
		await this.getCategoryData(id)
	},
	resetParams() {
		this.setData({
			isIng: false,
			isEnd: false,
			total: 0,
			pageNo: 1,
			goodsList: []
		})
	},
	async getCategoryData() {
		if (this.data.isIng || this.data.isEnd) {
			return
		}
		wx.utils.Loading()
		this.setData({
			isIng: true
		})
		const res = await wx.utils.Http.get({
			url: `/product/listProductPage`,
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				categoryType: this.data.categoryType
			}
		})
		wx.utils.hideLoading()
		this.setData({
			isIng: false,
			total: res.data.taotal
		})
		if (res.code === 0) {
			const goodsList = [...this.data.goodsList, res.data.records]
			this.setData({
				goodsList: res.data.records,
				isEnd: this.data.total == goodsList.length
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
				categoryList: res.data,
				tabIndex: 0,
				categoryType: res.data[0].id
			})
			this.getCategoryData() // 默认第一个
		}
	},
	getMoreGoodsList() {
		if(this.isEnd || this.isIng) {
			return
		}
		if (this.data.goodsList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo
			})
		}
	},
	goGoods(e) {
		const {
			item
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/goods/index?id=${item.id}`
		})
	},
	async addCollection(e) {
		let {item} = e.currentTarget.dataset
		await wx.utils.addCollect(item.id)
	},
	async onLoad(parmas) {
		await this.getAllCategory()
	}
});
