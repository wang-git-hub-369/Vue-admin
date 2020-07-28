<template>
	<div>
		<!-- data上传时携带的额外参数    :headers---设置上传请求头部属性        -->
		<el-upload class="avatar-uploader" :headers="headers" :action="action" :data="{type:'avatar'}" :show-file-list="false"
		 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
			<img v-if="url" :src="url" class="avatar" @mouseenter="iconModalenter">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		<div class="icon-two" v-show="isShow" @click="removeAvatar" @mouseleave="iconModalleave">
			<i class="el-icon-delete"></i></div>
	</div>
</template>

<script>
	//引入上传图片接口
	import { UploadIndex } from '@/api/index'
	export default {
		//这里是调用父级的data数据，外部数据
		props: ["url","action"],
		data() {
			return {
				isShow: false,
				//设置上传请求头部属性，token
				headers:{
					Authorization: `Bearer ${sessionStorage.token}`
				}
			}
		},
		methods: {
			//鼠标进入
			iconModalenter() {
				this.isShow = true;
			},
			//鼠标离开
			iconModalleave() {
				this.isShow = false;
			},
			//on-success这里绑定的是下面这个函数---文件上传成功时的钩子	function(response, file, fileList)
			handleAvatarSuccess(res, file, fileList) {
				if (res.status) {
					// 这里输出查看上面的三个参数
					// console.log(res)
					// console.log(file)
					// console.log(fileList)
					//让ruleForm里面的图片路径等于上传完的图片路径,data就是路径
					//提醒父级元素修改
					this.$message.success(res.msg);
					this.$emit('success', res)
				}
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				
				return isJPG && isLt2M;
			},
			//删除图片
			async removeAvatar() {
				//判断是否为默认头像
				let isDefault = this.url.indexOf('default') >= 0;
				//console.log(this.url);
				//如果是默认图片，就发送给父级一个指令
				if (isDefault) {
					this.$emit('remove')
					return false;
				}
				let src = this.url.replace(/.+\/images/, 'images');
				let { status } = await UploadIndex.remove({ src });
				if (status) {
					this.$message.success('删除成功');
					this.$emit('remove');
				}
			}
		}
	}
</script>

<style>
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

	.icon-two {
		color: white;
		width: 178px;
		height: 178px;
		display: block;
		background-color: rgba(0, 0, 0, 0.7);
		text-align: center;
		line-height: 178px;
		position: absolute;
		top: 0;
		font-size: 28px;
		cursor: pointer;
	}
</style>
