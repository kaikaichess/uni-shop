/*
	因为TabBar的切换任何页面都要展示购物车徽标，所以每个TabBar
	页面都要用到展示购物车徽标的代码，所以写成混入，方便引用
*/ 
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters('cart', ['total'])
	},
	methods: {
		// 设置购物车徽标
		setBadge() {
			uni.setTabBarBadge({
				index: 2, // tabbar索引
				text: this.total + '' // 注意text的值必须是字符串
			})
		}
	},
	onShow() {
		// 调用设置购物车徽标的方法
		this.setBadge()
	}
}
