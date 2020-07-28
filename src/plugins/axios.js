import axios from 'axios';
//引入loading服务方式
import { Loading,Message } from 'element-ui';
//引入路由实例
import router from '@/router/index';
// 声明loading实列,为了开启loading
let loading;
// //设置默认baseURL
axios.defaults.baseURL = 'http://localhost:3003';
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	//开启loading
	console.log(config)
	loading = Loading.service({ background: "rgba(0,0,0,0.3)" }) //{background:"rgba(0,0,0,0.3)"}传递参数,让loading背景色为黑色
	//判断是否携带token,如果是登录页面或注册页面时
	console.log(config.url)
	if (config.url == '/admin/login' || config.url == '/admin/register') {
		return config;
	}
	//从之前存储的登录页面或者注册页面取出存储的token值---获取token
	let token = sessionStorage.token;
	//token有值的时候,给发送ajax的路由的头部添加token值
	config.headers.Authorization = `Bearer ${token}`;
	//在return出config
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});



// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	//结构response
	let { data, status } = response;
	//关闭loading
	loading.close();
	//在这里你可以判断后台返回数据携带的请求码
	// switch (status) {
	// 	case 401:

	// 		break;
	// 	case 404:
	// 		break;
	// 	case 500:
	// 		break;
	// 	default:
	// 		break;
	// }
	//只传递data
	return data;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
