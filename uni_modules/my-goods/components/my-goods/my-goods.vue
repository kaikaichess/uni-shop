<template>
	<view class="goods-item">
		<!-- 商品图片 -->
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"/>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 商品信息 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
				<!-- 商品数量 -->
				<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			goods: {
				type: Object,
				default: {}
			},
			// 是否展示单选框
			showRadio: {
				type: Boolean,
				default: false
			},
			// 是否展示numberbox
			showNum: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 默认商品图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			}
		},
		methods: {
			// radio点击事件
			radioClickHandler() {
				// 点击后触发radioChangeHandler事件，并传回商品信息(其中对goods_state取反，制造点击勾选效果)
				this.$emit('radio-change', {goods_id: this.goods.goods_id, goods_state: !this.goods.goods_state})
			},
			// numbox数量变化处理函数
			numChangeHandler(newValue) {
				this.$emit('num-change', {goods_id: this.goods.goods_id, goods_count: newValue - 0}) // newValue - 0保证值为数字
			}
		},
		filters: {
			// 将价格精确到小数点后两位
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		width: 750rpx;
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		
		.goods-item-left {
			margin-right: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		
		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-name {
				font-size: 13px
			}
			
			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.goods-price {
					color: #c00000;
					font-size: 16px
				}
			}
		}
	}
</style>
