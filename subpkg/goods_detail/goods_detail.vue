<template>
	<view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 商品信息 -->
			<view class="goods-info-body">
				<!-- 商品名 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品详情区 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {}
			};
		},
		methods: {
			// 获取商品详情数据的方法
			async getGoodsDetail(goods_id) {
				const {data: res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
				if(res.meta.status === 200) {
					// 将原本详情的图片标签添加上display: block属性,防止图片至今出现空隙，并将图片webp格式替换成jpg格式，防止iOS兼容问题
					res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
					this.goods_info = res.message
				} else {
					return uni.$showMsg()
				}
			},
			// 点击商品图片开始预览
			preview(index) {
				uni.previewImage({
					// 当前开始预览的图片
					current: index,
					// 所要预览的图片的URL数组
					urls: this.goods_info.pics.map(item => item.pics_big)
				})
			}
		},
		onLoad(option) {
			// 获取商品id
			const goods_id = option.goods_id
			// 获取商品详情数据
			this.getGoodsDetail(goods_id)
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	swiper {
		height: 750rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.goods-info-box {
		padding: 10px;
		padding-right: 0;
		
		.price {
			color: #C00000;
			font-size: 18px;
			padding: 10px 0;
		}
		.goods-info-body {
			display: flex;
			justify-content: space-between;
			
			.goods-name {
				font-size: 13px;
				margin-right: 10px;
			}
			
			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}
		
		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}
</style>
