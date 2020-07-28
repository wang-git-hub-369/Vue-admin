//引入axios
import axios from 'axios'
//获取子级分类
let category = (data) => axios.get("/api/category/sub", { params: data });
//更新子级分类
let update = (id, data) => axios.put(`/api/category/`, id, data);
//删除子级分类
let remove = (data) => axios.delete("/api/category", { params: data });
//添加子分类
let add = (data) => axios.post('/api/category', data)
export default {
	category,
	remove,
	update,
	add,
}
