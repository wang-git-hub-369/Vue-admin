
let Menu = {
	namespaced: true,//命名空间
	state: {
		isCollapse: false,
	},
	mutations: {
		//修改左侧侧边栏
		iconClick(state) {
			state.isCollapse = !state.isCollapse;
		},
	},
	actions: {}
}
export default Menu;