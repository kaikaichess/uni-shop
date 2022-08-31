<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @click="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权限</view>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	export default {
		computed: {
			...mapState('user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('user', ['UPDATEUSERINFO', 'UPDATETOKEN', 'UPDATEREDIRECTINFO']),
			// 获取用户基本信息
			getUserInfo() {
				// 获取用户信息接口
				uni.getUserProfile({
					desc: '获取信息',
					// 获取成功后将数据存储到vuex中
					success: res => {
						this.UPDATEUSERINFO(res.userInfo)
						this.getToken(res)
					},
					fail: res => uni.$showMsg('您取消了登录授权')
				})
			},
			// 调用登录接口，获取永久的token
			async getToken(info) {
				// 调用登录接口
				const [err, res] = await uni.login().catch(err => err)
				
				// 判断调用login接口是否成功
				if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
				
				// 准备参数对象
				// const query = {
				// 	code: res.code,
				// 	encryptedData: info.encryptedData,
				// 	iv: info.iv,
				// 	rawData: info.rawData,
				// 	signature: info.signature
				// }
				// 获取token
				// const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败')
				// uni.$showMsg('登录成功')
				
				// 这里由于获取token必须要进行后台授权，所以这里采用现成的token进行模拟
				const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
				this.UPDATETOKEN(token)
				this.navigateBack()
			},
			navigateBack() {
				// 判断redirectInfo是否为null，若不为null那类型是否为switchTab
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					// 调用uni.switchTab()进行页面跳转
					uni.switchTab({
						url: this.redirectInfo.from,
						// 跳转结束后，把vuex中的redirectInfo重置为null
						complete: () => {
							this.UPDATEREDIRECTINFO(null)
						}
					})
				}
			}
		},
		
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	
	.login-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 750rpx;
		background-color: #F8F8F8;
		position: relative;
		overflow: hidden;
		
		&::after {
			content: '';
			display: block;
			width: 100%;
			height: 40px;
			background-color: #fff;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
			
		}
		
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}
		
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
