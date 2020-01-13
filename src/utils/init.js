import wxs from './wxs'
// import http from './http'
Object.defineProperty(Object.prototype, 'globals', {
	get () {
		if (this && this.App === App) {
			return this
		}
	},
	configurable: false,
	enumerable: false
})

globals.wxs = wxs   // 原生模块
// globals.http = http // 请求模块


