<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>菜单权限</span>
			</div>
			<el-alert class="Tips" title="Tips" type="warning" :closable='false' description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示"
			 show-icon>
			</el-alert>
			<el-tree ref="tree" node-key="id" :load="loadNode" lazy :default-expanded-keys="[0]" :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<!-- <span><i :class='data.icon'></i></span> -->
						<el-popover placement="left-start" width="100" trigger="hover">
							<i :class="data.icon" style="font-size: 25px;"></i>
							<el-button type="text" slot="reference" :icon="data.icon" size="mini" @click.stop='openIconModal(node,data)'
							 :disabled="node.level==1">
								图标
							</el-button>
						</el-popover>
						<el-button type="text" icon="el-icon-edit" @click.stop='openEditModal(node,data)' :disabled="node.level==1" size="mini">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" @click.stop='openInserModal(node,data)' size="mini">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" @click.stop='openRemoveModal(node,data)' :disabled="node.level==1"
						 size="mini">
							删除
						</el-button>
						<span class="size">显示序号</span>
						<el-tag class="number">{{data.order}}</el-tag>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加节点" :visible.sync="insertModalShow">
			<el-form :model="insertForm" :rules="rules" ref="insertForm">
				<el-form-item label="菜单名称" label-width="120px" prop="name">
					<el-input autocomplete="off" v-model="insertForm.name"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px">
					<el-input autocomplete="off" placeholder="指定此菜单的链接地址,选填" v-model="insertForm.path"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop="media">
					<el-input autocomplete="off" v-model="insertForm.order" placeholder="显示顺序按照数字从小到大"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">保存</el-button>
				<!--handleInsertNode添加节点  -->
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑节点" :visible.sync="editModalShow">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item label="菜单名称" label-width="120px" prop='name'>
					<el-input v-model="editForm.name" autocomplete="off" ></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px">
					<el-input v-model="editForm.path" autocomplete="off" placeholder="根据此菜单的链接地址，选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop="media">
					<el-input autocomplete="off" v-model="editForm.order"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUpdateNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 图标弹窗 -->
		<el-dialog title="选择图标" :visible.sync="iconModalShow" width='69%'>
			<div class="iconList">
				<div id='icon-box' @click="clickIcon(item.id,item)" v-for="item in iconArray" :key='item.id'>
					<div :class="{clickBlue:  item.id==index}">
						<span><i :class="item.name"></i></span>
						<span>{{item.name}}</span>
					</div>
				</div>
			</div>
			<div class="block">
				<el-pagination @current-change="handleCurrentChange" background layout="->,prev,pager,next" :total="100">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="iconModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUpdateIconNode(node)">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Admin } from '@/api/index'
	import { Icon } from '@/api/index'
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				editIcon: {
					id: 0,
					icon: 0,
					name: ''
				}, //用来修改图标
				index: 0, //判断点击的第几个图标
				insertForm: {}, //用来插入节点
				editForm: {}, //用来编辑节点
				nodeData: {}, //节点数据
				node: {}, //节点 是为了转存数据
				action: '/api/upload/goods',
				insertModalShow: false,
				editModalShow: false,
				iconModalShow: false,
				iconArray: [],
				rules: {
					name: [
						{ required: true, message: '请输入菜单名称', trigger: 'blur' },
						{ min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
					],
					media: [
					{ required: true, message: '请输入显示数字', trigger: 'blur' },
					{ min: 0, max: 99999, message: '数字在 0 到 99999 之间', trigger: 'blur' }
				 ],
				}
			};
		},
		methods: {
			//加载子树数据的方法，仅当 lazy 属性为true 时生效
			async loadNode(node, resolve) { //node代表节点对象，resolve用来返回下一级子节点数据的方法
				if (node.level == 0) {
					//发送后台获取分类
					let { status, data } = await Admin.menu({ pId: 0 });
					return resolve(data)
				}
				//console.log(node);
				//父级节点Id
				let pId = node.data.id;
				//获取子节点数据
				let { status, data } = await Admin.menu({ pId });
				if (status) {
					data.forEach((item, index) => {
						//拼接字符串
						item.icon = 'el-icon-' + item.icon
						//console.log(item)
					})
					//生成子节点
					return resolve(data);
				}
			},
			//打开修改弹框
			openEditModal(node, data) {
				//...data生成一个新的值，赋给editFrom
				this.editForm = { ...data };
				this.node = node; //转存一下父节点的node,是为了在下面可以使用父节点的node数据
				//console.log(node),打印出来的是一个对象
				//打开修改弹框
				this.editModalShow = true;
			},
			//打开添加弹框
			openInserModal(node, data) {
				//node--代表节点对象，data---代表节点数据
				//console.log(node, data)
				this.node = node; //转存一下父节点的node,是为了在下面可以使用父节点的node
				this.insertForm.pId = data.id;
				this.insertModalShow = true;
			},
			//打开图标弹框
			async openIconModal(node, data) {
				//让修改图标的id等于要修改的id
				this.editIcon.id = node.id
				let { status, icons } = await Icon.list({ pageSize: 30 });
				this.iconArray = icons;
				this.iconArray.forEach((item, index) => {
					//拼接字符串
					item.name = 'el-icon-' + item.name;
				})
				//console.log(this.iconArray)
				this.nodeData = data; //缓存一下data数据
				this.iconModalShow = true;
			},
			//插入节点
			async handleInsertNode(formName) {
				//1.表单验证
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.发送ajax
						let { status, data } = await Admin.add({ ...this.insertForm });
						if (status) {
							//提醒添加成功
							this.$message.success('添加成功');
							//更新tree节点---插入新的节点
							//this.$refs.tree调用tree方法 this.node是调用上面转存的父节点的node属性
							this.$refs.tree.append({ ...data, ...this.insertForm }, this.node)
							console.log(this.insertForm);
							console.log(data);
							//清空模态框
							this.insertForm.img = "";
							this.insertForm.name = "";
							this.insertForm.pid = "";
							console.log(this.node)
							//关闭模态框
							this.insertModalShow = false;
						}
					} else {
						this.$message.info('添加失败!');
						return false;
					}
				})
			},
			//编辑节点
			async handleUpdateNode(formName) {
				this.$refs[formName].validate(async (valid) => {
					if(valid){
						let { status, data } = await Admin.edit({ ...this.editForm });
						
						if (status) {
							//提醒修改成功
							this.$message.success('修改成功');
							//更新节点
							this.node.data = this.editForm; //这里的this.nodeData是上面转存起来的数据
							//清空模态框
							this.editForm = {};
							//关闭模态框
							this.editModalShow = false;
						}
					}else{
						this.$message.info('修改失败!');
						return false;
					}
				})
			
			},
			//打开删除弹框
			openRemoveModal(node, data) {
				this.$confirm('此操作将永久删除该菜单, 是否继续?', {
						type: 'warning'
					})
					.then(async () => {
						//取到上面的node的id，根据id进行删除
						var id = node.data.id
						//发送给后台进行删除
						let { status } = await Admin.remove({ id });
						if (status) {
							this.$message.success('删除成功');
							//更新页面
							this.$refs.tree.remove({ ...data })
						}
					})
					.catch(() => {
						this.$message.error('删除失败');
					})
			},
			// 点击分页获取第几页的图标
			async handleCurrentChange(val) {
				let { status, icons } = await Icon.list({ pageSize: 30, pageIndex: val });
				this.iconArray = icons;
				this.iconArray.forEach((item, index) => {
					//拼接字符串
					item.name = 'el-icon' + '-' + item.name
				})
				//console.log(val);
			},
			//点击图标事件
			clickIcon(idx, item) {
				//调用上面定义的index
				this.index = idx;
				//让修改图标对象里面的值等于点击的id
				this.editIcon.icon = this.index;
				//console.log(this.index)
				this.editIcon.name = item.name; //取到点击图标的名字
			},
			//保存
			async handleUpdateIconNode(node) {
				console.log(this.editIcon)
				let { status, data } = await Icon.edit({ ...this.editIcon });
				if (status) {
					this.$message.success('修改图标成功');
					//更新dom页面
					//调用缓存的图标数据，让他的icon等于改变完之后的名字
					this.nodeData.icon = this.editIcon.name;
					this.iconModalShow = false;
				}

			},
		}
	}
