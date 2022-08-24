<template>
	<view>
		<!-- 搜索界面 -->
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" placeholder="请输入搜索内容" cancelButton="none" bgColor="#FFFFFF"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="suggest-list" v-if="searchResult.length !== 0">
			<view class="suggest-item" v-for="item in searchResult" :key="item.goods_id" @click="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="hsitory-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, index) in histories" :key="index" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 防抖定时器
				timer: null,
				// 搜索后返回的结果列表
				searchResult: [],
				// 搜索关键字
				keyword: '',
				// 搜索历史
				historyList: []
			};
		},
		methods: {
			// 输入事件的处理函数，并添加防抖
			input(e) {
				// 清除延时器
				clearTimeout(this.timer)
				// 重新设置一个定时器并赋值给timer
				this.timer = setTimeout(() => {
					this.keyword = e
					// 调用搜索方法
					this.getSearchResult()
				}, 500)
			},
			// 获取搜索结果列表
			async getSearchResult() {
				// 判断搜索关键词是否为空
				if(this.keyword.length === 0) {
					// 如果关键词为空,就清空搜索结果列表
					this.searchResult = []
					return
				} else {
					// 如果关键词不为空，则发送搜索请求
					let {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.keyword})
					if(res.meta.status === 200) {
						this.searchResult = res.message
						// 调用搜索历史存储方法
						this.saveSearchHistory()
					} else {
						uni.$showMsg()
					}
				}
			},
			// 点击搜索列表跳转到商品详情
			gotoDetail(item) {
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
				})
			},
			// 将搜索关键词存入搜索历史
			saveSearchHistory() {
				// Set对象类似于数组,但是其中的值唯一不重复，用于解决搜索历史重复的问题
				const set = new Set(this.historyList)
				set.delete(this.keyword)
				set.add(this.keyword)
				this.historyList = Array.from(set)
				// 将搜索历史持久化存储
				uni.setStorageSync('keyword', JSON.stringify(this.historyList))
			},
			// 清理搜索历史
			clean() {
				this.historyList = []
				uni.setStorageSync('keyword', '[]')
			},
			// 搜索历史点击事件
			gotoGoodsList(item) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?query=${item}`
				})
			}
		},
		computed: {
			histories() {
				return [...this.historyList].reverse()
			}
		},
		onLoad() {
			// 获取搜索历史
			this.historyList = JSON.parse(uni.getStorageSync('keyword') || '[]')
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
	
	.suggest-list {
		padding: 0 5px;
		
		.suggest-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			
			.goods-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
	
	.hsitory-box {
		padding: 0 5px;
		
		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		.history-list {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10px;
			
			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
