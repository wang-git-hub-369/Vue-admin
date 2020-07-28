import Vue from 'vue'
import VueRouter from 'vue-router'
//页面级组件
import Layout from '@/components/Layout.vue'
import { Message } from 'element-ui';
Vue.use(VueRouter)

const routes = [
	//配置路由
	{
		path: '/login',
		alias: '/', //别名,是为了在主页上显示 
		name: 'Login',
		component: () => import( /* webpackChunkName: "about" */ '@/views/Login.vue'),
		meta: { requiresAuth: false } // 路由元信息,判断是否登录授权
		// route level code-splitting ---路由层级的代码拆分
		// this generates a separate chunk (about.[hash].js) for this route ---生成一个单独的代码块
		// which is lazy-loaded when the route is visited. ---/当路由被访问时延迟加载。
	},
	{
		path: '/register',
		alias: '/', //别名,是为了在主页上显示 
		name: 'Register',
		component: () => import( /* webpackChunkName: "about" */ '@/views/Register.vue'),
		meta: { requiresAuth: false } // 路由元信息,判断是否登录授权
		// route level code-splitting ---路由层级的代码拆分
		// this generates a separate chunk (about.[hash].js) for this route ---生成一个单独的代码块
		// which is lazy-loaded when the route is visited. ---/当路由被访问时延迟加载。
	},
	{
		path: '/goods/',
		name: 'Goods',
		component: Layout,
		meta: { requiresAuth: true }, // 路由元信息,判断是否登录授权
		//代表他的下一级路由
		children: [{
				path: 'list',
				name: 'GoodsList',
				component: () => import( /* webpackChunkName: "about" */ '@/views/Goods/List.vue'),
			},
			{
				path: 'category',
				name: 'GoodsCategory',
				component: () => import( /* webpackChunkName: "about" */ '@/views/Goods/Category.vue'),
			},
			{
				path: 'release',
				name: 'GoodsRelease',
				component: () => import( /* webpackChunkName: "about" */ '@/views/Goods/Release.vue'),
			},
			{
				path: 'edit/:id',
				name: 'GoodsEdit',
				props:true,//解耦
				component: () => import( /* webpackChunkName: "about" */ '@/views/Goods/Edit.vue'),
			},
		]
	},
	{
		path: '/order/',
		name: 'Order',
		component: Layout,
		meta: { requiresAuth: true }, // 路由元信息,判断是否登录授权
		//代表他的下一级路由
		children: [{
			path: 'list',
			name: 'OrderList',
			component: () => import( /* webpackChunkName: "about" */ '@/views/Order/List.vue'),
		}, ]
	},
	{
		path: '/user/',
		name: 'User',
		component: Layout,
		meta: { requiresAuth: true }, // 路由元信息,判断是否登录授权
		//代表他的下一级路由
		children: [{
				path: 'info',
				name: 'UserInfo',
				component: () => import( /* webpackChunkName: "about" */ '@/views/User/Info.vue'),
			},
			{
				path: 'list',
				name: 'UserList',
				component: () => import( /* webpackChunkName: "about" */ '@/views/User/List.vue'),
			},
		]
	},
	{
		path: '/auth/',
		name: 'Auth',
		component: Layout,
		meta: { requiresAuth: true }, // 路由元信息,判断是否登录授权
		//代表他的下一级路由
		children: [{
				path: 'role',
				name: 'AuthRole',
				component: () => import( /* webpackChunkName: "about" */ '@/views/Auth/Role.vue'),
			},
			{
				path: 'menu',
				name: 'AuthMenu',
				component: () => import( /* webpackChunkName: "about" */ '@/views/Auth/Menu.vue'),
			},
		]
	},
]

const router = new VueRouter({
	routes
})
//配置全局守卫
router.beforeEach((to, from, next) => { //三个参数to: Route: 即将要进入的目标路由对象 from: 
//Route: 当前导航正要离开的路由 next: Function: 一定要调用该方法来 resolve 这个钩子。
	//console.log(to.matched)  打印to.matched,本质是一个数组
	//校验该地址,根据meta元信息,校验路由是否需要授权
	//console.log(to)
	let isRequiresAuth = to.matched.some((path) => path.meta.requiresAuth);
	//如果不需要登录授权,直接放行即可
	if(!isRequiresAuth){
		next();
		return;
	}
	//校验token
	//提取token
	let token = sessionStorage.token;
	//有token,立即放行
	if (token) {
		next(); //放行
		return;
	}
	//没有token,强制跳转登录页面
	Message.error('无效的token,请重新登录');
	setTimeout(() => {
		next(`/login?redirect=${to.path}`);//to.path ==登录页面
	}, 2000)

})
export default router
