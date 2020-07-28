import axios from 'axios'
//获取所有的图标
let list = (data) => axios.get('/api/admin/icon/list', { params: data });
//设置子菜单图标
let edit = (data) => axios.put('/api/menu/icon', data);
export default {
	list,
	edit
}
