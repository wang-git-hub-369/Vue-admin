<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
				<el-table-column prop="id" label="#" width="60"></el-table-column>

				<el-table-column prop="avatar" label="头像" sortable>
					<template slot-scope="scope">
						<img :src="scope.row.avatar" class="list-avatar" width="80" height="80" alt="">
					</template>
				</el-table-column>

				<el-table-column prop="username" label="账号" sortable></el-table-column>

				<el-table-column prop="fullname" label="姓名" sortable></el-table-column>

				<el-table-column prop="sex" label="性别" sortable></el-table-column>

				<el-table-column prop="tel" label="手机" sortable></el-table-column>

				<el-table-column prop="role" label="角色" sortable>
					<template slot-scope="scope">
						<el-tag :class="{color:scope.row.role_name === '超级管理员'}">{{scope.row.role_name}}</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="login_time" label="上次登录" sortable width="180"></el-table-column>

				<el-table-column prop="login_count" label="登陆次数" sortable width="80"></el-table-column>

				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="primary" plain icon="el-icon-edit" @click="handleInfo(scope.row.id)"></el-button>
						<el-button type="danger" :disabled="scope.row.role_name === '超级管理员'" plain icon="el-icon-delete" @click="removeUser(scope.row.id,scope.$index)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 模态框 -->
			<el-dialog title="修改信息" :visible.sync="dialogFormVisible">
				<el-form ref="form" :model="form" :rules="rules">
					<el-form-item label="姓名" :label-width="formLabelWidth" prop="fullname">
						<el-input v-model="form.fullname" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio label="男"></el-radio>
							<el-radio label="女"></el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="手机" :label-width="formLabelWidth" prop="tel">
						<el-input v-model="form.tel" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="权限" :label-width="formLabelWidth" prop="role_name">
						<el-select v-model="form.role">
							<el-option v-for="option in AdminList" :key="option.id" :label="option.name" :value="option.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
						<Upload :url="form.avatar" :action='action' @success="handleUploadSuccess($event)" @remove="form.avatar=''"></Upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitForm('form')">确 定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	import { User } from '@/api/index';
	import { Admin } from '@/api/index';
	import Upload from '@/components/Upload.vue';

	export default {
		components: {
			Upload
		},
		data() {
			var checkphone = (rule, value, callback) => {
				if (value == "") {
					callback(new Error("请输入手机号"));
				} else if (!this.isCellPhone(value)) { //引入methods中封装的检查手机格式的方法
					callback(new Error("请输入正确的手机号!"));
				} else {
					callback();
				}
			};
			return {
				formLabelWidth: '120px',
				dialogTableVisible: false,
				dialogFormVisible: false,
				action: '/api/upload/avatar',
				tableData: [],
				AdminList:[],
				form: {
					
				},
				rules: {
					fullname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
						{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
					],
					sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
					tel: [{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ validator: checkphone, message: '请输入正确格式的手机号', trigger: 'blur' }
					],
					role_name: [{ required: true, message: '请选择角色名称', trigger: 'change' }],
					avatar: [{ required: true, message: '请选择图片', trigger: 'change' }],
				}
			}
		},
		created() {
			this.loadList();
			this.loadAdminlist();
		},
		watch: {
			'$route'(to, from) {
				let { id } = to.params;
				this.loadList(id);
			}
		},
		methods: {
			//获取用户信息
			async loadList() { /* 加载列表数据 */
				let { status, data } = await User.list();
				if (status) {
					this.tableData = data;
				}
			},
			//获取角色列表
			async loadAdminlist(){
				let { status, data } = await Admin.list({});
				if(status){
					this.AdminList=data;
				}
				//console.log(this.AdminList)
			},
			//删除用户信息
			removeUser(id, index) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
					type: 'warning'
				}).then(async () => {
					let { status, data } = await User.remove({ id });
					if (status) {
						//更新DOM
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			//获取个人信息
			async handleInfo(id) {
				this.dialogFormVisible = true;
				let { status, data } = await User.info({ id });
				if (status) {
					this.form = data;
				}
			},
			//头像上传成功
			handleUploadSuccess(res) {
				this.form.avatar = res.src;
			},
			//编辑个人信息
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await User.edit({...this.form});
						if (status) {
							this.$message.success('修改成功!');
							this.dialogFormVisible = false;
							//更新DOM======================================================================
							this.loadList();
						}
					} else {
						this.$message.info('修改失败!');
						return false;
					}
				});
			},
			//手机号验证
			isCellPhone(val) {
				if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
					return false;
				} else {
					return true;
				}
			},
		}
	}
</script>

<style scoped="scoped">
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.list-avatar {
		border-radius: 50%;
	}

	/* 超级管理员变色 */
	.color {
		background-color: #FEF0F0;
		color: #F66C81;
	}
</style>
