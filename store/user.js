export default {
	// 开启命名空间
	namespaced: true,
	state: {
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') ||'{}')
	},
	
	actions: {},
	
	mutations: {
		// 更新收货地址
		UPDATEADDRESS(state, address) {
			state.address = address
			this.commit('user/SAVEADDRESS')
		},
		// 持久化存储收货地址
		SAVEADDRESS(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},
	
	getters: {
		addstr(state) {
			// 用address中是否有provinceName属性来判断address是否为空
			if(!state.address.provinceName) return ''
			// 如果address不为空则返回地址的字符串拼接
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}