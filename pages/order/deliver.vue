<template>
	<view>
		<u-toast ref="uToast" />
		<helang-compress ref="helangCompress"></helang-compress>
		<view class="signature">
			<view>电子签名({{usertel}})</view>
			<canvas class="mycanvas" canvas-id="mycanvas" disable-scroll="true" @touchstart="touchstart" @touchmove="touchmove"
			 @touchend="touchend"></canvas>
			<view class="clear" @click="clear">清除</view>
		</view>
		<view class="upload">
			<view class="uUpload">
				<view class="tips">卸货车照</view>
				<u-upload ref="uUpload_1" :action="action" :form-data="type" :auto-upload="false" :width="215" :deletable="deletabl_1"
				 :size-type="['compressed']" :before-upload="beforeUpload" @on-success="on_success_1" @on-uploaded="on_uploaded"
				 max-count=3>
				</u-upload>
			</view>
			<view class="uUpload">
				<view class="tips">签单回执</view>
				<u-upload ref="uUpload_2" :action="action" :form-data="type" :auto-upload="false" :width="215" :deletable="deletabl_2"
				 :size-type="['compressed']" :before-upload="beforeUpload" @on-success="on_success_2" @on-uploaded="on_uploaded"
				 max-count=3>
				</u-upload>
			</view>
		</view>

		<view class="submitBtn">
			<u-button shape="circle" type="warning" @click="submit_Click">提交</u-button>
		</view>
	</view>
</template>

