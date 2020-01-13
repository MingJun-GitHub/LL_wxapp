
function Promisify(api) {
	return (options, ...params) => {
		return new Promise((resolve) => {
			api(Object.assign({}, options, {
				success: resolve,
				fail: resolve
			}), ...params);
		});
	}
}


function Toast(title, duration = 2000) {
    wx.showLoading({
        title,
        icon: 'none',
        duration
    })
}

function Loading(title='请稍后...', mask= false) {
    wx.showLoading({
        title,
        mask
    })
}

var baseObj = {}
var promisifyArr = ['showLoading', 'hideLoading']
promisifyArr.forEach(item => {
    // console.log('item===', item)
    baseObj[item] = Promisify(wx[item])
})

const wxPro = {
    Toast,
    Loading,
    Promisify,
    ...baseObj
}

export default wxPro