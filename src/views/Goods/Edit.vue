<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>编辑商品</span>
		</div>
		<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label="商品分类">
				<el-select v-model.number="form.cate_1st" placeholder="请选择">
					<el-option v-for="option in options_1st" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
				<el-select v-model.number="form.cate_2nd" placeholder="请选择">
					<el-option v-for="option in options_2nd" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
				<el-select v-model.number="form.cate_3rd" placeholder="请选择">
					<el-option v-for="option in options_3rd" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="form.name" style="width: 600px;"></el-input>
				<span class="tip">商品标题名称长度至少3个字符，最长200个汉字</span>
			</el-form-item>
			<el-form-item label="商品卖点">
				<el-input type="textarea" v-model="form.hotPoint" :autosize="{ minRows: 2, maxRows: 4}" style="width: 600px;">
				</el-input>
				<span class="tip">商品卖点不能超过140个汉字</span>
			</el-form-item>
			<el-form-item label="商品价格">
				<el-input style="width: 220px;" v-model.number="form.price">
					<template slot="append">元</template>
				</el-input>
				<span class="tip">价格必须是0-999999之间的数字，且不能高于市场价</span>
				<span class="tip">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</span>
			</el-form-item>
			<el-form-item label="市场价">
				<el-input style="width: 220px;" v-model.number="form.marketPrice">
					<template slot="append">元</template>
				</el-input>
				<span class="tip">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</span>
			</el-form-item>
			<el-form-item label="成本价">
				<el-input style="width: 220px;" v-model.number="form.cost">
					<template slot="append">元</template>
				</el-input>
				<span class="tip">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</span>
			</el-form-item>
			<el-form-item label="折扣">
				<el-input style="width: 220px;" v-model.number="form.discount">
					<template slot="append">元</template>
				</el-input>
				<span class="tip">根据销售价与市场价比例自动生成不需要编辑</span>
			</el-form-item>
			<el-form-item label="商品库存">
				<el-input style="width: 220px;" v-model.number="form.inventory">
					<template slot="append">件</template>
				</el-input>
				<span class="tip">价格必须是0-999999之间的整数</span>
				<span class="tip">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</span>
			</el-form-item>
			<el-form-item label="商品货号">
				<el-input style="width: 220px;" v-model.number="form.articleNo"></el-input>
				<span class="tip">商品货号是商家管理商品的编号，买家不可见</span>
				<span class="tip">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</span>
			</el-form-item>
			<el-form-item label="商品主图">
				<!-- :url='form.main_photo'  @remove="form.main_photo=''" -->
				<Upload :url="form.img_md" :action='action' @success="handleUploadSuccess($event)" @remove="form.img_md=''"></Upload>
				<span class="tip">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
					800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</span>
			</el-form-item>
			<el-form-item label="商品轮播图">
				<el-upload action="/api/upload/slider"  :headers="headers" :file-list="sliderList" list-type="picture-card" :on-preview="handlePictureCardPreview"
				 :on-success="sliderSuccess" :on-remove="handleRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="form.slider" alt="">
				</el-dialog>
				<span class="tip">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
					800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</span>
			</el-form-item>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">商品详情描述</div>
			</el-col>
			<el-form-item label="商品品牌">
				<el-input style="width: 600px;" v-model="form.brand"></el-input>
			</el-form-item>
			<el-form-item label="商品描述">
				<div ref="editor"></div>
			</el-form-item>
			<div class="grid-content bg-purple-dark">商品物流信息</div>
			<el-form-item label="所在地">
				<el-select v-model='address.province'>
					<el-option v-for="(item,index) in address_1st" :key='item._id' :label="item.name" :value="item.province_id">
					</el-option>
				</el-select>
				<el-select v-model="address.city">
					<el-option v-for="(item,index) in address_2nd" :key='item._id' :label="item.name" :value="item.city_id">
					</el-option>
				</el-select>
				<el-select v-model="address.county">
					<el-option v-for="(item,index) in address_3rd" :key='item._id' :label="item.name" :value="item.county_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运费">
				<el-input style="width: 220px;" v-model.number="form.freight">
					<template slot="append">元</template>
				</el-input>
				<span class="tip">运费设为0，前台商品将显示免运费</span>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="onSubmit">提交</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>

	</el-card>
</template>

