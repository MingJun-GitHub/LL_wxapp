const app = getApp()
Page({
	data: {
		isEmpty: false,
		addressList: [],
		isSelect: false
	},
	async getAddressList() {
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/address/listAddressByUserId'
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			this.setData({
				addressList: res.data.data
			})
		}
		console.log('res', res)
	},
	paySelect(e) {
		const {
			type
		} = e.currentTarget.dataset
		this.setData({
			payType: type
		})
	},
	goAddressEdit(e) {
		const {
			item
		} = e.currentTarget.dataset
		wx.setStorageSync('editAddress', item)
		item.id && wx.navigateTo({
			url: `/pages/addressEdit/index?id=${item.id}`
		})
	},
	goNewAddress() {
		if (this.data.addressList.length >= 20) {
			wx.utils.Toast('最多保存20条地址')
			return
		}
		wx.navigateTo({
			url: `/pages/addressEdit/index`
		})
	},
	// 设置新的地址
	async setDefault(e) {
		const {
			item,
			index
		} = e.currentTarget.dataset
		if (item.isDefault) {
			this.data.isSelect && wx.navigateBack()
			return
		} else {
			item.isDefault = 1
			wx.utils.showLoading()
			const res = await wx.utils.Http.post({
				url: '/address/updateAddress',
				data: {
					...item
				}
			})
			wx.utils.hideLoading()
			if (res.code == 0) {
				await this.getAddressList()
				if (this.data.isSelect) {
					wx.navigateBack()
				} else {
					wx.utils.Toast('设置成功')
				}
			} else {
				wx.utils.Toast(this.data.isSelect ? '选择失败，请重新选择' : '设置失败')
				this.setData({
					[`addressList[${index}].isDefault`]: 0
				})
			}
		}
	},
	onLoad(query) {
		this.setData({
			isSelect: query.type == 'select'
		})
		wx.setNavigationBarTitle({
			title: this.data.isSelect ? '选择地址' : '收货地址'
		})
	},
	async onShow() {
		await this.getAddressList()
	}
});