<script>
	var x = 20
	var y = 20
	export default {
		data() {
			return {
				user: {},
				location: {}, //当前位置
				usertel: '',
				ctx: '', //绘图图像
				canvasw: '',
				canvash: '',
				x: '',
				y: '',
				points: [], //路径点集合 
				signature: '',
				date: new Date().toISOString().slice(0, 10),
				action: this.siteBaseUrl + 'upload',
				unload_url_1: "", // 卸货车照片地址
				unload_url_2: "", // 签单回执地址
				canvas_url: "", //电子签名
				path: "", //base64
				deletabl_1: true, // 删除图片按钮
				deletabl_2: true, // 删除图片按钮
				ifSign: false, //是否签名
				orderId: '',
				orderStatus: '',
				type: {
					"type": "receipt"
				},
			}
		},
		onLoad(option) {

			this.orderId = option.orderId
			this.orderStatus = option.orderStatus
		},
		onReady: function(e) {

			uni.getSystemInfo({
				success: function(res) {
					this.canvasw = res.windowWidth
					this.canvash = res.windowHeight
				},
			})
			// 创建绘图对象
			this.ctx = uni.createCanvasContext("mycanvas", this)
			this.ctx.lineWidth = 1
			this.ctx.lineCap = "round"
			this.ctx.lineJoin = "round"
			this.ctx.setFontSize(12)
			this.ctx.fillText(this.date, 10, 140)
			this.ctx.fillText("司机在此签名", 260, 140)
			this.ctx.draw()

		},
		created() {

			var that = this
			this.user = uni.getStorageSync(this.user_info_key).user
			this.usertel = this.user.mobile
			uni.getLocation({
				type: 'gcj02',
				geocode: true, //设置该参数为true可直接获取经纬度及城市信息
				success: function(res) {
					that.llocation = res
				},
				fail: function() {
					uni.showToast({
						title: '获取地址失败，将导致部分功能不可用',
						icon: 'none'
					})
				},
			})
		},
		methods: {

			// 触摸开始，获取到起点 
			touchstart: function(e) {

				let startX = e.changedTouches[0].x
				let startY = e.changedTouches[0].y
				let startPoint = {
					X: startX,
					Y: startY
				}
				this.points.push(startPoint)
				// 每次触摸开始，开启新的路径
				this.ctx.beginPath()
			},

			// 触摸移动，获取到路径点
			touchmove: function(e) {
				let moveX = e.changedTouches[0].x
				let moveY = e.changedTouches[0].y
				let movePoint = {
					X: moveX,
					Y: moveY
				}
				// 存点
				this.points.push(movePoint)
				let len = this.points.length
				if (len >= 2) {
					// 绘制路径
					this.draw()
				}
				this.ifSign = true
			},

			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend: function() {
				this.points = []
			},

			/* ***********************************************
			#   绘制笔迹
			#	1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#	2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#	3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw: function() {

				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X, point1.Y)
				this.ctx.lineTo(point2.X, point2.Y)
				this.ctx.stroke()
				this.ctx.draw(true)
			},

			// 清空画布
			clear: function() {

				this.ctx.clearRect(0, 0, this.canvasw, this.canvash)
				this.ctx.setFontSize(12)
				this.ctx.fillText(this.date, 10, 140)
				this.ctx.fillText("司机在此签名", 260, 140)
				this.ctx.draw()
				this.ifSign = false
				this.canvas_url = ""
			},

			//提交按钮
			submit_Click() {

				if (!this.ifSign) {
					this.$refs.uToast.show({
						title: "请签名",
						type: 'error',
						duration: '2300'
					})
					return
				}
				if (this.$refs.uUpload_1.lists.length == 0) {
					this.$refs.uToast.show({
						title: "请上传卸货车照",
						type: 'error',
						duration: '2300'
					})
					return
				}
				if (this.$refs.uUpload_2.lists.length == 0) {
					this.$refs.uToast.show({
						title: "请上传签单回执",
						type: 'error',
						duration: '2300'
					})
					return
				}
				var that = this
				var path = ""
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						// 相对路径
						var savedFilePath = res.tempFilePath

						// #ifdef APP-PLUS
						// 绝对路径
						var imgpath = plus.io.convertLocalFileSystemURL(savedFilePath)
						var fileReader = new plus.io.FileReader()
						fileReader.readAsDataURL(imgpath)
						// 读取文件成功完成的回调函数,输出base64
						fileReader.onloadend = function(evt) {
							that.http_request({
								url: 'uploadFileBytes',
								data: {
									fileBytes: evt.target.result,
									type: "receipt",
								},
								method: "POST",
								success: function(fileres) {
									if (fileres.code == 0) {
										that.canvas_url = fileres.imgurl
									}
								},
							})
						}
						// #endif

						// #ifdef MP-WEIXIN
						// 把arraybuffer转成base64 
						path = wx.arrayBufferToBase64(savedFilePath)
						path = 'data:image/jpeg;base64,' + path
						// #endif

						// #ifdef H5
						// base64 
						path = res.tempFilePath
						console.log("H5")
						// #endif
					},
				})

				if (!path) {
					this.http_request({
						url: 'uploadFileBytes',
						data: {
							fileBytes: path,
							type: "receipt",
						},
						method: "POST",
						success: function(fileres) {
							if (fileres.code == 0) {
								that.canvas_url = fileres.imgurl
							}
						},
					})
				}
				this.$refs.uUpload_1.upload()
				this.$refs.uUpload_2.upload()
			},

			beforeUpload(index, list) {

				var item = list[index]
				var that = this
				this.$refs.helangCompress.compress({
					src: item.file.path,
					maxSize: 20,
					fileType: 'jpg',
					quality: 0.835
				}).then((res) => {
					// 压缩成功回调
					return res
				}).catch((err) => {
					// 压缩失败回调
					console.log(res)
				})
			},
			on_success_1(data) {
				this.unload_url_1 += data.imgurl + ";"
				this.deletable_1 = false
			},
			on_success_2(data) {
				this.unload_url_2 += data.imgurl + ";"
				this.deletable_2 = false
			},

			//所有图片上传完毕触发
			on_uploaded() {
				if (!this.canvas_url || !this.unload_url_1 || !this.unload_url_2) {
					return
				}

				var imgs = this.unload_url_1 + this.unload_url_2 + this.canvas_url
				var that = this
				this.http_request({
					url: 'order/receiptOrders',
					data: {
						uid: that.user.id,
						orderId: that.orderId,
						utype: that.orderStatus,
						imgs: that.imgs,
						lat: that.llocation.latitude,
						lng: that.llocation.longitude,
					},
					method: "POST",
					success: function(res) {
						if (res.code == 0) {
							that.$refs.uToast.show({
								title: '订单交付成功',
								type: 'success',
								duration: '2300'
							})
						} else {
							that.$refs.uToast.show({
								title: '订单交付失败',
								type: 'error',
								duration: '2300'
							})
						}

						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabbar4/index',
								success: function() {
									uni.setStorageSync('swiperCurrent_key', '2')
								}
							})
						}, 2000)
					}
				})
			},
		}
	}
</script>

<style>
	.signature {
		text-align: center;
		padding: 30rpx 0;
	}

	.mycanvas {
		margin: 20rpx auto;
		width: 96%;
		height: 300rpx;
		border: 1rpx solid #71B900;
	}

	.clear {
		margin: 10rpx auto;
		text-align: center;
		width: 140rpx;
		line-height: 60rpx;
		border-radius: 8rpx;
		background-color: #71B900;
		color: #fff;
	}

	.upload {
		padding: 50rpx 20rpx;
	}

	.uUpload {
		padding-bottom: 30rpx;
	}

	.tips {
		padding: 10rpx 20rpx;
	}

	.submitBtn {
		margin: 100rpx 150rpx;
	}
</style>
