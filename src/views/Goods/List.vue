<template>
	<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column label="商品名称" width="555">
					<template scope="scope">
						<div class="scope-box">
							<div>
								<el-image :src="scope.row.img_md" style="width: 80px;"></el-image>
							</div>
							<div class="goods-name">
								<span class="name">{{scope.row.name}}</span>
								<!-- <br> -->
								<span class="num">商品货号:{{scope.row.articleNo}}</span>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="价格" width="80">
				</el-table-column>
				<el-table-column prop="inventory" label="库存" width="80">
				</el-table-column>
				<el-table-column prop="create_time" label="发布数据">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope='scope'>
						<el-link :href="`#/goods/edit/${scope.row.id}`">
							<el-button type="primary" class="editButton" size="mini" plain><i class="el-icon-edit"></i>编辑</el-button>
						</el-link>
						<el-button plain size="mini" type="danger" icon="el-icon-delete" @click='remove(scope.row.id,scope.$index)'></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[4, 8, 16, 32]"
				 background layout="->,prev,pager,next,sizes,total" :total="11">
				</el-pagination>
			</div>
		</el-card>
		<!-- <el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column label="商品名称">
					<template scope="scope">
						<div class="scope-box">
							<div>
								<el-image :src="scope.row.img_md" style="width: 80px;"></el-image>
							</div>
							<div class="goods-name">
								<span>{{scope.row.name}}</span>
								<span>商品货号:{{scope.row.articleNo}}</span>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="价格" sortable  >
				</el-table-column>
				<el-table-column prop="inventory" label="库存" sortable>
				</el-table-column>
				<el-table-column prop="create_time" label="发布数据" sortable>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope='scope'>
						<el-link :href="`#/goods/edit/${scope.row.id}`">
							<el-button type="primary" class="editButton" size="mini" plain><i class="el-icon-edit"></i>编辑</el-button>
						</el-link>
						<el-button plain size="mini" type="danger" icon="el-icon-delete" @click='remove(scope.row.id,scope.$index)'></el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[4, 8, 16, 32]"
				 background layout="->,prev,pager,next,sizes,total" :total="11">
				</el-pagination>
			</div>
		</el-card> -->
</template>

<script>
	import { Goods } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				pageIndex: 1, //api文档默认值
				pageSize: 4, //api文档默认值
				//分页
				currentPage1: 5,
				currentPage2: 5,
				currentPage3: 5,
				currentPage4: 4,
			};
		},
		created() {
			this.loadList();
		},
		methods: {
			//每页几个
			async handleSizeChange(val) {
				//取到上面定义的数值
				let index = this.pageIndex;
				//让点击的val数值缓存起来
				this.pageSize = val
				let { status, goods } = await Goods.list({ pageSize: val, pageIndex: index })
				if (status) {
					this.tableData = goods;
				}
				console.log(val)
			},
			//跳转
			async handleCurrentChange(val) {
				let index = this.pageSize;
				//让点击的val数值缓存起来
				this.pageIndex = val;
				let { status, goods } = await Goods.list({ pageSize: index, pageIndex: val })
				if (status) {
					this.tableData = goods;
				}
			},
			async loadList() {
				let { status, goods } = await Goods.list({})
				if (status) {
					this.tableData = goods;
				}
			},
			//删除商品
			remove(id, i) {
				this.$confirm('此操作将永久删除该商品, 是否继续?', {
						type: 'warning'
					})
					.then(async () => {
						//发送后台进行删除
						let { status } = await Goods.remove({ id });
						if (status) {
							this.tableData.splice(i, 1);
							this.$message.success('删除成功');
						}
					})
					.catch(() => {
						this.$message.info('删除失败');
					})
			}
		},
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

	.block {
		margin-top: 20px;
	}

	.scope-box {
		display: flex;
	}

	.goods-name {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		margin-top: 20px;
		font-size: 12px;
	}
	.editButton{
		margin-right: 10px;
	}
</style>
