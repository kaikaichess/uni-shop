
import Vue from 'vue'
import App from './App'
import store from './store/store.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 配置URL根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 将发送请求的方法挂载到uni顶级对象上
uni.$http = $http
// 配置请求拦截器
$http.beforeRequest = function(options) {
	// 在发出请求前进行数据加载效果展示
	uni.showLoading({
		title: '数据加载中'
	})
	// 判断请求是否为有权限的API接口
	if(options.url.indexOf('/my/')!=-1) {
		// 为请求头添加身份认证字段
		options.header = {
			Authorization: store.state.user.token
		}
	}
}
// 配置响应拦截器
$http.afterRequest = function() {
	// 在接收到响应后隐藏数据加载效果展示
	uni.hideLoading()
}

// 封装一个请求失败后显示失败提示的方法
uni.$showMsg = function(title = '请求数据失败', duration = 1500,) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

Vue.config.productionTip = false



App.mpType = 'app'

const app = new Vue({
    ...App,
		store
})
app.$mount()


