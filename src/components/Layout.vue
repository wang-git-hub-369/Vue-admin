<template>
	<el-container>
		<el-header style='padding: 0;'>
			<NavBar></NavBar>
		</el-header>
		<el-container>
			<el-aside style='width: auto;'>
				<!-- 左侧侧边栏菜单 -->
				<LeftMenu></LeftMenu>
			</el-aside>
			<el-main>
				<!-- 主体内容 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import NavBar from '@/components/NavBar';
	import LeftMenu from '@/components/LeftMenu';
	export default {
		components: {
			NavBar,
			LeftMenu
		},
		methods: {
		}
	}
</script>

<style>
</style>
