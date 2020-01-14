import { flow } from 'lodash';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef

// const navigateTo = app.utils.promisify(wx.navigateTo) // promise化

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		backgroundColorTop: 'transparent'
	},
	// 事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs',
		});
	},
	handlerGobackClick() {
		console.log('ccc')
	},
	handlerGohomeClick() {
		console.log('haha')
	},
	getUserinfo(data) {
		console.log('data---', data)
	},
	getPhoneNumber(data) {
		console.log('getPhoneNumber', data)
	},
	async gousercenter() {
		// 无promise
		wx.navigateTo({
			url: '../user/user',
			success: (res)=> {
				console.log('res', res)
			},
			fail: (err) => {
				console.log('err', err)
			}
		})
		/*
		const res = await navigateTo({
			url: '../user/user'
		})
		*/
		console.log('res===', res)
		/*
		navigateTo({
			url: '../user/user'
		}).then(suc => {
			console.log('suc', suc)
		}).catch(err => {
			console.log('err', err)
		})
		*/
	},
	onPageScroll(e) {
		let {scrollTop} = e
		if (scrollTop>=100) {
			this.setData({
				backgroundColorTop: '#f12b5f'
			})
		} else {
			this.setData({
				backgroundColorTop: 'transparent'
			})
		}
	},
	async onLoad() {
		await delay();

		const log = flow(() => {
			console.log('is wechat mini program: ', __WECHAT__);
			console.log('is alipay mini program: ', __ALIPAY__);
			console.log('DEV: ', __DEV__);
		});

		log();

		// 调用应用实例的方法获取全局数据
		app.getUserInfo((userInfo) => {
			// 更新数据
			this.setData({ userInfo });
		});
	},
});
