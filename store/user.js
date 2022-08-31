export default {
	// 开启命名空间
	namespaced: true,
	state: {
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') ||'{}'),
		// 登录后获取的token字符串
		token: uni.getStorageSync('token') ||'',
		// 用户信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') ||'{}'),
		// 重定向的object对象（openType，from）
		redirectInfo: null
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
		},
		// 更新用户基本信息
		UPDATEUSERINFO(state, userinfo) {
			state.userinfo = userinfo
			this.commit('user/SAVEUSERINFO')
		},
		// 持久化存储用户信息
		SAVEUSERINFO(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		// 更新token字符串
		UPDATETOKEN(state, token) {
			state.token = token
			this.commit('user/SAVETOKEN')
		},
		// 持久化存储token
		SAVETOKEN(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向信息
		UPDATEREDIRECTINFO(state, info) {
			state.redirectInfo = info
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