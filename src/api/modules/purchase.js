import axios from 'axios'
//获取订单列表
let list = (data) => axios.get('/api/admin/order/list', { params: data });
export default {
	list,
}
