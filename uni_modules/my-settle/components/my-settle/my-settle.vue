<template>
	<view class="my-settle-container">
		<!-- 全选框 -->
		<label class="radio" @click="changeAllState">
			<radio color="#c00000" :checked="isFullCheck"/><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
				// 倒计时秒数
				seconds: 3,
				// 定时器
				timer: null
			}
		},
		methods: {
			...mapMutations('cart', ['UPDATEALLGOODSSTATE']),
			...mapMutations('user', ['UPDATEREDIRECTINFO']),
			// 全选
			changeAllState() {
				this.UPDATEALLGOODSSTATE(!this.isFullCheck)
			},
			// 结算
			settlement() {
				// 是否勾选了商品
				if(this.checkedCount === 0) return uni.$showMsg('请选择要结算的商品')
				// 是否选择了收货地址
				if(!this.addstr) return uni.$showMsg('请选择收货地址')
				// 是否已经登录,若没登录则进行倒计时导航跳转
				if(this.token === '') return this.delayNavigate()
				// 已登录且选择了商品和收货地址，开始支付
				this.payOrder()
			},
			// 延迟跳转到my页面
			delayNavigate() {
				// 重置秒数
				this.seconds = 3
				this.showTips(this.seconds)
				this.timer = setInterval(() => {
					// 倒计时
					this.seconds--
					// 判断秒数是否小于0，小于0则清空定时器
					if(this.seconds <= 0) {
						clearInterval(this.timer)
						// 跳转到my页面
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								// 调用UPDATEREDIRECTINFO方法，将信息存储到vuex中
								this.UPDATEREDIRECTINFO({
									openType: 'switchTab',
									from: '/pages/cart/cart'
								})
							}
						})
						// 终止后面的代码，秒数为0就不showTips了
						return 
					}
					this.showTips(this.seconds)
				}, 1000)
			},
			// 展示倒计时
			showTips(n) {
				uni.showToast({
					icon: 'none',
					title: '请登录后再结算！' + n + '秒后跳转到登录页面',
					mask: true,
					duration: 1500
				})
			},
			// 支付
			async payOrder() {
				// 准备订单参数对象
				const orderInfo = {
					order_price: 0.01, // 开发期间先把总价写死
					consignee_add: this.addstr,
					goods: this.cart.filter(item => item.goods_state).map(item => ({goods_id: item.goods_id, goods_number: item.goods_count, goods_price: item.goods_price,}))
				}
				// 发起请求创建订单
				const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if(res.meta.status !== 200) return uni.$showMsg('创建订单失败')
				// 得到服务器返回的订单编号
				const orderNumber = res.message.order_number
				// 发起新请求，通过订单编号获取订单信息
				const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				if(res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败')
				// 得到预付订单支付相关参数
				const payInfo = res2.message.pay
				// 调用uni.requestPayment()发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				console.log(err);
				// 如果发起支付失败
				if(err) return uni.$showMsg('订单未支付')
				// 成功发起支付后向服务器发送订单号
				const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				// 检测是否完成支付
				if(res3.meta.status !== 200) return uni.$showMsg('订单未支付')
				// 订单支付完成
				uni.showModal({
					title: '支付完成',
					icon: 'success'
				})
				
			}
		},
		computed: {
			...mapGetters('cart', ['total', 'checkedCount', 'checkedGoodsAmount']),
			...mapGetters('user', ['addstr']),
			...mapState('user', ['token']),
			...mapState('cart', ['cart']),
			// 判断商品是否全选
			isFullCheck() {
				return this.total === this.checkedCount ? true : false
			},
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		
		
		.radio {
			display: flex;
			align-items: center;
		}
		
		.amount-box {
			.amount {
				color: #c00000;
				font-weight: bold;
			}
		}
		
		.btn-settle {
			background-color: #c00000;
			height: 50px;
			color: #fff;
			line-height: 50px;
			padding: 0 10px;
			min-width: 100px;
			text-align: center;
		}
	}
</style>
