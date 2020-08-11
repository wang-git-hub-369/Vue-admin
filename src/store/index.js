import Vue from 'vue'
import Vuex from 'vuex'
import UserInfo from './modules/user.js'
import Menu from './modules/menu.js'
Vue.use(Vuex)


export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		Menu,
		UserInfo,
	}
})
