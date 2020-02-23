const app = getApp()
Page({
	data: {
		pageNo: 1,
		pageSize: 10,
		isIng: false,
		isEnd: false,
		total: 0,
		collectList: [] // 收藏列表
	},
	resetParams() {
		this.setData({
			pageNo: 1,
			pageSize: 10,
			isIng: false,
			isEnd: false,
			total: 0,
			collectList: []
		})
	},
	// 收藏列表
	async getCollectList() {
		if (this.data.isIng || this.data.isEnd) {
			return
		}
		this.setData({
			isIng: true
		})
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/myStore/listMyStore',
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize
			}
		})
		this.setData({
			isIng: false,
			total: res.data.total
		})
		if (res.code == 0) {
			const collectList = [...this.data.collectList, ...res.data.records]
			this.setData({
				collectList,
				isEnd: this.data.total == collectList.length
			})
		}
		wx.utils.hideLoading()
		console.log('收藏列表==>', res)
	},
	async onReachBottom() {
		if (this.data.isEnd && this.data.isIng) {
			return
		}
		if (this.data.searchList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo + 1
			})
			await this.getCollectList()
		}
	},
	goGoods(e) {
		const {
			item
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/goods/index?id=${item.productId}`
		})
	},
	async removeCollect(e) {
		const {
			item,
			index
		} = e.currentTarget.dataset
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: `/myStore/deleteMyStore/${item.id}`
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			let collectList = [...this.data.collectList]
			collectList.splice(index, 1)
			this.setData({
				collectList
			})
			wx.utils.Toast('移除成功')
		} else {
			wx.utils.Toast('移除失败，请重新尝试')
		}
		console.log('res', res)
	},
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	async onShow() {
		this.resetParams()
		await this.getCollectList()
		/*
		if (!this.data.collectList.length) {
			this.resetParams()
			await this.getCollectList()
		}
		*/
	}
});
