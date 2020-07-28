//引入axios
import axios from 'axios'
//获取管理员列表
let list = (data) => axios.get('/api/admin/list', { params: data });
//管理员登录
let login = (data) => axios.post('/api/admin/login', data)
//注册管理员
let register = (data) => axios.post('/api/admin/register', data);
//获取管理员个人资料
let info = (data) => axios.get("/api/admin", { params: data });
//删除管理员
let remove = (id) => axios.delete('/api/admin', { params: id });
//编辑管理员
let edit = (data) => axios.put('/api/admin', data);
//根据管理员id获取左侧菜单
let leftmenu = (id) => axios.get('/api/menu/tree', { params:id });
export default {
	list,
	login,
	register,
	info,
	remove,
	edit,
	leftmenu
}
