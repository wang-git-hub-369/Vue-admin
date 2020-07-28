import axios from 'axios'
//获取所有省份
let list = (data) => axios.get('/api/pcct/province', { params: data });
//获取城市
let city = (data) => axios.get('/api/pcct/city', { params: data });
//获取区级
let county = (data) => axios.get('/api/pcct/county', { params: data });
export default {
	list,
	city,
	county,
}
