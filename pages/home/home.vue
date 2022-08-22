<template>
	<view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img">
			</view>
		</view>
		<!-- 商品展示楼层 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item, index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层商品图片 -->
				<view class="floor-img-box">
					<!-- 左侧大图子盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" mode="widthFix" :style="{width: `${item.product_list[0].image_width}rpx`}"></image>
					</navigator>
					<!-- 右侧4个小盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(product, productIndex) in item.product_list" :key="productIndex" :url="product.url" v-if="productIndex !== 0">
							<image :src="product.image_src" mode="widthFix" :style="{width: `${product.image_width}rpx`}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图数据列表
				swiperList: [],
				navList: [],
				floorList: []
			};
		},
		methods: {
			// 获取轮播图数据的方法
			async getSwiperList() {
				const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if(res.meta.status === 200) {
					this.swiperList = res.message
				} else {
					return uni.$showMsg()
				}
			},
			// 获取分类导航数据的方法
			async getNavList() {
				const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
				if(res.meta.status === 200) {
					this.navList = res.message
				} else {
					return uni.$showMsg()
				}
			},
			// 获取商品展示楼层数据的方法
			async getFloorList() {
				const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
				if(res.meta.status === 200) {
					// 对数据进行处理
					res.message.forEach(item => {
						item.product_list.forEach(product => {
							product.url = `/subpkg/goods_list/goods_list?${product.navigator_url.split('?')[1]}`
						})
					})
					this.floorList = res.message
				} else {
					return uni.$showMsg()
				}
			},
			// 轮播图点击事件
			navClickHandler(item) {
				if(item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			}
		},
		onLoad() {
			// 调用获取轮播图数据的方法
			this.getSwiperList() 
			// 调用获取分类导航数据的方法
			this.getNavList()
			// 调用获取商品展示楼层数据的方法
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;
		
		.swiper-item,image {
			width: 100%;
			height: 100%;
		}
	}
	
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		
		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}
	
	.floor-title {
		width: 100%;
		height: 60rpx;
	}
	
	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.floor-img-box{
		display: flex;
		padding-left: 10rpx;
	}
</style>
