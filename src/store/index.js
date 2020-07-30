import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { User } from '@/api/index'
export default new Vuex.Store({
  state: {
	  isCollapse:false,
	  form:{}
  },
  mutations: {
	  //修改左侧侧边栏
	  iconClick(state) {
	  	state.isCollapse = !state.isCollapse;
	  },
	  //右侧资料
	  srtProfile(state,data){
		  state.form=data;
	  }
  },
  actions: {
	  //接收dispatch传出的指令
	  //获取账户资料
	  async loadProfile(context){
		  //取到登录页面缓存的id，判断登录的是哪个管理员
		  let {id} = sessionStorage
		  let { status, data } = await User.info({ id });
		  if (status) {
		  	context.commit('srtProfile', data);
		  }
	  }, 
	  //更新账户资料
	  async updateProfile(context,user){
		  let { status, data } = await User.edit(user);
		  if (status) {
		  	context.commit('srtProfile', user);
		  }
	  }
  },
  modules: {
  }
})
