<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧滑动区 -->
			<scroll-view class="left-scroll" scroll-y="true" :style="{height: windowHeight + 'px'}">
				<block v-for="(item, index) in cateList" :key="item.cat_id">
					<view :class="['left-scroll-view-item', active === index ? 'active' : '']" @click="activeChange(index)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区 -->
			<scroll-view scroll-y="true" :style="{height: windowHeight + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="item2 in cateLevel2" :key="item2.cat_id">
						<!-- 二级分类的标题 -->
						<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
						<!-- 三级分类列表 -->
						<view class="cate-lv3-list">
							<view class="cate-lv3-item" v-for="item3 in item2.children" :key="item3.cat_id" @click="gotoGoodList(item3)">
								<!-- 三级分类图片 -->
								<image :src="item3.cat_icon"></image>
								<!-- 三级分类文本 -->
								<text>{{item3.cat_name}}</text>
							</view>
						</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 可用窗口的高度
				windowHeight: 0,
				// 分类列表的数据
				cateList: [],
				// 二级分类列表的数据
				cateLevel2: [],
				// 默认激活项
				active: 0,
				scrollTop: 0
			};
		},
		methods: {
			// 获取分类列表数据
			async getCateList() {
				const {data: res} = await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status === 200) {
					this.cateList = res.message
					// 为二级分类列表默认赋值
					this.cateLevel2 = res.message[0].children
				} else {
					return uni.$showMsg()
				}
			},
			// 分类列表点击事件
			activeChange(index) {
				this.active = index
				// 重新为二级分类列表赋值
				this.cateLevel2 = this.cateList[index].children
				// 使每次切换分类，滚动条都在顶部（如果所赋值与初始值相同，则不会更新使用处的数据，所以要有一些偏差）
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			// 点击分类跳转到商品列表页面
			gotoGoodList(item3) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${item3.cat_id}`
				})
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.windowHeight = sysInfo.windowHeight
			this.getCateList()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.scroll-view-container {
		display: flex;
		
		.left-scroll {
			width: 120px;
		} 
		
		.left-scroll-view-item {
			background-color: #F7F7F7;
			line-height: 60px;
			text-align: center;
			font-size: 12px;
			
			&.active {
				background-color: #fff;
				position: relative;
				
				&::before {
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #c00000;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
		}
		
		.cate-lv2-title {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}
		
		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;
			
			.cate-lv3-item {
				display: flex;
				flex-direction: column;
				width: 33.33%;
				justify-content: center;
				align-items: center;
				margin-bottom: 10px;
				
				image {
					width: 60px;
					height: 60px;
				}
				
				text{
					font-size: 12px
				}
			}
		}
	}
</style>
