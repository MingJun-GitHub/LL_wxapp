const app = getApp()
import _ from 'lodash'
Page({
	data: {
		isEmpty: false,
		hasPromise: false,
		selectAddress: null,
		receiver: '',
		phone: '',
		addressDetail: '',
		sex: 0,
		addressName: '',
		sexType: [{
				name: '0',
				value: '女士',
				checked: true
			},
			{
				name: '1',
				value: '男士'
			}
		],
		markList: ['公司', '家', '学校'],
		markIndex: 0,
		isDefault: true,
		id: null,
		region: ['', '', ''],
		hasRegin: false,
		customItem: '',
		area: '',
		areaCode: '',
		city: '',
		cityCode: '',
		provice: '',
		proviceCode: '',
		latitude: null,
		longitude: null
	},
	bindInputValue(e) {
		const {
			type
		} = e.currentTarget.dataset
		this.setData({
			[type]: e.detail.value
		})
	},
	radioChange(e) {
		this.setData({
			sex: e.detail.value
		})
	},
	selectMark(e) {
		this.setData({
			markIndex: e.currentTarget.dataset.index
		})
	},
	setDefault(e) {
		this.setData({
			isDefault: e.detail.value
		})
	},
	// 保存地址
	filterData() {
		if (!this.data.receiver) {
			wx.utils.Toast('请输入正确收货人的姓名')
			return false
		}
		if (this.data.phone.length != 11) {
			wx.utils.Toast('请输入正确的手机号码')
			return false
		}
		if (!this.data.addressName) {
			wx.utils.Toast('请选择省市区')
			return false
		}
		if (!this.data.addressDetail) {
			wx.utils.Toast('请输入详情地址')
			return false
		}
		return true
	},
	async saveAddress() {
		if (!this.filterData()) {
			return
		}
		wx.utils.showLoading()
		const res = await wx.utils.Http.post({
			url: this.data.id ? '/address/updateAddress' : '/address/saveAddress',
			data: {
				addressDetail: this.data.addressDetail,
				addressName: this.data.addressName,
				isDefault: this.data.isDefault ? 1 : 0,
				mark: this.data.markList[this.data.markIndex],
				phone: this.data.phone,
				receiver: this.data.receiver,
				sex: this.data.sex,
				id: this.data.id || 0,
				provice: this.data.provice,
				proviceCode: this.data.proviceCode,
				city: this.data.city,
				cityCode: this.data.cityCode,
				area: this.data.area,
				areaCode: this.data.areaCode,
				latitude: this.data.latitude|| null,
				longitude: this.data.longitude || null
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('保存成功')
			setTimeout(() => {
				wx.navigateBack()
			}, 1500)
		} else {
			wx.utils.Toast('保存失败，请稍后重新尝试')
		}
	},
	// 删除地址
	async deleteAddress() {
		wx.showModal({
			title: '温馨提示',
			content: '是否要删除该地址？',
			success: async (res) => {
				if (res.cancel) {} else {
					wx.utils.showLoading()
					const res = await wx.utils.Http.get({
						url: `/address/deleteAddressById/${this.data.id}`
					})
					wx.utils.hideLoading()
					if (res.code == 0) {
						wx.utils.Toast('删除成功')
						setTimeout(() => {
							wx.navigateBack()
						}, 1500)
					} else {
						wx.utils.Toast('删除失败，请稍后重新尝试')
					}
				}
			},
			fail: () => {}
		})
	},
	// 选择定位
	selectLocation() {
		wx.chooseLocation({
			success: (res) => {
				if (!res.name) {
					wx.utils.Toast('请选择位置')
					return
				}
				console.log('选择地址---》', res)
				this.setData({
					addressName: res.name
				})
			},
			fail: (res) => {
				if (res.errMsg.indexOf('cancel') > -1) {
					console.log('用户没有手动选择新的定位')
				}
			}
		})
	},
	checkPromise() {
		return new Promise(resolve => {
			wx.getSetting({
				success: (res) => {
					if (_.isEmpty(res.authSetting, 'scope.userLocation') || res.authSetting[
							'scope.userLocation'] ===
						false) {
						this.setData({
							hasPromise: false
						})

						resolve()
					} else {
						this.setData({
							hasPromise: true
						})
						resolve()
					}
				},
				fail: () => {
					resolve()
				}
			})
		})
	},
	async getLocation(ischeck = false, callback) {
		ischeck && await this.checkPromise()
		wx.getLocation({
			type: 'gcj02',
			success: (e) => {
				console.log('e', e)
				this.setData({
					hasPromise: true,
					latitude: e.latitude || null,
					longitude: e.longitude || null
				})
				
				typeof callback == 'function' && callback()
			},
			fail: async () => {
				await this.checkPromise()
				// wx.utils.Toast('授权失败，请重新授权')
			}
		})
	},
	bindRegionChange(e){
		console.log('e, ', e.detail.value, e)
		var region = e.detail.value
		var code = e.detail.code
		this.setData({
			region,
			addressName: region.join(''),
			provice: region[0],
			proviceCode: code[0],
			city: region[1],
			cityCode: code[1],
			area: region[2],
			areaCode: code[2]
		})
	},
	async openSetting(e) {
		await this.checkPromise()
	},
	async onLoad(params) {
		if (params.id) {
			var editAddress = wx.getStorageSync('editAddress')
			var sexType = [...this.data.sexType]
			sexType.map(item => {
				item.checked = false
			})
			sexType[editAddress.sex].checked = true
			this.setData({
				id: editAddress.id,
				addressName: editAddress.addressName,
				addressDetail: editAddress.addressDetail,
				isDefault: !!editAddress.isDefault,
				markIndex: this.data.markList.indexOf(editAddress.mark) > -1 ? this.data.markList.indexOf(editAddress.mark) : 0,
				phone: editAddress.phone,
				receiver: editAddress.receiver,
				sex: editAddress.sex,
				sexType,
				provice: editAddress.provice,
				proviceCode: editAddress.proviceCode,
				city: editAddress.city,
				cityCode: editAddress.cityCode,
				area: editAddress.area,
				area: editAddress.areaCode,
				latitude: editAddress.latitude || null,
				longitude: editAddress.longitude || null,
				region: [editAddress.provice||'', editAddress.city||'', editAddress.area || '']
			})
		}
		this.setData({
			id: params.id
		})
		await this.getLocation()
	}
});
