export default {
	// 开启命名空间
	namespaced: true,
	state: {
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	},
	actions: {
		addToCart({commit}, goods) {
			commit('ADDTOCART', goods)
		},
	},
	mutations: {
		// 将商品添加到购物车
		ADDTOCART(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			if(findResult) {
				// 如果购物车中已经有这件商品，则让它的数量+1
				findResult.goods_count++
			} else {
				// 如果购物车中没有该商品则把该商品添加到购物车中
				state.cart.push(goods)
			}
			// 将购物车数据持久化存储
			this.commit('cart/SAVETOSTORAGE')
		},
		// 将购物车数据持久化存储
		SAVETOSTORAGE(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		UPDATEGOODSSTATE(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			if(findResult) {
				findResult.goods_state = goods.goods_state
				this.commit('cart/SAVETOSTORAGE')
			}
		},
		// 更新购物车中商品的数量
		UPDATEGOODSNUMBER(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			if(findResult) {
				findResult.goods_count = goods.goods_count
				this.commit('cart/SAVETOSTORAGE')
			}
		},
		// 从购物车中删除商品
		REMOVEGOODSBYID(state, goods_id) {
			state.cart = state.cart.filter(item => item.goods_id !== goods_id)
			this.commit('cart/SAVETOSTORAGE')
		}
	},
	getters: {
		// 计算购物车中商品的总数
		total(state) {
			let num = 0
			state.cart.forEach(item => num += item.goods_count)
			return num
		}
	}
	
}