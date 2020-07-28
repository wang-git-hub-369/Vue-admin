<template>
	<div class="header">
		<div class="navbar"><img src="../assets/img/logo.png" alt=""></div>
		<div class="header-icon">
			<!-- <el-radio-button :label="true"><i class="el-icon-s-fold"></i>  收起</el-radio-button> -->
			<i class="el-icon-s-fold" @click="emits"></i>
		</div>
		<div class="header-title">
			<el-dropdown trigger="click">
				<span class="el-dropdown-link">
					<el-avatar :size='35' :src="ruleForm.avatar"></el-avatar>
					<span class="sdaas">{{ruleForm.username}}<i class="el-icon-arrow-down el-icon--right"></i></span>

				</span>
				<el-dropdown-menu slot="dropdown" class="el-dropdown-menu">
					<el-dropdown-item>消息</el-dropdown-item>
					<el-dropdown-item>
						<el-link  :underline="false" href="#/user/info">设置</el-link>
					</el-dropdown-item>
					<el-dropdown-item>
						<el-link  :underline="false" href="#/login">退出</el-link>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>

</template>

<script>
	import { User } from '@/api/index'
	export default {
		data() {
			return {
				ruleForm: {},
				isShow:false,
			}
		},
		created() {
			this.loadinfo();
		},
		methods: {
			async loadinfo() {
				//取到登录页面缓存的id，判断登录的是哪个管理员
				let id = sessionStorage.uid
				let { status, data } = await User.info({ id: id })
				if (status) {
					this.ruleForm = data;
				}
			},
			emits(){
				this.isShow=!this.isShow;
				//发送给父级一个指令
				this.$emit('change',this.isShow);
			}
		}

	}
</script>

<style scoped="scoped">
	.header {
		background-color: #31404E;
		color: white;
		height: 100%;
		line-height: 55px;
		display: flex;
	}

	.header {
		margin-left: -20px;
		margin-right: -20px;
	}

	.navbar img {
		height: 55px;
	}

	.header-title {
		position: absolute;
		right: -60px;
		width: 120px;
		margin-right: 50px;
	}

	.el-dropdown-link span {
		color: white;
		cursor: pointer;
	}

	.el-avatar {
		position: absolute;
		top: 13px;
		right: 65px;
	}
	.el-icon-s-fold{
		cursor: pointer;
	}
</style>
