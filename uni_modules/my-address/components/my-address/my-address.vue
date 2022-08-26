<template>
	<view>
		<!-- 选择收获地址的按钮 -->
		<view class="adress-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收获地址+</button>
		</view>
		<!-- 详细收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress()">
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：{{address.userName}}</view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：{{address.telNumber}}</view>
					<uni-icons type="arrowright" size="18"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>
		<!-- 底部边框线 -->
		<image src="../../../../static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations('user', ['UPDATEADDRESS']),
			// 选择收货地址处理函数
			async chooseAddress() {
				// 调用uniapp提供的chooseAddress方法即可实现选择收货地址的功能
				const [err, succ] = await uni.chooseAddress().catch(err => err)
				// 用户成功选择了收货地址
				if(err === null && succ.errMsg === 'chooseAddress:ok') {
					this.UPDATEADDRESS(succ)
				}
				// 判断用户是否需要重新授权获取地址信息权限
				if(err && err.errMsg === 'chooseAddress:fail auth deny') {
					this.reAuth()
				}
			},
			// 重新授权获取地址信息权限方法
			async reAuth() {
				// 弹窗提示用户对地址进行授权
				const [err, confirmResult] = await uni.showModal({
					content: '检测您没打开地址权限，是否打开？',
					confirmText: '确认',
					cancelText: '取消'
				})
				// 如果弹窗异常,则之间退出
				if(err) return
				// 如果点击了取消按钮,则提示用户"您取消了地址授权"
				if(confirmResult.cancel) return uni.$showMsg('重新授权获取地址信息权限')
				// 如果点击了确定按钮，则调用openSetting方法进入授权页面
				if(confirmResult.confirm) return uni.openSetting({
					success: (settingResult) => {
						if(settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功，请选择地址')
						if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权')
					}
				})
			}
		},
		computed: {
			...mapState('user', ['address']),
			...mapGetters('user', ['addstr'])
		},
	}
</script>

<style lang="scss">
	.adress-choose-box {
		height: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}
	.address-info-box {
		display: flex;
		flex-direction: column;
		font-size: 12px;
		height: 90px;
		justify-content: center;
		padding: 0 5px;
		
		.row1 {
			display: flex;
			justify-content: space-between;
			
			.row1-right {
				display: flex;
				justify-content: space-between;
			}
		}
		
		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;
			
			.row2-left {
				white-space: nowrap;
			}
		}
	}
</style>
