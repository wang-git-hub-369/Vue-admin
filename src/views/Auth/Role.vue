<template>
	<div class="card-box">
		<el-col :span="10">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>角色列表</span>
					<el-button type="primary" plain size="mini" icon="el-icon-circle-plus-outline" style="float: right;" @click='dialogTableVisible = true;'>添加角色</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="#">
					</el-table-column>
					<el-table-column label="角色">
						<template slot-scope='scope'>
							<el-tag>{{scope.row.name}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template slot-scope='scope'>
							<el-button type="primary" plain size="mini" :disabled="scope.row.name === '超级管理员'" icon="el-icon-edit" @click="openModalEdit(scope.row.id,scope.row.name)"></el-button>
							<el-button plain size="mini" type="danger" :disabled="scope.row.name === '超级管理员'" icon="el-icon-delete" @click="openRemoveModal(scope.row.id,scope.$index)"></el-button>
							<el-button plain size="mini" type="primary" icon="el-icon-setting" @click='openConfigModal(scope.row.id,scope.$index)'></el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 添加模态框 -->
				<el-dialog title="添加角色" :visible.sync="dialogTableVisible">
					<el-form ref="roleform" :model="roleform">
						<el-form-item label="名称" :label-width="formLabelWidth">
							<el-input v-model="roleform.name" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogTableVisible = false">取 消</el-button>
						<el-button type="primary" @click="addsubmitForm('form')">确 定</el-button>
					</div>
				</el-dialog>
				<!-- 编辑模态框 -->
				<el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
					<el-form ref="form" :model="form">
						<el-form-item label="名称" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="submitForm('form')">确 定</el-button>
					</div>
				</el-dialog>
			</el-card>
		</el-col>
		<el-col :span="14">
			<el-card class="box-set-card" v-show="dialogConfigVisible" v-for="(item,index) in config">
				<div slot="header" class="clearfix">
					<i class="el-icon-collection-tag" style="color:#409eff; font-size: 14px;margin-right: 5px;"></i>
					<span style="color:#409eff; font-size: 14px;">{{item.name}}</span>
					<el-switch v-model="item.checked" style="float: right;" @change='switchId(item.id,index)'>
					</el-switch>
				</div>
				<div v-for="(item,idx) in item.children" style="margin-bottom: 10px;">
					<span style="color: #909399;font-size: 12px;">{{item.name}}</span>
					<el-switch v-model="item.checked" style="float: right;" @change="checkedSingle(item.id,idx,index)"></el-switch>
				</div>
			</el-card>
		</el-col>
	</div>
</template>
<script>
	import { Auth } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				formLabelWidth: '120px',
				dialogTableVisible: false,
				dialogFormVisible: false,
				dialogConfigVisible: false,
				value1: true, //滑块
				config: [], //菜单数组
				configEdit: {
					role_id: 0,
					menu_id: 0,
				}, //添加菜单
				form: {
					id: '',
					name: ''
				},
				roleform: {
					name: ''
				},
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			//获取角色列表
			async loadList() {
				let { status, data } = await Auth.list({});
				if (status) {
					this.tableData = data;
				}
			},
			//显示点击修改的角色
			openModalEdit(id, name) {
				//打开模态框
				this.dialogFormVisible = true;
				this.form.id = id;
				this.form.name = name;

			},
			//修改角色
			async submitForm() {
				let { status, msg } = await Auth.edit({ ...this.form });
				if (status) {
					this.$message.success('修改成功!');
					this.dialogFormVisible = false;
					//更新DOM======================================================================
					this.loadList();
				} else {
					this.$message.info('修改失败!');
					return false;
				}
			},
			//添加角色
			async addsubmitForm() {
				var k = 0;
				for (var i = 0; i < this.tableData.length; i++) {
					if (this.roleform.name == this.tableData[i].name) {
						k++;
					}
				}
				if (k == 0) {
					let { status, data } = await Auth.add({ ...this.roleform });
					if (status) {
						this.$message.success('添加成功!');
						//调用获取列表
						this.loadList();
						this.dialogTableVisible = false;
						//清空添加
						this.roleform = {
							name: ''
						};
					} else {
						this.$message.info('添加失败!');
					}
				} else {
					this.$message.error('添加角色不能重复');
					//清空添加
					this.roleform = {
						name: ''
					};
				}
			},
			//删除模态框
			openRemoveModal(id, i) {
				this.$confirm('此操作将永久删除该角色及其关联账户, 是否继续?', {
						type: 'warning'
					})
					.then(async () => {
						let { status, data } = await Auth.remove({ id });
						if (status) {
							//更新Dom，更新页面
							this.tableData.splice(i, 1)
							this.$message.success('删除成功!');
						}
					})
					.catch(() => {
						this.$message.info('取消删除');
					});
			},
			//设置菜单
			async openConfigModal(id) {
				console.log(id);
				//取到role_id
				this.configEdit.role_id = id;
				this.dialogConfigVisible = true;
				//console.log(id);
				let { status, data } = await Auth.config({ id });
				if (status) {
					this.config = data;
				}
			},
			// 父级开关的绑定事件
			async switchId(id, index) {
				this.configEdit.menu_id = id;
				console.log(this.configEdit);
				if (!this.config[index].checked) {
					//父级开关发送后台删除
					let { status, data } = await Auth.removemenu({ ...this.configEdit });
					//循环孩子的长度
					for (var i = 0; i < this.config[index].children.length; i++) {
						//取出孩子数组里面的id
						var id = this.config[index].children[i].id;
						//取到menu_id
						this.configEdit.menu_id = id;
						let { status, data } = await Auth.removemenu({ ...this.configEdit });
						// 更新dom元素
						this.config[index].children[i].checked = false;
					}
				} else {
					let { status, data } = await Auth.addmenu({ ...this.configEdit });
					for (var i = 0; i < this.config[index].children.length; i++) {
						this.config[index].children[i].checked = true;
						var id = this.config[index].children[i].id;
						this.configEdit.menu_id = id;
						let { status, data } = await Auth.addmenu({ ...this.configEdit });
					}
				}
			},
			//子级开关的绑定事件
			async checkedSingle(menu_id, i, idx) {
				if (this.config[idx].children[i].checked == false) {
					this.configEdit.menu_id = menu_id
					let { status, data } = await Auth.removemenu(this.configEdit);
					var num = 0
					for (var j = 0; j < this.config[idx].children.length; j++) {
						if (this.config[idx].children[j].checked == true) {
							num++
						}
					}
					if (num >= 1) {
						this.config[idx].checked = true
						var ID = this.config[idx].id
						this.configEdit.menu_id = ID
						let { status, data } = await Auth.addmenu(this.configEdit);
					} else {
						this.config[idx].checked = false
						var ID = this.config[idx].id
						this.configEdit.menu_id = ID
						let { status, data } = await Auth.removemenu(this.configEdit);
					}
				} else {
					this.configEdit.menu_id = menu_id
					let { status, data } = await Auth.addmenu(this.configEdit);
					var num = 0
					for (var j = 0; j < this.config[idx].children.length; j++) {
						if (this.config[idx].children[j].checked == true) {
							num++
						}
					}
					if (num >= 1) {
						this.config[idx].checked = true
						var ID = this.config[idx].id
						this.configEdit.menu_id = ID
						let { status, data } = await Auth.addmenu(this.configEdit);
					} else {
						this.config[idx].checked = false
						var ID = this.config[idx].id
						this.configEdit.menu_id = ID
						let { status, data } = await Auth.removemenu(this.configEdit);
					}
				}
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

	.box-card {
		margin-right: 20px;
	}

	.box-set-card {
		margin-bottom: 10px;
	}
</style>
