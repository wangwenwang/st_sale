import Vue from 'vue'
import App from './App'
// main.js
import uView from 'uview-ui'
Vue.use(uView)
// 引入vuex
import store from './store'
// 把vuex定义成全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

// 引入工具类
import u_date from './utils/u_date'
Vue.prototype.u_date = u_date


// 是否登录状态
Vue.prototype.is_login = function() {

	if (uni.getStorageSync(this.user_info_key).user) {
		return true
	}
	return false
}

// 判断是否已登录，未登录会自动进入登录页面
Vue.prototype.has_logined = function() {

	if (uni.getStorageSync(this.user_info_key).user) {
		return true
	} else {
		uni.navigateTo({
			url: '/pages/login/index'
		})
	}
}

Vue.prototype.http_request = function(param, backpage, backtype) {
	var _self = this,
		url = param.url,
		method = param.method,
		header = {},
		data = param.data || {},
		token = "",
		hideLoading = param.hideLoading || false
	// 拼接完整请求地址
	var requestUrl = this.siteBaseUrl + url
	// console.log(requestUrl)
	// 固定参数:仅仅在小程序绑定页面通过code获取token的接口默认传递了参数token = login
	// 其他业务接口传递过来的参数中无token
	if (!data.token) {
		// 参数中无token时在本地缓存中获取
		token = uni.getStorageSync(this.user_info_key).token
		// 本地无token需重新登录(退出时清缓存token)
		if (!token) {
			// _self.login(backpage, backtype)
			// return
		} else {
			data.token = token
		}
	}
	// #ifdef MP-WEIXIN
	data["device"] = "wxapp"
	data["ver"] = "1.1.30"
	// #endif
	// #ifdef APP-PLUS || H5
	// #endif
	// 请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
	if (method) {
		method = method.toUpperCase() //小写改为大写
		if (method == "POST") {
			header = {
				'content-type': "application/x-www-form-urlencoded"
			}
		} else {
			header = {
				'content-type': "application/x-www-form-urlencoded"
			}
		}
	} else {
		method = "GET"
		header = {
			'content-type': "application/json"
		}
	}
	// 用户交互:加载圈
	if (!hideLoading) {
		uni.showLoading({
			title: '加载中...'
		})
	}
	// 网络请求
	uni.request({
		url: requestUrl,
		method: method,
		header: header,
		data: data,
		success: res => {
			console.log(res.data)
			// api错误
			if (res.statusCode && res.statusCode != 200) {
				this.$refs.uToast.show({
					title: res.errMsg,
					type: 'error'
				})
				return
			}
			// 返回结果码code判断:0成功，其它归为失败
			if (res.data.code != 0) {
				this.$refs.uToast.show({
					title: res.data.errmsg,
					type: 'error'
				})
				return
			}
			typeof param.success == "function" && param.success(res.data)
		},
		fail: (e) => {
			console.log("网络请求fail:" + JSON.stringify(e))
			this.$refs.uToast.show({
				title: e.errMsg,
				type: 'error'
			})
			typeof param.fail == "function" && param.fail(e.data)
		},
		complete: () => {
			if (!hideLoading) {
				uni.hideLoading()
			}
			typeof param.complete == "function" && param.complete()
			return
		}
	})
}
Vue.prototype.siteBaseUrl = 'http://192.168.20.92:8080/api/'
Vue.prototype.siteBaseUrl = 'https://ddapi.kaidongyuan.com/api/'

// 用户信息
Vue.prototype.user_info_key = "user_info"
// 商品分类列表
Vue.prototype.product_type_list_key = "product_type_list"

const app = new Vue({
	...App,
	store
})

app.$mount()
