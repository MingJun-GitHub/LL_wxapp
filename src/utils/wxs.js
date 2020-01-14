import {
	promisify,
	debounce
} from './util'
import http from './request'
import triggerbus from 'triggerbus'
console.log('http://', http)

function Toast(title, duration = 2000) {
	wx.showLoading({
		title,
		icon: 'none',
		duration
	})
}

function Loading(title = '请稍后...', mask = false) {
	wx.showLoading({
		title,
		mask
	})
}

var baseObj = {}
var promisifyArr = ['showLoading', 'hideLoading']
promisifyArr.forEach(item => {
	baseObj[item] = promisify(wx[item])
})

const wxPro = {
	Toast,
	Loading,
	promisify,
	http,
	debounce,
	Bus: triggerbus(), // 来个发布订阅吧
	...baseObj
}

export default wxPro
