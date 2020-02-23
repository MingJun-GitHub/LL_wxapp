class Login {
	// 初始化
	constructor() {
		this.loginPromise = ''
		this.isBind = false
		this.phone = '' // 是否有电话 
		this.token = ''
		this.sessionKey = ''
		this.userInfo = null
	}
	async initUserInfo(cb) {
		if (!this.loginPromise) {
			this.loginPromise = new Promise(async resolve => {
				if (this.userInfo) {
					typeof cb === 'function' && cb(this.userInfo)
					resolve(this.userInfo)
				} else {
					const loginInifo = wx.getStorageSync('loginInfo')
					if (loginInifo) {
						this.token = loginInifo.token
						this.sessionKey = loginInifo.sessionKey
						await this.getUserInfo()
						resolve(this.userInfo)
						return
					}
					wx.login({
						success: async (res) => {
							const result = await wx.utils.Http.get({
								url: '/wxUser/login',
								data: {
									wxcode: res.code
								}
							})
							if (result.code == 0) {
								wx.setStorageSync('loginInfo', result.data)
								this.token = result.data.token
								this.sessionKey = result.data.sessionKey
							} else {
								this.clearUserInfo()
							}
							await this.getUserInfo()
							resolve(this.userInfo)
						}
					})
				}
			})
		}
		return this.loginPromise
	}
	async reloadLogin() {	
		this.loginPromise = null
		this.clearUserInfo()
		await this.initUserInfo()
	}
	async getPhone() {
		return this.phone
	}
	async simpleLogin() {
		this.loginPromise = null
		await this.getUserInfo()
	}
	clearUserInfo() {
		// wx.clearStorageSync('loginInfo')
		this.userInfo = ''
		this.isBind = false
		this.phone = ''
	}
	async checkBind() {
		console.log('检查bind')
		const res = await wx.utils.Http.get({
			url: '/wxUser/isGetUserInfo',
			header: {
				token: this.token
			}
		})
		if (res.code == 0) {
			this.isBind = res.data
			return res.data
		} else {
			this.isBind = false
			return false
		}
	}
	// 获取用户信息
	async getUserInfo(filter = false) {
		await this.checkBind()
		if (!this.isBind && this.filter) {
			wx.navigateTo({
				url: '/pages/login/index'
			})
			return
		}
		const res = await wx.utils.Http.get({
			url: '/wxUser/getUserInfoById',
			header: {
				token: this.token
			}
		})
		if (res.code == 0) {
			if (this.isBind) {
				this.userInfo = res.data
				this.phone = this.userInfo.phone
			} else {
				this.clearUserInfo()
			}
			return res.data
		} else {
			return null
		}
	}
}

export default new Login()