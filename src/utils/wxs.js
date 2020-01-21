import {
	promisify,
	debounce
} from './util'
import Http from './request'
import triggerbus from 'triggerbus'
function Toast(title, duration = 2000) {
	wx.showToast({
		title,
		mask: false,
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
	Http,
	debounce,
	Bus: triggerbus(), // 来个发布订阅吧
	...baseObj,
}

export default wxPro
