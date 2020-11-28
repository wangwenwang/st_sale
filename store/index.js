import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		// 底部菜单
		vuex_tabbar: [],
		// 角色类型，1 司机，2 货主
		role_type: 2,
		// 选择坐标
		choose_lnglat: {},
	},
	mutations: {

	},
	actions: {}
})
export default store
