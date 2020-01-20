const app = getApp()
Page({
	data: {
		productInfo: '',
		productId: '',
		skuInfo: '',
		imgList: '',
		showSku: true,
		curStr: {},
		curSkuObj: {},
		curSelect: [0, 0, 0], // 当前选择 对应当前选择的skuid
	},
	// 商品sku
	async getProductSku() {
		const res = await wx.utils.http.get({
			url: `/productDetail/findSkuByProductId?productId=${this.data.productId}`
		})
		console.log('商品sku信息', res)
		if (res.code == 0) {
			// 默认选择第一个
			// var curSkuObj = res.data.list[0]
			// var curSelect = [s.s1, s.s2, s.s3] // 默认第一个
			// this.setData({
			// 	// skuInfo: res.data,
			// 	//curSelect: [s.s1, s.s2, s.s3], // 当前选择的sku
			// 	// curSkuObj
			// })
			// 默认选择第一个
			// var curSkuObj = res.data.list[0]
			var s = res.data.list[0]
			// var curSelect = [s['s1'], s['s2'], s['s3']] // 默认第一个
			var curSelect = [2, 5, 0]
			this.returnSelectData(res.data, curSelect)
		}

	},
	returnSelectData(data, curSelect) {
		// 选中的信息
		// console.log('data', data, curSelect)
		var reutrnData = []
		for (var i = 0; i < curSelect.length; i++) {
			console.log('data000>', i, data.tree[i]);
			if (data.tree[i]) {
				for (var k = 0; k < data.tree[i].v.length; k++) {
					if (curSelect[i] == data.tree[i].v[k].id) {
						reutrnData.push(data.tree[i].v[k])
					}
				}
			}
		}
		console.log('返回回来的数据', reutrnData)
	},
	// 商品基本信息
	async getProductInfo() {
		const res = await wx.utils.http.get({
			url: `/product/findProductInfoById?id=${this.data.productId}`
		})
		if (res.code === 0) {
			this.setData({
				productInfo: res.data
			})
		}
		console.log('商品基本信息', res, this.data.productInfo)
	},
	// 商品图片列表
	async getProductImgList() {
		const res = await wx.utils.http.get({
			url: `/productDetail/listProductDetailByProductId?productId=${this.data.productId}`
		})
		if (res.code === 0) {
			this.setData({
				imgList: res.data
			})
		}
		console.log('商品图片列表', res)
	},
	openSku() {
		this.setData({
			showSku: true
		})
	},
	async initPage() {
		this.getProductInfo()
		this.getProductSku()
		this.getProductImgList()
	},
	onLoad(parmas) {
		this.setData({
			productId: parmas.id
		})
		this.initPage()
	}
});
