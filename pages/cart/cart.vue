<template>
	<view>
		<!-- 收货地址 -->
		<my-address></my-address>
		<!-- 购物车商品列表和标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文字 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(goods, index) in cart" :key="index">
				<!-- uni-swipe-action-item可以为其子节点提供滑动操作，需要通过options属性来指定操作按钮的配置信息 -->
				<uni-swipe-action-item :right-options="options" @click="swiperActionClickHandler(goods)">
					<my-goods :goods="goods" :showRadio="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler" :showNum="true"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
	</view>
</template>

<script>
	import badgeMix from '../../mixins/tabbar-badge.js'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				// uni-swipe-action-item的配置项
				options: [
					{
						text: '删除',
						style: {backgroundColor: '#c00000'}
					}
				]
			};
		},
		computed: {
			...mapState('cart', ['cart'])
		},
		methods: {
			...mapMutations('cart', ['UPDATEGOODSSTATE', 'UPDATEGOODSNUMBER', 'REMOVEGOODSBYID']),
			// 修改商品选中状态
			radioChangeHandler(e) {
				this.UPDATEGOODSSTATE(e)
			},
			// my-goods组件商品数量变化处理函数
			numberChangeHandler(e) {
				this.UPDATEGOODSNUMBER(e)
			},
			// uni-swipe-action-item按钮点击事件
			swiperActionClickHandler(goods) {
				this.REMOVEGOODSBYID(goods.goods_id)
			}
		},
		// 引入购物车徽标
		mixins: [badgeMix]
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;
		
		.cart-title-text {
			margin-left: 10px;
		}
	}
</style>
