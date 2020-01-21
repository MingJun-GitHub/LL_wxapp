const app = getApp()
import {cloneDeep} from 'lodash'
Page({
	data: {
		productInfo: '',
		productId: '',
		skuInfo: '',
		imgList: '',
		hideSku: true,
		curSelect: [0, 0, 0], // 当前选择 对应当前选择的skuid
		selectStock: 99, // 当前选中的数量
		skuSelectData: [],
		skuSelectStr: '',
		skuSelectObj: 0,
		skuSelectIndex: 0 // 默认第一个
	},
	// 商品sku
	async getProductSku() {
		const res = await wx.utils.Http.get({
			url: `/productDetail/findSkuByProductId?productId=${this.data.productId}`
		})
		console.log('商品sku信息', res)
		if (res.code == 0) {
			var s = res.data.list[0]
			var curSelect = [s['s1'], s['s2'], s['s3']]
			this.setData({
				skuInfo: res.data,
				curSelect, // 当前选择的sku
				...this.returnSelectData(res.data, curSelect)
			})
		}
	},
	// 选中信息
	returnSelectData(data, curSelect) {
		// 选中的信息
		let skuSelectData = []
		let skuSelectStr = []
		let skuSelectIndex = -1
		let skuSelectObj = {}
		for (let i = 0; i < curSelect.length; i++) {
			if (data.tree[i]) {
				for (let k = 0; k < data.tree[i].v.length; k++) {
					if (curSelect[i] == data.tree[i].v[k].id) {
						skuSelectData.push(data.tree[i].v[k])
						skuSelectStr.push(data.tree[i].k + '-' + data.tree[i].v[k].skuValue)
						break
					} else {
						continue
					}
				}
			}
		}
		for (let i = 0; i < data.list.length; i++) {
			var keys = data.list[i]
			if (keys.s1 == curSelect[0] && keys.s2 == curSelect[1] && keys.s3 == curSelect[2]) {
				// 相等，获取index
				skuSelectIndex = i
				skuSelectObj = keys
				if (this.data.selectStock > skuSelectObj.stockNum) {
					console.log('haha--->', haha)
					this.setData({
						selectStock: skuSelectObj.stockNum
					})
				}
				break
			} else {
				continue
			}
		}
		if (!skuSelectStr.length) {
			skuSelectStr = '暂无规格可以选，请查看其它商品'
		} else {
			skuSelectStr = skuSelectStr.join(' ')
		}
		return {
			skuSelectData,
			skuSelectStr,
			skuSelectIndex,
			skuSelectObj
		}
	},
	selectSku(e) {
		const {
			sku,
			index
		} = e.currentTarget.dataset
		let curSelect = cloneDeep(this.data.curSelect)
		curSelect[index] = sku.id
		const {
			skuSelectData,
			skuSelectIndex,
			skuSelectStr,
			skuSelectObj
		} = this.returnSelectData(this.data.skuInfo, curSelect)
		if (skuSelectIndex == -1) {
			wx.utils.Toast('该规格不存在，请重新选择')
			return
		} else {
			this.setData({
				curSelect,
				skuSelectData,
				skuSelectIndex,
				skuSelectStr,
				skuSelectObj
			})
		}
	},
	calcStock(e) {
		const {
			type
		} = e.currentTarget.dataset
		if (type === 'reduce') {
			if (this.data.selectStock <= 1) {
				return
			}
			this.setData({
				selectStock: this.data.selectStock - 1
			})
		} else {
			if (this.data.selectStock == this.data.skuSelectObj.stockNum) {
				return
			}
			this.setData({
				selectStock: this.data.selectStock + 1
			})
		}
	},
	// 商品基本信息
	async getProductInfo() {
		const res = await wx.utils.Http.get({
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
		const res = await wx.utils.Http.get({
			url: `/productDetail/listProductDetailByProductId?productId=${this.data.productId}`
		})
		if (res.code === 0) {
			this.setData({
				imgList: res.data
			})
		}
		console.log('商品图片列表', res)
	},
	changePoupop() {
		this.setData({
			hideSku: !this.data.hideSku
		})
	},
	toCart() {
		console.log('toCart')
		if (this.data.skuInfo.tree.length) {
			this.changePoupop()
		} else {
			
		}	
	},
	toBuy() {
		if (this.data.skuInfo.tree.length) {
			this.changePoupop()
		} else {
			
		}
	},
	// 添加购物车
	addCart() {
		wx.utils.Toast('添加成功-仅测试用')
	},
	quickBuy() {
		wx.navigateTo({
			url: '/pages/order/index'
		})
	},
	onShareAppMessage() {
		return {
			title: `好东西也分享给你，快来买，手快有，手慢无`,
			path: `pages/goods/index?id=${this.data.productId}`,
			imageUrl: this.data.productInfo.thumb
		}
	},
	async initPage() {
		this.getProductSku()
		this.getProductImgList()
		await this.getProductInfo()
	},
	async onLoad(parmas) {
		this.setData({
			productId: parmas.id
		})
		await this.initPage()
		wx.setNavigationBarTitle({
			title: this.data.productInfo.title
		})
	}
});
