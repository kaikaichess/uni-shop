<template>
	<view>
		<view class="goods-liist">
			<view v-for="item in goodsList" :key="item.cat_id" @click="gotoDetail(item)">
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 分类id
					cid: '',
					// 页数索引
					pagenum: 1,
					// 每页长度
					pagesize: 10
				},
				// 商品列表
				goodsList: [],
				// 商品总数
				total: 0,
				// 定义节流阀
				isloading: false
			};
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true
				let {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 关闭节流阀
				this.isloading = false
				// 判断是否是下拉刷新调用的，如果是则还要关闭下拉效果
				cb && cb()
				if(res.meta.status === 200) {
					this.goodsList = [...this.goodsList, ...res.message.goods]
					this.total = res.message.total
				} else {
					return uni.$showMsg()
				}
			},
			// 点击商品跳转到详情
			gotoDetail(item) {
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
				})
			}
		},
		onLoad(option) {
			// 将页面跳转所携带的参数转存到queryObj上
			this.queryObj.query = option.query || ''
			this.queryObj.cid = option.cid || ''
			// 获取商品列表数据
			this.getGoodsList()
		},
		// 下拉加载更多商品
		onReachBottom() {
			// 判断所有商品数据已经加载完毕
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
			// 判断节流阀是否打开(是否正在发送数据),如果是则return直到发送完毕，节流阀关闭
			if(this.isloading) return
			// 让页码自增加一
			this.queryObj.pagenum++
			// 重新获取商品列表数据
			this.getGoodsList()
		},
		// 下拉页面刷新
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			// 重新发起数据请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
</style>
