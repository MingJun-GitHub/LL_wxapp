const app = getApp()
Page({
	data: {
		productInfo: '',
		productId: '',
		skuInfo:''
	},
	// 商品sku
	async getProductSku() {
		const res = await wx.utils.http.get({
			url: `/productDetail/findSkuByProductId?productId=${this.data.productId}`
		})
		if (res.code === 0) {
			this.setData({
				skuInfo: res.data
			})
		}
		console.log('商品sku信息', res)
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
	
	onLoad(parmas) {
		console.log('params', parmas.id)
		this.setData({
			productId:  parmas.id
		})
		this.getProductInfo()
		this.getProductSku()
	}
});