<script>
	import { UploadIndex } from '@/api/index.js'
	import { Goods } from '@/api/index.js'
	//引入省份接口
	import { Address } from '@/api/index'
	import E from 'wangeditor'; //引入富文本编辑器
	import Upload from '@/components/Upload.vue'; //引入组件
	import { Category } from '@/api/index'
	export default {
		props: ['id'], //对应路由接口的解耦
		components: {
			Upload,
		},
		data() {
			return {
				//添加头部header属性，验证token
				headers:{
					Authorization: `Bearer ${sessionStorage.token}`
				},
				form: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: '',
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					brand: '',
					detail: '',
					freight: ''
				},
				address: {
					province: '',
					city: '',
					county: '',
				},
				options_1st: [],
				options_2nd: [],
				options_3rd: [],
				//省市区三级联动
				address_1st: [],
				address_2nd: [],
				address_3rd: [],
				sliderList: [], //分割轮播图
				dialogImageUrl: '',
				action: '/api/upload/goods',
				dialogVisible: false,
				disabled: false
			}
		},
		async created() {
			//获取子级分类
			let options = await this.loadSubcate(1);
			//赋给一级分类的数组
			this.options_1st = options;
			//获取省份城市
			let address = await this.loadAddressList();
			this.address_1st = address;
			this.address.province = address[0].province_id;

		},
		watch: {
			'form.cate_1st': async function(val) {
				//获取二级分类
				let options = await this.loadSubcate(val);
				//给二级分类数组赋值
				this.options_2nd = options;
				//根据一级分类的id自动选中二级分类的第一个值,默认选择第一项
				this.form.cate_2nd = options[0].id;
			},
			'form.cate_2nd': async function(val) {
				//获取三级分类
				let options = await this.loadSubcate(val);
				//给三级分类数组赋值
				this.options_3rd = options;
				//根据二级分类的id自动选中三级分类的第一个值,默认选择第一项
				if (val == 0) {
					this.form.cate_3rd = 0;
				} else {
					this.form.cate_3rd = options[0].id
				}
			},
			//获取到城市
			'address.province': async function(val) {
				// console.log(val);
				let address = await this.loadAddressCity(val);
				//获取城市地区
				this.address_2nd = address;
				this.address.city = address[0].city_id;
			},
			'address.city': async function(val) {
				let options = await this.loadCounty(val);
				this.address_3rd = options;
				this.address.county = options[0].county_id;
			},
		},
		async mounted() {
			//获取商品详情
			let GoodDetalis = await this.loadInfo(this.id);
			this.form = GoodDetalis;
			// this.form.slider.split(",");
			//切割轮播图
			this.form.slider = this.form.slider.split(",");
			this.form.slider.forEach((item, index) => {
				if (item !== "") {
					this.sliderList[index] = {
						url: item
					}
					this.$set(this.sliderList, index, this.sliderList[index]);
				}
			})
			console.log(this.sliderList);
			console.log(this.form);
			//富文本编辑器
			var editor = new E(this.$refs.editor)
			editor.customConfig.onchange = (html) => {
				this.form.detail = html
				
			}
			editor.customConfig.uploadImgServer = '/api/upload/editor'   //配置图片上传
			
			editor.customConfig.uploadFileName = 'file'   //自定义上传filename
			
			editor.customConfig.uploadImgHeaders = {     //自定义头部信息
			    'Authorization': `Bearer ${sessionStorage.token}`
			}
			editor.create();
			editor.txt.html(this.form.detail);
		},
		methods: {
			//编辑指定id商品
			async loadInfo(id) {
				let { status, data } = await Goods.details({ id });
				if (status) {
					return data
				}
			},
			async loadSubcate(id) {
				//父级节点Id
				let pId = id;
				let { status, data } = await Category.category({ pId });
				//吧data return出去，在created生命周期调用，return出去的是一个promise对象
				return data
			},
			//获取省份地区
			async loadAddressList() {
				let { status, data } = await Address.list({});
				return data;
			},
			//获取城市
			async loadAddressCity(id) {
				let { status, data } = await Address.city({ id });
				return data;
			},
			//获取区级城市
			async loadCounty(id) {
				console.log(id)
				let { status, data } = await Address.county({ id });
				return data;
			},
			//头像上传成功 console.log(res)打印res,出来的是一个对象，对里面的属性进行解构
			handleUploadSuccess(res) {
				//console.log(res)
				this.form.img_md = res.lgImg;
			},
			//保存
			async onSubmit() {
				let { status } = await Goods.edit({ ...this.form });
				if (status) {
					this.$message.success('修改成功');
					this.$router.replace('/goods/list');
				} else {
					this.$message.error('修改失败');
				}
			},
			//轮播图上传
			sliderSuccess(res, file) {
				let { status, src, msg } = res;
				this.form.slider += (src + ',');
				console.log(this.form.slider);
			},
			//放大图片
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.form.slider = file.url;
				this.dialogVisible = true;
				//console.log(this.dialogImageUrl)
			},
			//删除图片
			async handleRemove(file, fileList) {
				let src = '';
				fileList.forEach((item) => {
					src += (item.url + ',');
				})
				this.form.slider = src;
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

	.tip {
		font-size: 12px;
		color: #999;
		display: block;
	}

	.el-select .el-input {
		width: 130px;
	}

	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}

	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		background: #F5F5F5;
		padding: 10px;
		margin-bottom: 10px;
	}
</style>
