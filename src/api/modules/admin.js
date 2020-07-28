import axios from 'axios'
//获取角色列表
let list = (data) => axios.get('/api/role/list', { params: data });
//获取子菜单列表
let menu = (data) => axios.get('/api/menu/sub', { params: data });
//更新子菜单
let edit = (data) => axios.put('/api/menu', data);
//添加子菜单
let add = (data) => axios.post('/api/menu', data);
//删除子菜单
let remove = (id) => axios.delete('/api/menu', { params: id });
//设置子菜单图标
let icon = (data) => axios.put('/api/menu/icon', data);
export default {
	list,
	menu,
	edit,
	add,
	remove,
}