</script>

<style scoped="scoped">
	body {
		position: relative;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.Tips {
		margin-bottom: 20px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.size {
		padding-left: 5px;
		padding-right: 5px;
		font-size: 5px;
	}

	.number {
		width: 50px;
		padding-left: 10px;
		padding-right: 10px;
	}

	.is-selected {
		color: #1989FA;
	}

	/* 图标盒子 */
	.iconList {
		display: flex;
		flex-wrap: wrap;
	}

	#icon-box {
		width: 110px;
		height: 100px;
		text-align: center;
		border: 1px solid #D9D9D9;
	}

	#icon-box span {
		display: block;
		font-size: 28px;
		padding-left: 6px;
		padding-right: 6px;
	}

	#icon-box span:first-child {
		/* margin-top: 10px; */
		padding-top: 10px;
	}

	#icon-box span:nth-child(2) {
		font-size: 11px;
		margin-top: 5px;
	}

	#icon-box:hover {
		color: #409EFF;
	}

	/* 分页器 */
	.block {
		margin-top: 20px;
	}

	/* 点击图标，背景色变蓝 */
	.clickBlue {
		background-color: #5CB6FF;
		color: white !important;
		width: 100%;
		height: 100%;
	}

	.clickWhite {
		color: white;
	}
</style>
