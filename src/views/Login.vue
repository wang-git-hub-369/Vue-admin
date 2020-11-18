<template>
	<div class="loginBg">
		<el-card class="loginCard">
			<div slot="header" class="clearfix">
				<span>登录</span>
			</div>
			<el-form :rules="rules" ref="form" :model="form" label-width="60px">
				<el-form-item label="账户" prop="username">
					<el-input v-model="form.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input show-password v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-key"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='handleLogin("form")'>登录</el-button>
				</el-form-item>
				<div class="action-box">
					<router-link to="/register">注册账户</router-link>
					<router-link to="/">忘记密码?</router-link>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	//先引入要发送的,export直接传递出来的，传递出来的是对象。
	//如果是export default传递出来的，这里可以调用import Admin from '@/src/index'
	import { User } from '@/api/index';
	//console.log(Admin);
	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'change'
						},
						{
							min: 1,
							max: 8,
							message: '长度在1到8个字符',
							trigger: 'blur'
						}
					],
				}
			}
		},
		// 回车键登录
		created() {
			let that = this;
			document.onkeydown = function(e) {

				// this.handleLogin();
				e = window.event || e;
				if ((e.code == 'Enter' || e.code == 'enter')) { //验证按得键是回车键enter
					if (that.form.password == 0 && that.form.username == 0) {
						that.$message({
							message: '请填写账号或密码',
							type: 'warning'
						});
					} else {
						that.enterLogin();
					}
				}
			}
		},
		methods: {
			handleLogin(formName) { //async函数的写法
				this.$refs[formName].validate(async (valid) => { //等同于async function(valid){}
					if (!valid) {
						//校验失败
						return false
					}
					//校验通过
					//发送后台
					// await命令后面是一个 Promise 对象。
					let { status, msg, data } = await User.login({ ...this.form }); //调用Admin对象下面的login方法并且传递参数
					if (status) {
						//console.log(data)
						//登录成功后存储Token,uid,role
						//sessionStorage只在页面打开时有效,暂时存储，而localStorage则是永久存储，cookie则安全性低，容易被攻击
						sessionStorage.token = data.token;
						sessionStorage.id = data.id;
						sessionStorage.role = data.role;
						console.log(sessionStorage.uid);
						// 成功
						this.$message.success(msg);
						//是否有redirect参数？04--重定向参数
						//把query里面的redirect结构出来
						let { redirect } = this.$route.query;
						//console.log(this.$route.query); 打印query,查看属性
						if (redirect) {
							this.$router.replace(redirect);
						} else {
							//跳转到默认地址    this.$router解决了每次需要引进router.js的问题
							this.$router.replace('/goods/list');
						}
					} else {
						this.$message.error(msg);
					}
				});
			},
			// 回车登录函数
			async enterLogin() {
				let { status, msg, data } = await User.login({ ...this.form }); //调用Admin对象下面的login方法并且传递参数
				if (status) {
					sessionStorage.token = data.token;
					sessionStorage.id = data.id;
					sessionStorage.role = data.role;
					console.log(sessionStorage.uid);
					// 成功
					this.$message.success(msg);
					//是否有redirect参数？04--重定向参数
					//把query里面的redirect结构出来
					let { redirect } = this.$route.query;
					// 打印query,查看属性
					// console.log(this.$route.query); 
					if (redirect) {
						this.$router.replace(redirect);
					} else {
						//跳转到默认地址    this.$router解决了每次需要引进router.js的问题
						this.$router.replace('/goods/list');
					}
				} else {
					this.$message.error(msg);
				}
			}
		},
	}
</script>

<style scoped="scoped">
	.loginBg {
		position: relative;
		height: 100vh;
		background: url(../assets/img/login-bg.jpg) top center no-repeat;
		background-size: cover;

	}

	.loginCard {
		position: absolute;
		top: 50%;
		right: 40px;
		transform: translateY(-50%);
	}

	.action-box {
		font-size: 13px;
		display: flex;
		justify-content: space-between;
	}
</style>
