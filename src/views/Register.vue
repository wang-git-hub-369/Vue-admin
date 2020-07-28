<template>
	<div class="loginBg">
		<el-card class="register-card">
			<div slot="header" class="clearfix">
				<span>注册</span>
			</div>
			<el-form :model="form" ref='form' :rules="rules" label-width="80px">
				<el-form-item label="账户" prop="username">
					<el-input v-model="form.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input show-password v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-key"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input show-password v-model="form.checkPass" placeholder="请输入密码" prefix-icon="el-icon-key"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="fullname">
					<el-input v-model="form.fullname" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="form.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机号码" prop="tel">
					<el-input v-model="form.tel" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item>
					<el-checkbox label="请同意网站协议" name="type" prop="type"></el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click='submitForm("form")'>注册</el-button>
				</el-form-item>
				<div class="action-box">
					<router-link to="/login">登录账户</router-link>
					<router-link to="/">忘记密码?</router-link>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	//先引入要发送的,export直接传递出来的，传递出来的是对象。
	//如果是export default传递出来的，这里可以调用import Admin from '@/src/index'
	import { User } from '@/api/index'
	export default {
		data() {
			var handleCheckPass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.form.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				form: {
					username: '',
					password: '',
					checkPass: '',
					sex: '',
					fullname: "",
					tel: '',
					type: [],
					email: ''
				},
				rules: {
					username: [{
							required: true,
							type: 'string',
							message: '请输入账户名称',
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
							type: 'string',
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							Pattern: /^\d{6,}$/,
							message: '密码长度至少六位数字',
							trigger: 'blur'
						}
					],
					checkPass: [{
						validator: handleCheckPass,
						trigger: 'blur'
					}],
					fullname: [{
							required: true,
							message: '请输入姓名',
							trigger: 'change'
						},
						{
							min: 2,
							max: 8,
							message: '长度在 2到 8 个字符',
							trigger: 'blur'
						}
					],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					tel: [{
							required: true,
							message: '请填写手机号',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 11,
							message: '输入正确的手机号',
							trigger: 'blur'
						},
					],
					email: [
						{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
					],
					type: [{
						type: 'array',
						required: true,
						message: '请同意以下协议',
						trigger: 'change'
					}],
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => { //这里是/async函数的写法  //等同于async function(valid){}
					if (!valid) {
						//校验失败                        /async函数的写法与await是相互匹配的，出现一个，另一个就必须出现
						return false
					}
					//校验通过，发送后台
					//解构
					//await命令后面是一个 Promise 对象。
					let { status, msg, data } = await User.register({ ...this.form }); //调用Admin对象下面的register方法并且传递参数
					if (status) {
							//注册成功后，存储Token,uid,role
							sessionStorage.token=data.token;
							sessionStorage.uid=data.id;
							sessionStorage.role=data.role;
						// 	// 成功
						this.$message.success(msg);
						this.form='';
					} else {
						// 	//失败
						this.$message.error(msg)
					}
				});
			},
		}
	}
</script>
<!-- scoped="scoped"css作用域，只能影响当前的页面，不会影响其他页面的-->
<style scoped>
	.loginBg {
		height: 100%;
		background: url(../assets/img/timg.jpg) top center no-repeat;
		background-size: cover;
		position: relative;
	}

	.register-card {
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
