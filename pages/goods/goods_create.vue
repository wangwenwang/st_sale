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
		<view style="overflow: hidden;" @click="to_type_click()">
			<u-field v-model="product_catego" :disabled="true" placeholder-style="color: #c2c2c2" :border-bottom="false" label="商品分类"
			 input-align="right" style="width: calc(100% - 50rpx);float: left;" placeholder="请选择"></u-field>
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
		<!-- 商品宽图 -->
		<view style="width: 100%; overflow: hidden;">
			<view style="line-height:88rpx;padding-left:28rpx;">商品宽图
			</view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片宽高为：1017*492px，图片大小小于1M</view>
			<view style="margin-left: 18rpx;">
				<u-upload @on-list-change="on_list_change" @on-remove="on_remove_imgWide" :file-list="imgWide_preset_url" max-count="1"
				 :form-data="type" :auto-upload="false" @on-success="on_success_imgWide" :action="action" ref="upload_imgWide"></u-upload>
			</view>
			<view v-if="edit_item.id" style="color:#d43;margin-left:30rpx;font-size:20rpx;">点击图片放大预览</view>
			<view style="padding:0 30rpx; overflow: hidden;margin-top: 20rpx;">
				<u-line color="#d5f5f5" />
			</view>
		</view>
		<!-- 商品轮播图 -->
		<view style="width: 100%;">
			<view style="line-height: 88rpx; padding-left: 15rpx;">
				<view style="float:left;color:red;">*</view>商品轮播图<text style="font-size:24rpx;color:#999999;margin-left:10rpx;">{{ refs_upload_imgSlide_count }}/10</text>
			</view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片宽高为：1125*1125px，图片大小小于1M</view>
			<view style="margin-left: 18rpx;">
				<u-upload @on-list-change="on_list_change" @on-remove="on_remove_imgSlide" :file-list="imgSlide_preset_url"
				 max-count="10" :form-data="type" :auto-upload="false" @on-success="on_success_imgSlide" :action="action" ref="upload_imgSlide"></u-upload>
			</view>
			<view v-if="edit_item.id" style="color:#d43;margin-left:30rpx;font-size:20rpx;">点击图片放大预览</view>
			<view style="padding:0 30rpx; overflow: hidden;margin-top: 20rpx;">
				<u-line color="#d5f5f5" />
			</view>
		</view>
		<!-- 商品详情图 -->
		<view style="width: 100%;">
			<view style="line-height: 88rpx; padding-left: 28rpx;">商品详情图<text style="font-size:24rpx;margin-left:10rpx;color:#999999;">{{ refs_upload_imgDetail_count }}/10</text></view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片尺寸：宽度为1125px
				高度小于1500px，图片大小小于1M</view>
			<view style="margin-left: 18rpx;">
				<u-upload @on-list-change="on_list_change" @on-remove="on_remove_imgDetail" :file-list="imgDetail_preset_url"
				 max-count="10" :form-data="type" :auto-upload="false" @on-success="on_success_imgDetail" :action="action" ref="upload_imgDetail"></u-upload>
			</view>
			<view v-if="edit_item.id" style="color:#d43;margin-left:30rpx;font-size:20rpx;">点击图片放大预览</view>
			<view style="padding:0 30rpx; overflow: hidden;margin-top: 20rpx;">
				<u-line color="#d5f5f5" />
			</view>
		</view>
		<!-- 商品白底图 -->
		<view style="width: 100%; overflow: hidden;">
			<view style="line-height:88rpx;padding-left:28rpx;">商品白底图<text style="margin-left:20rpx;background:linear-gradient(315deg,#ff8f13,#ff7708);color:white;font-size:15rpx;">上传可提升商品销量</text>
			</view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片宽高为：1125*1125px，图片大小小于1M</view>
			<view style="padding-left: 28rpx;margin-top: 2rpx;font-size: 24rpx;color: #999999;">内容要求为：需正面居中展现一个主体商品，平铺或挂拍，无模特和背景，背景为255白色</view>
			<view style="margin-left: 18rpx;">
				<u-upload @on-list-change="on_list_change" @on-remove="on_remove_imgWhite" :file-list="imgWhite_preset_url"
				 max-count="1" :form-data="type" :auto-upload="false" @on-success="on_success_imgWhite" :action="action" ref="upload_imgWhite"></u-upload>
			</view>
			<view v-if="edit_item.id" style="color:#d43;margin-left:30rpx;font-size:20rpx;">点击图片放大预览</view>
			<view style="padding:0 30rpx; overflow: hidden;margin-top: 20rpx;">
				<u-line color="#d5f5f5" />
			</view>
		</view>
		<!-- 检验检疫证明图 -->
		<view style="width: 100%;">
			<view style="line-height: 88rpx; padding-left: 28rpx;">检验检疫证明<text style="font-size:24rpx;margin-left:10rpx;color:#999999;">{{ refs_upload_imgProve_count }}/1</text></view>
			<view style="padding-left: 28rpx;margin-top: -25rpx;font-size: 24rpx;color: #999999;">图片尺寸：宽度为1125px
				高度小于1500px，图片大小小于1M</view>
			<view style="margin-left: 18rpx;">
				<u-upload @on-list-change="on_list_change" @on-remove="on_remove_imgProve" :file-list="imgProve_preset_url"
				 max-count="1" :form-data="type" :auto-upload="false" @on-success="on_success_imgProve" :action="action" ref="upload_imgProve"></u-upload>
			</view>
			<view v-if="edit_item.id" style="color:#d43;margin-left:30rpx;font-size:20rpx;">点击图片放大预览</view>
			<view style="padding:0 30rpx; overflow: hidden;margin-top: 20rpx;">
				<u-line color="#d5f5f5" />
			</view>
		</view>

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
				type1: 0, // 分类1
				type2: 0, // 分类2
				type3: 0, // 分类3
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
				edit_item: {}, // 商品列表里的元素，用来做编辑功能
				// 商品轮播图
				refs_upload_imgSlide_count: 0, // 监听当前图片数量
				imgSlide_upload_complete_count: 0, // 商品轮播图数量，监听上传成功数量
				imgSlide_url: "", // 商品轮播图链接，多个图片用英文逗号分割
				imgSlide_preset_url: [], // 商品轮播图链接，显示预置的图片
				// 商品详情图
				refs_upload_imgDetail_count: 0, // 监听当前图片数量
				imgDetail_upload_complete_count: 0, // 商品详情数量，监听上传成功数量
				imgDetail_url: "", // 商品详情链接，多个图片用英文逗号分割
				imgDetail_preset_url: [], // 商品详情链接，显示预置的图片
				// 商品宽图
				imgWide_upload_complete_count: 0, // 商品宽图数量，监听上传成功数量
				imgWide_url: "", // 商品宽图链接，多个图片用英文逗号分割
				imgWide_preset_url: [], // 商品宽图链接，显示预置的图片
				// 商品白底图
				imgWhite_upload_complete_count: 0, // 商品白底图数量，监听上传成功数量
				imgWhite_url: "", // 商品白底图链接，多个图片用英文逗号分割
				imgWhite_preset_url: [], // 商品白底图链接，显示预置的图片
				// 检验检疫证明
				refs_upload_imgProve_count: 0, // 监听当前图片数量
				imgProve_upload_complete_count: 0, // 检验检疫证明数量，监听上传成功数量
				imgProve_url: "", // 检验检疫证明链接，多个图片用英文逗号分割
				imgProve_preset_url: [], // 检验检疫证明链接，显示预置的图片
				// 商品分类带参数回来时，路由跳转需要
				data: {},
				my_data: null,
			}
		},
		onLoad(option) {

			if (option.edit_item) {
				this.edit_item = JSON.parse(option.edit_item)
			}
			if (this.edit_item.id) {
				this.product_name = this.edit_item.title
				this.product_format = this.edit_item.specs
				this.purchase_price = this.edit_item.priceIn
				this.sale_price = this.edit_item.priceOut
				this.edit_date = this.u_date.y_m_d(this.edit_item.editTm)
				this.type1 = this.edit_item.type1
				this.type2 = this.edit_item.type2
				this.type3 = this.edit_item.type3
				this.is_frozen = this.edit_item.isFrozen == 1 ? true : false
				// 轮播图
				this.imgSlide_url = this.edit_item.imgSlide
				this.imgSlide_preset_url = this.deal_preset_url(this.edit_item.imgSlide)
				// 详情图
				this.imgDetail_url = this.edit_item.imgDetail
				this.imgDetail_preset_url = this.deal_preset_url(this.edit_item.imgDetail)
				// 宽图
				this.imgWide_url = this.edit_item.imgWide
				this.imgWide_preset_url = this.deal_preset_url(this.edit_item.imgWide)
				// 白底图
				this.imgWhite_url = this.edit_item.imgWhite
				this.imgWhite_preset_url = this.deal_preset_url(this.edit_item.imgWhite)
				// 检验检疫证明
				this.imgProve_url = this.edit_item.imgProve
				this.imgProve_preset_url = this.deal_preset_url(this.edit_item.imgProve)

				// 计算已加载图片数量
				var that = this
				setTimeout(function() {
					that.refs_upload_imgSlide_count = that.$refs.upload_imgSlide.lists.length
					that.refs_upload_imgDetail_count = that.$refs.upload_imgDetail.lists.length
					that.refs_upload_imgProve_count = that.$refs.upload_imgProve.lists.length
				}, 200)
				// 修改标题
				uni.setNavigationBarTitle({
					title: "编辑商品"
				})
			}

			// 请求全部分类列表
			var that = this
			var params = {
				"type": "goodsType"
			}
			this.http_request({
				url: "ddGoodsType/getGoodsTypes",
				data: {
					"params": JSON.stringify(params)
				},
				method: "POST",
				success: function(res) {
					uni.setStorageSync(that.product_type_list_key, res.list)
					that.deal_product_type()
				}
			})
		},
		onShow() {

			var pages = getCurrentPages()
			var currPage = pages[pages.length - 1]
			let obj = currPage.data.my_data
			if (obj) {
				this.type1 = obj.type1
				this.type2 = obj.type2
				this.type3 = obj.type3
			}
			this.deal_product_type()
		},
		methods: {
			upload_file() {
				uni.uploadFile()
			},
			// 通过分类id显示分类名称
			deal_product_type() {

				if (this.type1 != 0) {
					var a = this.get_type_name(this.type1)
					var b = this.get_type_name(this.type2)
					var c = this.get_type_name(this.type3)
					this.product_catego = a + ">" + b + ">" + c
				}
			},
			// 通过分类id查找分类名称
			get_type_name(id) {

				var type_list = uni.getStorageSync(this.product_type_list_key)
				for (var i = 0; i < type_list.length; i++) {
					var item = type_list[i]
					if (item.id == id) {
						return item.name
						break
					}
				}
			},
			setData(e) {

				this.product_catego = e.my_data.name
				this.type1 = e.my_data.type1
				this.type2 = e.my_data.type2
				this.type3 = e.my_data.type3
			},
			to_type_click() {

				uni.navigateTo({
					url: '/pages/goods/goods_type'
				})
			},
			deal_preset_url(url) {

				if (url == "") {
					return []
				}
				var preset_url = []
				var url_list = url.split(",")
				for (var i = 0; i < url_list.length; i++) {
					var item = {}
					item.url = url_list[i]
					preset_url.push(item)
				}
				return preset_url
			},
			on_list_change() {

				this.refs_upload_imgSlide_count = this.$refs.upload_imgSlide.lists.length
				this.refs_upload_imgDetail_count = this.$refs.upload_imgDetail.lists.length
				this.refs_upload_imgProve_count = this.$refs.upload_imgProve.lists.length
			},
			// 轮播图
			on_remove_imgSlide(index, lists) {

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
				if (this.imgSlide_upload_complete_count == (this.$refs.upload_imgSlide.lists.length - this.imgSlide_preset_url
						.length)) {
					console.log("轮播图上传完成")
					if ((this.$refs.upload_imgDetail.lists.length - this.imgDetail_preset_url
							.length) > 0) {
						console.log("开始上传详情图片")
						this.$refs.upload_imgDetail.upload()
					} else {
						console.log("没有详情图")
						if ((this.$refs.upload_imgWide.lists.length - this.imgWide_preset_url
								.length) > 0) {
							console.log("开始上传宽图")
							this.$refs.upload_imgWide.upload()
						} else {
							console.log("没有宽图")
							if ((this.$refs.upload_imgWhite.lists.length - this.imgWhite_preset_url
									.length) > 0) {
								console.log("开始上传白底图")
								this.$refs.upload_imgWhite.upload()
							} else {
								console.log("没有白底图")
								if ((this.$refs.upload_imgProve.lists.length - this.imgProve_preset_url.length) > 0) {
									console.log("开始上传检验检疫证明图")
									this.$refs.upload_imgProve.upload()
								} else {
									console.log("调用接口")
									this.submit_t(this.imgSlide_url, this.imgDetail_url, this.imgWide_url, this.imgWhite_url, this.imgProve_url)
								}
							}
						}
					}
				}
			},
			// 详情图
			on_remove_imgDetail(index, lists) {

				this.imgDetail_url = ""
				var preset_url = []
				for (var i = 0; i < lists.length; i++) {
					var item = lists[i]
					if (item.progress == 100) {
						if (this.imgDetail_url == "") {
							this.imgDetail_url = item.url
						} else {
							this.imgDetail_url = this.imgDetail_url + "," + item.url
						}
						preset_url.push(item)
					}
				}
				this.imgDetail_preset_url = preset_url
			},
			on_success_imgDetail(data) {

				this.imgDetail_upload_complete_count++
				console.log("上传第" + this.imgDetail_upload_complete_count + "张")
				if (this.imgDetail_url == "") {
					this.imgDetail_url = data.imgurl
				} else {
					this.imgDetail_url = this.imgDetail_url + "," + data.imgurl
				}
				if (this.imgDetail_upload_complete_count == (this.$refs.upload_imgDetail.lists.length - this.imgDetail_preset_url
						.length)) {
					console.log("详情图上传完成")
					if ((this.$refs.upload_imgWide.lists.length - this.imgWide_preset_url
							.length) > 0) {
						console.log("开始上传宽图")
						this.$refs.upload_imgWide.upload()
					} else {
						console.log("没有宽图")
						if ((this.$refs.upload_imgWhite.lists.length - this.imgWhite_preset_url
								.length) > 0) {
							console.log("开始上传白底图")
							this.$refs.upload_imgWhite.upload()
						} else {
							console.log("没有白底图")
							if ((this.$refs.upload_imgProve.lists.length - this.imgProve_preset_url.length) > 0) {
								console.log("开始上传检验检疫证明图")
								this.$refs.upload_imgProve.upload()
							} else {
								console.log("调用接口")
								this.submit_t(this.imgSlide_url, this.imgDetail_url, this.imgWide_url, this.imgWhite_url, this.imgProve_url)
							}
						}
					}
				}
			},
			// 宽图
			on_remove_imgWide(index, lists) {

				this.imgWide_url = ""
				var preset_url = []
				for (var i = 0; i < lists.length; i++) {
					var item = lists[i]
					if (item.progress == 100) {
						if (this.imgWide_url == "") {
							this.imgWide_url = item.url
						} else {
							this.imgWide_url = this.imgWide_url + "," + item.url
						}
						preset_url.push(item)
					}
				}
				this.imgWide_preset_url = preset_url
			},
			on_success_imgWide(data) {

				this.imgWide_upload_complete_count++
				console.log("上传第" + this.imgWide_upload_complete_count + "张")
				if (this.imgWide_url == "") {
					this.imgWide_url = data.imgurl
				} else {
					this.imgWide_url = this.imgWide_url + "," + data.imgurl
				}
				if (this.imgWide_upload_complete_count == (this.$refs.upload_imgWide.lists.length - this.imgWide_preset_url
						.length)) {
					console.log("宽图上传完成")
					if ((this.$refs.upload_imgWhite.lists.length - this.imgWhite_preset_url
							.length) > 0) {
						console.log("开始上传白底图")
						this.$refs.upload_imgWhite.upload()
					} else {
						console.log("没有白底图")
						if ((this.$refs.upload_imgProve.lists.length - this.imgProve_preset_url.length) > 0) {
							console.log("开始上传检验检疫证明图")
							this.$refs.upload_imgProve.upload()
						} else {
							console.log("调用接口")
							this.submit_t(this.imgSlide_url, this.imgDetail_url, this.imgWide_url, this.imgWhite_url, this.imgProve_url)
						}
					}
				}
			},
			// 白底图
			on_remove_imgWhite(index, lists) {

				this.imgWhite_url = ""
				var preset_url = []
				for (var i = 0; i < lists.length; i++) {
					var item = lists[i]
					if (item.progress == 100) {
						if (this.imgWhite_url == "") {
							this.imgWhite_url = item.url
						} else {
							this.imgWhite_url = this.imgWhite_url + "," + item.url
						}
						preset_url.push(item)
					}
				}
				this.imgWhite_preset_url = preset_url
			},
			on_success_imgWhite(data) {

				this.imgWhite_upload_complete_count++
				console.log("上传第" + this.imgWhite_upload_complete_count + "张")
				if (this.imgWhite_url == "") {
					this.imgWhite_url = data.imgurl
				} else {
					this.imgWhite_url = this.imgWhite_url + "," + data.imgurl
				}
				if (this.imgWhite_upload_complete_count == (this.$refs.upload_imgWhite.lists.length - this.imgWhite_preset_url
						.length)) {
					console.log("白底图上传完成")
					if ((this.$refs.upload_imgProve.lists.length - this.imgProve_preset_url
							.length) > 0) {
						console.log("开始上传检验检疫证明图")
						this.$refs.upload_imgProve.upload()
					} else {
						console.log("调用接口")
						this.submit_t(this.imgSlide_url, this.imgDetail_url, this.imgWide_url, this.imgWhite_url, this.imgProve_url)
					}
				}
			},
			// 检验检疫证明图
			on_remove_imgProve(index, lists) {

				this.imgProve_url = ""
				var preset_url = []
				for (var i = 0; i < lists.length; i++) {
					var item = lists[i]
					if (item.progress == 100) {
						if (this.imgProve_url == "") {
							this.imgProve_url = item.url
						} else {
							this.imgProve_url = this.imgProve_url + "," + item.url
						}
						preset_url.push(item)
					}
				}
				this.imgProve_preset_url = preset_url
			},
			on_success_imgProve(data) {

				this.imgProve_upload_complete_count++
				console.log("上传第" + this.imgProve_upload_complete_count + "张")
				if (this.imgProve_url == "") {
					this.imgProve_url = data.imgurl
				} else {
					this.imgProve_url = this.imgProve_url + "," + data.imgurl
				}
				if (this.imgProve_upload_complete_count == (this.$refs.upload_imgProve.lists.length - this.imgProve_preset_url
						.length)) {
					console.log("上传完成")
					console.log("调用接口")
					this.submit_t(this.imgSlide_url, this.imgDetail_url, this.imgWide_url, this.imgWhite_url, this.imgProve_url)
				}
			},
			submit_click() {

				if (this.product_name.length == 0) {
					this.$refs.uToast.show({
						title: "请输入商品名称",
						type: 'error'
					})
					return
				}
				if (this.$refs.upload_imgSlide.lists.length == 0) {
					this.$refs.uToast.show({
						title: "请上传商品轮播图",
						type: 'error'
					})
					return
				}
				// 没改或删除了图片
				if (this.edit_item.id &&
					this.$refs.upload_imgSlide.lists.length == this.imgSlide_preset_url.length &&
					this.$refs.upload_imgDetail.lists.length == this.imgDetail_preset_url.length &&
					this.$refs.upload_imgWide.lists.length == this.imgWide_preset_url.length &&
					this.$refs.upload_imgWhite.lists.length == this.imgWhite_preset_url.length &&
					this.$refs.upload_imgProve.lists.length == this.imgProve_preset_url.length) {
					this.submit_t(this.imgSlide_url, this.imgDetail_url, this.imgWide_url, this.imgWhite_url, this.imgProve_url)
					return
				}
				// 增加轮播图
				if (this.edit_item.id &&
					this.$refs.upload_imgSlide.lists.length > this.imgSlide_preset_url.length) {
					this.$refs.upload_imgSlide.upload()
					return
				}
				// 增加详情图
				if (this.edit_item.id &&
					this.$refs.upload_imgDetail.lists.length > this.imgDetail_preset_url.length) {
					this.$refs.upload_imgDetail.upload()
					return
				}
				// 增加宽图
				if (this.edit_item.id &&
					this.$refs.upload_imgWide.lists.length > this.imgWide_preset_url.length) {
					this.$refs.upload_imgWide.upload()
					return
				}
				// 增加白底图
				if (this.edit_item.id &&
					this.$refs.upload_imgWhite.lists.length > this.imgWhite_preset_url.length) {
					this.$refs.upload_imgWhite.upload()
					return
				}
				// 增加检验检疫证明图
				if (this.edit_item.id &&
					this.$refs.upload_imgProve.lists.length > this.imgProve_preset_url.length) {
					this.$refs.upload_imgProve.upload()
					return
				}
				this.$refs.upload_imgSlide.upload()
			},
			submit_t(imgSlide, imgDetail, imgWide, imgWhite, imgProve) {

				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"businessId": u.userId,
					"title": this.product_name,
					"imgSlide": imgSlide,
					"imgDetail": imgDetail,
					"imgWide": imgWide,
					"imgWhite": imgWhite,
					"imgProve": imgProve,
				}
				if (this.product_format.length) params.specs = this.product_format
				if (this.purchase_price) params.priceIn = parseInt(this.purchase_price)
				if (this.sale_price) params.priceOut = parseInt(this.sale_price)
				if (this.deal_edit_date().length) params.editDate = this.deal_edit_date()
				if (this.is_frozen) params.isFrozen = this.is_frozen
				if (this.type1) params.type1 = this.type1
				if (this.type2) params.type2 = this.type2
				if (this.type3) params.type3 = this.type3
				// if (imgDetail.length) params.imgDetail = imgDetail
				// if (imgWide.length) params.imgWide = imgWide
				// if (imgWhite.length) params.imgWhite = imgWhite

				var api = "ddGoods/addGoods"
				if (this.edit_item.id) {
					api = "ddGoods/editGoods"
					params.goodsId = this.edit_item.id
				}
				this.http_request({
					url: api,
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {
						var title = "添加成功"
						if (that.edit_item.id) {
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
