<template>
	<!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
	<el-menu router class="el-menu-vertical-demo" background-color="#334E66" text-color="#fff" :collapse="isCollapse"
	 active-text-color="#ffd04b"  width='150px'>
		<el-submenu :index="item.id" v-for="(item) in form" :key='item.id'>
			<template slot="title">
				<i :class="item.icon"></i>
				<span slot="title" v-text="item.name"></span>
			</template>
			<el-menu-item-group>
			      <el-menu-item :index="item.path" v-for="item in item.children" :key='item.id'>
					<i :class="item.icon"></i>
					<span slot="title" v-text="item.name"></span>  
				  </el-menu-item>
			    </el-menu-item-group>
		</el-submenu>
	</el-menu>
	<!-- <el-submenu index="1">
			<template slot="title">
				<i class="el-icon-goods"></i>
				<span slot="title">商品管理</span>
			</template>
			<el-menu-item index="/commodity/category">商品分类</el-menu-item>
			<el-menu-item index="/commodity/release">发布商品</el-menu-item>
			<el-menu-item index="/commodity/list">商品列表</el-menu-item>
		</el-submenu>
		<el-submenu index="2">
			<template slot="title">
				<i class="el-icon-files"></i>
				<span slot="title">订单管理</span>
			</template>
			<el-menu-item index="/indent/list">订单列表</el-menu-item>
		</el-submenu>
		<el-submenu index="3">
			<template slot="title">
				<i class="el-icon-setting"></i>
				<span slot="title">账户设置</span>
			</template>
			<el-menu-item index="/user/info">账户信息</el-menu-item>
		</el-submenu>
		<el-submenu index="4">
			<template slot="title">
				<i class="el-icon-user"></i>
				<span slot="title">用户管理</span>
			</template>
			<el-menu-item index="/user/list">用户列表</el-menu-item>
		</el-submenu>
		<el-submenu index="5">
			<template slot="title">
				<i class="el-icon-set-up"></i>
				<span slot="title">权限管理</span>
			</template>
			<el-menu-item index="/auth/role">用户角色</el-menu-item>
			<el-menu-item index="/auth/menu">菜单权限</el-menu-item>
		</el-submenu>
	</el-menu> -->
</template>

<script>
	import { User } from '@/api/index.js'
	export default {
		props: ['isCollapse'],
		data() {
			return {
				form: {

				}
			}
		},
		created() {
			this.leftmenu();
		},
		methods: {
			async leftmenu() {
				//取到登录页面缓存的id，判断登录的是哪个管理员
				let id = sessionStorage.uid
				let { status, data } = await User.leftmenu({ id: id });
				if (status) {
					this.form = data;
					this.form.forEach((item, index) => {
						item.id=(item.id).toString();
						//拼接字符串
						item.icon = 'el-icon' + '-' + item.icon
					})
				}

			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>

<style scoped="scoped">
	body,
	html {
		width: 100%;
		height: 100%;
	}
	a {
		color: white;
		text-decoration: none;
	}
</style>
