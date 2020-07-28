<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>账户信息</span>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="ruleForm.username" disabled></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="fullname">
				<el-input v-model="ruleForm.fullname"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-radio-group v-model="ruleForm.sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="手机号" prop="tel">
				<el-input v-model="ruleForm.tel"></el-input>
			</el-form-item>
			<el-form-item label="权限" prop="role">
				<el-select v-model="ruleForm.role">
					<el-option v-for="option in AdminList" :key="option.id" :label="option.name" :value="option.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="头像">
				<Upload :url="ruleForm.avatar" :action='action' @success="handleUploadSuccess($event)" @remove="ruleForm.avatar=''"></Upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	//引入外部封装上传图片组件
	import Upload from '@/components/Upload.vue';
	import { User } from '@/api/index'
	import { Admin } from '@/api/index'
	export default {
		//注册局部组件
		components: {
			Upload
		},
		data() {
			return {
				ruleForm: {},
				action: '/api/upload/avatar',
				AdminList: [],
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
					fullname: [{
							required: true,
							message: '请输入昵称',
							trigger: 'change'
						},
						{
							min: 3,
							max: 8,
							message: '长度在 3 到 8 个字符',
							trigger: 'blur'
						}
					],
					role: [{
						required: true,
						message: '请选择角色',
						trigger: 'change'
					}],
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
					email: [{
							required: true,
							message: '请输入邮箱地址',
							trigger: 'blur'
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						}
					]
				}
			};
		},
		created() {
			this.loadinfo();
			this.loadAdminlist();
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
			//获取角色列表
			async loadAdminlist() {
				let { status, data } = await Admin.list({});
				if (status) {
					this.AdminList = data;
				}
				//console.log(this.AdminList)
			},
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						//校验失败
						return false
					}
					let { status, data } = await User.edit({ ...this.ruleForm });
					if (status) {
						this.$message.success('修改成功!');
					} else {
						this.$message.info('修改失败!');
					}
					//校验通过,发送后台获取资料

				});
			},
			//头像上传成功
			handleUploadSuccess(res) {
				this.ruleForm.avatar = res.src;
			},
		}
	}
</script>

<style scoped="scoped">
	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}
</style>
