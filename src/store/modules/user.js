import { User } from '@/api/index'
let UserInfo = {
	namespaced: true,//命名空间
	state: {
		form: {}
	},
	mutations: {
		//右侧资料
		srtProfile(state, data) {
			state.form = data;
		}
	},
	actions: {
		//接收dispatch传出的指令
		//获取账户资料
		async loadProfile(context) {
			//取到登录页面缓存的id，判断登录的是哪个管理员
			let { id } = sessionStorage
			let { status, data } = await User.info({ id });
			if (status) {
				context.commit('srtProfile', data);
			}
		},
		//更新账户资料
		async updateProfile(context, user) {
			let { status, msg } = await User.edit(user);
			if (status, msg) {
				context.commit('srtProfile', user);
				return { status, msg }
			}
		}
	}
}
export default UserInfo;
