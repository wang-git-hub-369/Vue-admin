//引入axios
import axios from 'axios'
//获取商品列表
let list = (data) => axios.get("/api/goods/list", { params: data });

//删除商品
let remove = (id) => axios.delete('/api/admin/goods', { params: id });
//发布新商品
let release = (data) => axios.post('/api/admin/goods', data);
//编辑商品
let edit = (data) => axios.put('/api/admin/goods', data);
//获取商品详情
let details = (data) => axios.get('/api/admin/goods', { params: data });
export default {
	list,
	remove,
	release,
	edit,
	details,
}
