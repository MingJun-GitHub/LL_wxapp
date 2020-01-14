import './utils/init'
App({
	onLaunch() {
		// console.log(camelCase('OnLaunch'));
		// 调用API从本地缓存中获取数据
		const logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);
	},
	async getUserInfo(cb) {
		if (this.globalData.userInfo) {
			typeof cb === 'function' && cb(this.globalData.userInfo);
		}
		else {
			// 调用登录接口
			wx.login({
				success: async (res) => {
					console.log('res', res)
					// wx.getUserInfo({
					// 	success: (res) => {
					// 		this.globalData.userInfo = res.userInfo;
					// 		typeof cb === 'function' && cb(this.globalData.userInfo);
					// 	},
					// });
					// const back = await wxs.http.get({
					// 	url: '/wxUser/login',
					// 	data: {
					// 		wxcode: res.code
					// 	}
					// })
					console.log('back--->', back)
				},
			});
		}
	},
	globalData: {
		userInfo: null,
	}
});
