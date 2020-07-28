function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return (
		[year, month, day].map(formatNumber).join('/') +
		' ' + [hour, minute, second].map(formatNumber).join(':')
	);
}

export function dateFtt(fmt, date) { //author: meizz   
	var o = {
		"M+": date.getMonth() + 1, //月份   
		"d+": date.getDate(), //日   
		"h+": date.getHours(), //小时   
		"m+": date.getMinutes(), //分   
		"s+": date.getSeconds(), //秒   
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
		"S": date.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * 
 * @param {* api } api 
 * promis化
 */
export function promisify(api) {
	return (options, ...params) => {
		return new Promise((resolve) => {
			api(Object.assign({}, options, {
				success: resolve,
				fail: resolve
			}), ...params);
		});
	}
}

export function debounce(fn, wait) {
	var timeout = null;
	return function () {
		if (timeout !== null) clearTimeout(timeout)
		timeout = setTimeout(fn, wait)
	}
}

export function addCollect(productId) {
	return new Promise(async (resolve) => {
		if (!wx.utils.Login.isLogin) {
			wx.navigateTo({
				url: `/pages/login/index`
			})
			return
		}
		wx.utils.showLoading()
		const res = await wx.utils.Http.post({
			url: '/myStore/addMyStore',
			data: {
				productId
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('收藏成功')
		} else {
			wx.utils.Toast('收藏失败')
		}
		resolve(res.code)
	})

}


export function wxPay(orderId) {
	return new Promise(async resolve => {
		const res = await wx.utils.Http.post({
			url: `/pay/createWeiXinOrder?orderId=${orderId}`
		})
		if (res.code == 0) {
			const data = res.data
			const params = {
				timeStamp: data.timeStamp,
				nonceStr: data.nonceStr,
				package: data.packageValue,
				signType: data.signType || 'MD5',
				paySign: data.paySign
			}
			wx.requestPayment({
				...params,
				success(res) {
					// 成功
					wx.utils.Toast('支付成功，请耐心等待商家发货')
					resolve(1)
				},
				fail(res) {
					wx.utils.Toast('请完成微信支付，以免影响商家发货')
					resolve(2)
				}
			})
		} else {
			wx.utils.Toast('系统错误，无法发起微信支付')
			resolve(0) // 失败
		}
	})

}
