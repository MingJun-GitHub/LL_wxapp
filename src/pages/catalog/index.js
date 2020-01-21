const app = getApp()
Page({
	data: {
		toView: '',
		pageNo: 1,
		pageSize: 20,
		categoryList: [],
		goodsList: [],
	},
	clickScroll: function (e) {
		var id = e.currentTarget.dataset.id
		this.getCategoryData(id)
		// this.setData({
		// 	toView: id
		// })
		// clickScroll
		// console.log(e.currentTarget.dataset);
	},
	async getCategoryData(productGroupId) {
		const res = await wx.utils.Http.get({
			url: `/home/listProductPage`,
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				productGroupId
			}
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
		}		
	},
	async onLoad(parmas) {
		console.log(parmas)
		await this.getAllCategory()
		this.getCategoryData(11)
	}
});
