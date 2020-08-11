<template>
	<!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
	<el-menu router class="el-menu-vertical-demo" background-color="#334E66" text-color="#fff" :collapse="isCollapse"
	 active-text-color="#ffd04b">
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
</template>

<script>
	import { User } from '@/api/index.js'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				form: {}
			}
		},
		created() {
			this.leftmenu();
		},
		//计算属性，取出state里面的值
		computed: {
			// isCollapse(){
			// 	return this.$store.state.Menu.isCollapse
			// }
			...mapState('Menu', ['isCollapse'])
		},
		methods: {
			async leftmenu() {
				//取到登录页面缓存的id，判断登录的是哪个管理员
				let id = sessionStorage.id
				let { status, data } = await User.leftmenu({ id: id });
				if (status) {
					this.form = data;
					this.form.forEach((item, index) => {
						item.id = (item.id).toString();
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
