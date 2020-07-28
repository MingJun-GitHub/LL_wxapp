// 配置文件
const config = {
    // 开发环境
	development: {
		wxappId: 'wxd3b0a2e8e5bded46',
		// baseUrl: 'http://47.112.107.132:8101/shopapi'
		baseUrl: 'https://wap.suxianfood.com/shopapi'
    },
    // 生产
	production: {
		wxappId: 'wxd3b0a2e8e5bded46',
		baseUrl: 'https://wap.suxianfood.com/shopapi'
	}
} // [process.env.NODE_ENV]
export default config[process.env.NODE_ENV || 'development']