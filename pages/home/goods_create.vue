<template>
	<view>
		<!-- 控件 -->
		<u-toast ref="uToast" />
		<u-calendar v-model="calendar_show" max-date="2022-01-01" min-date="2020-10-01" mode="date" @change="calendar_complete"></u-calendar>
		<u-picker v-model="frozen_show" mode="selector" :range="frozen_list" @confirm="frozen_picker_comfirm"></u-picker>

		<!-- Cell -->
		<u-field v-model="product_name" :required="true" placeholder-style="color: #c2c2c2" style="overflow: hidden; color: #444444;"
		 :border-bottom="false" label="商品标题" placeholder="请输入商品品牌+名称+规格"></u-field>
		<view style="padding:0 30rpx;">
			<u-line color="#d5f5f5" />
		</view>
		<u-field v-model="product_format" placeholder-style="color: #c2c2c2" style="overflow: hidden;" :border-bottom="false"
		 label="商品规格" placeholder="请输入商品销售规格，与商品标题中的规格保持一致，如X个/份"></u-field>
		<view style="padding:0 30rpx;">
			<u-line color="#d5f5f5" />
		</view>
		<u-field v-model="purchase_price" placeholder-style="color: #c2c2c2" style="overflow: hidden;" :border-bottom="false"
		 label="进货价格" placeholder="单位(元)"></u-field>
		<view style="padding:0 30rpx;">
			<u-line color="#d5f5f5" />
		</view>
		<u-field v-model="sale_price" placeholder-style="color: #c2c2c2" style="overflow: hidden;" :border-bottom="false"
		 label="出货价格" placeholder="单位(元)"></u-field>
		<view style="padding:0 30rpx;">
			<u-line color="#d5f5f5" />
		</view>
		<u-field v-model="edit_date" placeholder-style="color: #c2c2c2" style="overflow: hidden;" :disabled="true"
		 :border-bottom="false" label="编辑时间" placeholder="" @click="calendar_show = true"></u-field>
		<view style="padding:0 30rpx;">
			<u-line color="#d5f5f5" />
		</view>
		<view style="overflow: hidden;">
			<u-field v-model="product_catego" placeholder-style="color: #c2c2c2" :border-bottom="false" label="商品分类" input-align="right"
			 style="width: calc(100% - 50rpx);float: left;" placeholder="请选择"></u-field>
			<u-icon name="arrow-right" style="float: right;line-height: 88rpx;width: 50rpx;height: 88rpx;"></u-icon>
		</view>
		<view style="padding:0 30rpx;">
			<u-line color="#d5f5f5" />
		</view>
		<view style="height: 88rpx;width: 100%;">
			<view style="line-height: 88rpx; padding-left: 28rpx; float: left;">是否冻品</view>
			<u-switch v-model="is_frozen" style="float: right; margin-top: 20rpx;margin-right: 30rpx;"></u-switch>
			<view style="float: right; line-height: 88rpx;margin-right: 15rpx;">{{ get_frozen_status() }}</view>
		</view>
		<view style="padding:0 30rpx; overflow: hidden;">
			<u-line color="#d5f5f5" />
		</view>
		<!-- 暂时不区分冷冻和冷藏 -->
		<!-- <view v-if="is_frozen == true">
			<u-field v-model="frozen_type" placeholder-style="color: #c2c2c2" :border-bottom="false" :disabled="true" label="冻品类型"
			 input-align="right" style="width: calc(100% - 50rpx);float: left;" placeholder="请选择" @click="frozen_show = true"></u-field>
			<u-icon name="arrow-right" style="float: right;line-height: 88rpx;width: 50rpx;height: 88rpx;"></u-icon>
			<view style="padding:0 30rpx; overflow: hidden;">
				<u-line color="#d5f5f5" />
			</view>
		</view> -->

		<!-- 上传图片 -->
		<!-- <view style="width: 100%; overflow: hidden;">
			<view style="line-height: 88rpx; padding-left: 15rpx;">
				<view style="float:left;color:red;">*</view> 商品宽图:file-list="fileList" 
			</view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片宽高为：1017*492px，图片大小小于1M</view>
			<u-upload max-count="1" :form-data="type" ref="uUpload_1" :auto-upload="false" @on-success="on_success_imgSlide" style="margin-left: 18rpx;"
			 :action="action"></u-upload>
			<u-line color="#d5f5f5" margin="0 30rpx" style="margin-left:30rpx;width:calc(100% - 60rpx);overflow:hidden;" />
		</view> -->
		<view style="width: 100%;">
			<view style="line-height: 88rpx; padding-left: 15rpx;">
				<view style="float:left;color:red;">*</view> 商品轮播图
			</view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片宽高为：1125*1125px，图片大小小于1M</view>
			<view style="margin-left: 18rpx;">
				<u-upload @on-remove="on_remove" :file-list="imgSlide_preset_url" max-count="100" :form-data="type" :auto-upload="false"
				 @on-success="on_success_imgSlide" :action="action" ref="upload_product_picture"></u-upload>
			</view>
			<view style="padding:0 30rpx; overflow: hidden;">
				<u-line color="#d5f5f5" />
			</view>
		</view>
		<!-- <view style="width: 100%;">
			<view style="line-height: 88rpx; padding-left: 28rpx;">商品详情图<text style="font-size: 24rpx; color: #999999;">0/10</text></view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片尺寸：宽度为1125px
				高度小于1500px，图片大小小于1M</view>
			<u-upload style="margin-left: 18rpx;" :action="action"></u-upload>
			<u-line color="#d5f5f5" margin="0 30rpx" style="margin-left:30rpx;width:calc(100% - 60rpx);overflow:hidden;" />
		</view> -->

		<!-- 按钮 -->
		<view style="margin-left:30rpx;margin-right:30rpx;margin-top:50rpx;">
			<u-button @click="submit_click()" type="warning">发布</u-button>
		</view>
		<view style="height:40rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				product_name: '', // 商品名称
				product_format: '', // 商品规格
				purchase_price: '', // 进货价
				sale_price: '', // 销售价
				edit_date: ' ', // 编辑时间
				product_catego: '', // 商品分类
				is_frozen: false, // 是否冻品
				calendar_show: false, // 是否弹出日期控件
				frozen_show: false, // 是否弹出Picker控件
				frozen_type: "", // 冻品类型
				frozen_list: ['冷藏品', '冷冻品'], // 冻品类型
				action: this.siteBaseUrl + 'upload', // 上传图片链接
				type: {
					"type": "goods"
				},
				item: {}, // 商品列表里的元素，用来做编辑功能
				imgSlide_upload_complete_count: 0, // 产品轮播图数量，监听上传成功数量
				imgSlide_url: 0, // 产品轮播图链接，多个图片用英文逗号分割
				imgSlide_preset_url: [], // 产品轮播图链接，显示预置的图片
			}
		},
		onLoad(option) {

			if (option.item) {
				this.item = JSON.parse(option.item)
			}
			if (this.item.id) {
				this.product_name = this.item.title
				this.product_format = this.item.specs
				this.purchase_price = this.item.priceIn
				this.sale_price = this.item.priceOut
				this.edit_date = this.timestampToTime(this.item.editTm)
				this.is_frozen = this.item.isFrozen == 1 ? true : false
				this.imgSlide_url = this.item.imgSlide
				this.imgSlide_preset_url = this.deal_preset_url(this.item.imgSlide)
			}
		},
		methods: {

			deal_preset_url(url) {

				var preset_url = []
				var url_list = url.split(",")
				for (var i = 0; i < url_list.length; i++) {
					var item = {}
					item.url = url_list[i]
					preset_url.push(item)
				}
				return preset_url
			},
			// 时间戳转换成时间
			timestampToTime(cjsj) {

				if (cjsj) {
					var date = new Date(cjsj)
					var Y = date.getFullYear() + '-'
					var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
					var D = date.getDate()
					return Y + M + D
				}
				return ""
			},
			on_remove(index, lists) {

				this.imgSlide_url = ""
				var preset_url = []
				for (var i = 0; i < lists.length; i++) {
					var item = lists[i]
					if (item.progress == 100) {
						if (this.imgSlide_url == "") {
							this.imgSlide_url = item.url
						} else {
							this.imgSlide_url = this.imgSlide_url + "," + item.url
						}
						preset_url.push(item)
					}
				}
				this.imgSlide_preset_url = preset_url
			},
			on_success_imgSlide(data) {

				this.imgSlide_upload_complete_count++
				console.log("上传第" + this.imgSlide_upload_complete_count + "张")
				if (this.imgSlide_url == "") {
					this.imgSlide_url = data.imgurl
				} else {
					this.imgSlide_url = this.imgSlide_url + "," + data.imgurl
				}
				if (this.imgSlide_upload_complete_count == (this.$refs.upload_product_picture.lists.length - this.imgSlide_preset_url
						.length)) {
					console.log("上传完成")
					this.submit_t(this.imgSlide_url)
				}
			},
			submit_click() {

				if (this.item.id && this.$refs.upload_product_picture.lists.length == this.imgSlide_preset_url.length) {
					this.submit_t(this.imgSlide_url)
					return
				}
				if (this.product_name.length == 0) {
					this.$refs.uToast.show({
						title: "请输入商品名称",
						type: 'error'
					})
					return
				}
				if (this.$refs.upload_product_picture.lists.length == 0) {
					this.$refs.uToast.show({
						title: "请上传商品轮播图",
						type: 'error'
					})
					return
				}
				this.$refs.upload_product_picture.upload()
			},
			submit_t(image_url) {

				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"businessId": u.id,
					"title": this.product_name,
					// "specs": this.product_format,
					// "priceIn": this.purchase_price,
					// "priceOut": this.sale_price,
					// "editDate": this.deal_edit_date(),
					// "isFrozen": this.is_frozen,
					"imgSlide": image_url
				}
				if (this.product_format.length) params.specs = this.product_format
				if (this.purchase_price.length) params.priceIn = this.purchase_price
				if (this.sale_price.length) params.priceOut = this.sale_price
				if (this.deal_edit_date().length) params.editDate = this.deal_edit_date()
				if (this.is_frozen) params.isFrozen = this.is_frozen

				var api = "ddGoods/addGoods"
				if (this.item.id) {
					api = "ddGoods/editGoods"
					params.goodsId = this.item.id
				}
				this.http_request({
					url: api,
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {
						var title = "添加成功"
						if (that.item.id) {
							title = "更新成功"
						}
						that.$refs.uToast.show({
							title: title,
							type: 'success'
						})
						setTimeout(function() {
							// 当前页面
							let pages = getCurrentPages()
							// 前一个页面
							let beforePage = pages[pages.length - 2]
							uni.navigateBack({
								delta: 1,
								success: function() {
									// 执行前一个页面的刷新
									beforePage.$vm.request_list()
								}
							})
						}, 2000)
					}
				})
			},
			deal_edit_date() {

				if (this.edit_date.length > 10) {
					return this.edit_date.substr(0, 10)
				}
				return this.edit_date
			},
			// 获取是否冻品提示文案
			get_frozen_status() {
				if (this.is_frozen) {
					return "是"
				}
				return "否"
			},
			// 编辑时间选择完成
			calendar_complete(e) {

				this.edit_date = e.result + "（" + e.week + "）"
			},
			// 完成选择冻品类型
			frozen_picker_comfirm(index) {

				this.frozen_type = this.frozen_list[index]
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
