<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>订单列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="#" width="50px">
			</el-table-column>
			<el-table-column width="650px">
				<template slot-scope="scope">
					<el-table :data="scope.row.goodsList">
						<el-table-column label="商品" width="410">
							<template slot-scope="scope">
								<div>
									<el-image style="width: 80px;" :src="scope.row.img_md"></el-image>
									<span style="padding-left: 10px;" class="one">{{scope.row.name}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="goods_price" label="单价">
						</el-table-column>
						<el-table-column prop="goods_num" label="数量">
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>

			<el-table-column prop="payment" label="付款总额" width="100">
			</el-table-column>
			<el-table-column prop="create_time" label="下单时间" sortable width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="150">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="primary" plain icon="el-icon-edit"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>

</template>

<script>
	import { Purchase } from "@/api/index"
	export default {
		data() {
			return {
				tableData: []
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			async loadList() {
				let { status, data } = await Purchase.list({});
				if (status) {
					this.tableData = data
					this.tableData.forEach((item,index)=>{
						item.create_time=formatUTC(item.create_time);
					})
				}
				//console.log(this.tableData);
			}
		}
	}
	function formatUTC(utc_datetime) {
			// 转为正常的时间格式 年-月-日 时:分:秒
			var T_pos = utc_datetime.indexOf('T');
			var Z_pos = utc_datetime.indexOf('Z');
			var year_month_day = utc_datetime.substr(0, T_pos);
			var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
			var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06
		
			// 处理成为时间戳
			timestamp = new Date(Date.parse(new_datetime));
			timestamp = timestamp.getTime();
			timestamp = timestamp / 1000;
		
			// 增加8个小时，北京时间比utc时间多八个时区
			var timestamp = timestamp + 8 * 60 * 60;
		
			// 时间戳转为时间
			var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
			return beijing_datetime;
		}
</script>

<style>
	.one {
		position: absolute;
		top: 30px;
	}
</style>
