<template>
	<view class="my-container">
		<!-- 登录组件 -->
		<my-login v-if="!token"></my-login>
		<!-- 用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '../../mixins/tabbar-badge.js'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('user', ['token'])
		},
		// 引入购物车徽标
		mixins: [badgeMix]
	}
</script>

<style lang="scss">
	page, .my-container {
		height: 100%;
	}
</style>
