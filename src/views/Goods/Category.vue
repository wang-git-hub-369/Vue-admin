<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>分类列表</span>
			</div>
			<!-- 树形组件 :default-expanded-keys="[0]" :props="defaultProps" -->
			<el-tree ref="tree" node-key="id" :load="loadNode" lazy :default-expanded-keys="[0]" :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" icon="el-icon-edit" @click.stop='openEditModal(node,data)' :disabled="node.level==1" size="mini">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" @click.stop='openInserModal(node,data)' size="mini">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" @click.stop='openRemoveModal(node,data)' size="mini">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :model="insertForm" ref="insertForm" :rules="rules">
				<el-form-item label="名称" label-width="120px">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px" prop="img">
					<Upload :url="insertForm.img" :action='action' @success="handleUploadSuccessAdd($event)" @remove="insertForm.img=''"></Upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
				<!--handleInsertNode添加节点  -->
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑节点" :visible.sync="editModalShow">
			<el-form :model="editForm">
				<el-form-item label="名称" label-width="120px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="图片" label-width="120px">
					<el-image style="width: 150px; height: 150px" :src="editForm.img"></el-image>
				</el-form-item> -->
				<el-form-item label="图片" label-width="120px">
					<Upload :url="editForm.img" :action='action' @success="handleUploadSuccess($event)" @remove="editForm.img=''"></Upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUpdateNode">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Category } from '@/api/index'
	import Upload from '@/components/Upload.vue'; //引入组件
	export default {
		components: {
			Upload
		},
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					img: '',
					pId: ''
				},
				editForm: {
					id: '',
					name: '',
					img: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点 是为了转存数据
				action: '/api/upload/goods',
				insertModalShow: false,
				editModalShow: false,
				//表单验证
				rules: {
					img: [
						{ required: true, message: '请选择商品主图', trigger: 'change' }
					],
				}
			};
		},
		methods: {
			//加载子树数据的方法，仅当 lazy 属性为true 时生效
			async loadNode(node, resolve) { //node代表节点对象，resolve用来返回下一级子节点数据的方法
				if (node.level == 0) {
					//发送后台获取分类
					let { status, data } = await Category.category({ pId: 0 });
					return resolve(data)
				}
				//console.log(node);
				//父级节点Id
				let pId = node.data.id;
				//获取子节点数据
				let { status, data } = await Category.category({ pId });
				if (status) {
					//生成子节点
					return resolve(data);
				}
			},
			//打开修改弹框
			openEditModal(node, data) {
				//...data生成一个新的值，赋给editFrom
				this.editForm = { ...data };
				this.node = node; //转存一下父节点的node,是为了在下面可以使用父节点的node数据
				//console.log(node)
				//打开修改弹框
				this.editModalShow = true;
			},
			//打开添加弹框
			openInserModal(node, data) {
				//node--代表节点对象，data---代表节点数据
				//console.log(node, data)
				this.node = node; //转存一下父节点的node,是为了在下面可以使用父节点的node
				this.nodeData = data;
				this.insertForm.pId = data.id;
				this.insertModalShow = true;
			},
			//插入节点
			async handleInsertNode(formName) {
				//1.表单验证
				//1.表单验证
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.发送ajax
						let { status, data } = await Category.add({ ...this.insertForm });
						if (status) {
							//提醒添加成功
							this.$message.success('添加成功');
							//更新tree节点---插入新的节点
							//this.$refs.tree调用tree方法 this.node是调用上面转存的父节点的node属性
							this.insertForm.img = this.editForm.img;
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
					}
				})
			},
			//编辑节点
			async handleUpdateNode() {
				let { status, data } = await Category.update({ ...this.editForm });

				if (status) {
					//提醒修改成功
					this.$message.success('修改成功');
					//更新节点
					this.node.data = this.editForm; //这里的this.nodeData是上面转存起来的数据
					//清空模态框
					this.editForm = {
						id: '',
						name: '',
						img: '',
					};
					//关闭模态框
					this.editModalShow = false;
				}
			},
			//打开删除弹框
			openRemoveModal(node, data) {
				this.$confirm('此操作将永久删除该分类, 是否继续?', {
						type: 'warning'
					})
					.then(async () => {
						//取到上面的node的id，根据id进行删除
						var id = node.data.id
						//发送给后台进行删除
						let { status } = await Category.remove({ id });
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
			//头像上传成功 console.log(res)打印res,出来的是一个对象，对里面的属性进行解构
			handleUploadSuccess(res) {
				//console.log(res)
				this.editForm.img = res.lgImg;
			},
			handleUploadSuccessAdd(res) {
				this.insertForm.img = res.lgImg;
			}
		}
	}
</script>

<style>
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

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>
