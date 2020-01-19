Component({
	properties: {
		data: {
			type: Object,
			value: {},
		}
	},
	methods: {
		goGoods(e) {
			let {item} = e.currentTarget.dataset
			wx.navigateTo({
				url: `/pages/goods/index?id=${item.id}`
			})
		}
	}
});
