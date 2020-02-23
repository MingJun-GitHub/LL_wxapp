const app = getApp()
Page({
	data: {
		keywords: '',
		history: [],
		searchList: [],
		isSearch: false,
		pageNo: 1,
		pageSize: 20,
		isIng: false,
		isEnd: false,
		isOpen: true,
		total: 0,
		hotKey: ['羊肉']
	},
	inputKeyWords(e) {
		this.setData({
			keywords: e.detail.value
		})
	},
	openSearchHistory() {
		this.setData({
			isOpen: true
		})
	},
	closeSearchHistory() {
		this.setData({
			isOpen: false
		})
	},
	reSetData() {
		this.setData({
			pageNo: 1,
			isIng: false,
			isEnd: false,
			searchList: []
		})
	},
	// 搜索
	goSearch() {
		this.closeSearchHistory()
		this.reSetData()
		if (this.data.keywords) {
			let keywords = [...this.data.history]
			keywords.unshift(this.data.keywords)
			keywords = Array.from(new Set(keywords))
			this.setData({
				history: keywords,
				isSearch: true
			})
			wx.setStorageSync('historyKey', keywords)
			this.searchFuc()
		} else {
			wx.utils.Toast('关键词不能为空~')
		}
	},
	async searchFuc(filter) {
		this.setData({
			isIng: false
		})
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/product/serachProductInfoByKeyWords',
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				title: this.data.keywords
			}
		})
		wx.utils.hideLoading()
		this.setData({
			isIng: false,
			total: res.data.total || 0
		})
		if (res.code == 0) {
			var searchList = [...this.data.searchList, ...res.data.records]
			this.setData({
				searchList,
				isEnd: this.data.total == searchList.length 
			})
		}
		console.log('this.data', this.data)
	},
	async onReachBottom() {
		if (this.data.isEnd && this.data.isIng) {
			return
		}
		if (this.data.searchList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo + 1
			})
			await this.getReportList()
		}

	},
	// 清空
	clearHistory() {
		wx.showModal({
			title: '温馨提示',
			content: '是否删除搜索记录？',
			success: (res) => {
				if (res.confirm) {
					this.setData({
						history: []
					})
					wx.setStorageSync('historyKey', [])
				}
			}
		})
	},
	goSearchByWords(e) {
		const {
			keywords
		} = e.currentTarget.dataset
		this.setData({
			keywords
		})
		this.goSearch()
	},
	onLoad(parmas) {
		this.setData({
			history: wx.getStorageSync('historyKey') || []
		})
	},
});
