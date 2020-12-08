<template>
	<view class="wrap">
		<!-- 控件 -->
		<u-toast ref="uToast" />
		<u-modal v-model="pull_off_shelves_show" @confirm="put_pull_shelves_click_confirm('下架')" :show-title="false"
		 :show-cancel-button="true" content="确定下架此商品？"></u-modal>
		<u-modal v-model="put_on_shelves_show" @confirm="put_pull_shelves_click_confirm('上架')" :show-title="false"
		 :show-cancel-button="true" content="确定上架此商品？"></u-modal>
		<!-- 顶部菜单栏 -->
		<u-tabs-swiper active-color="#f29100" ref="tabs" :list="menu_list" :current="current" @change="tabsChange" :is-scroll="false"
		 swiperWidth="750"></u-tabs-swiper>
		<view style="padding:0 0rpx;">
			<u-line color="#e2e2e2" />
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">

			<swiper-item class="swiper-item" v-for="(it, idx) in page_container_list" :key="idx">
				<scroll-view scroll-y style="height:100%;width:100%;" @scrolltolower="onreachBottom">
					<view style="padding-top: 10rpx;margin-left: 15rpx;margin-right: 15rpx;">
						<u-search :animation="true" :show-action="false" @change="search_change" placeholder="按订单号搜索" input-align="center"
						 v-model="keyword"></u-search>
					</view>
					<!-- 与u-tabs-swiper无关，自己的内容 -->
					<view class="order" v-for="(res, idx) in it" @click="item_click(res)">
						<view class="top">
							<view class="one">
								<view class="left">
									<text class="icon">装</text>
									<text font-size="30rpx;" space="ensp">{{res.issueCity}} {{res.issueDistrict}}</text>
								</view>
								<view class="crtTm">{{res.crtTm}}</view>
							</view>
							<view class="two">
								<view class="left">
									<text class="icon">卸</text>
									<text font-size="30rpx;" space="ensp">{{res.receiveCity}} {{res.receiveDistrict}}</text>
								</view>
							</view>
						</view>
						<view class="Info">
							<view class="Image">
								<u-image style="width:100%; height:90%; overflow: hidden;" height="90%" :src="logo_url" shape="circle" mode="scaleToFill"></u-image>
							</view>
							<view class="orderInfo">
								<view class="one">
									<text v-if="res.publishUserName">{{res.publishUserName}}，</text>
									<text v-if="res.goodsType">{{res.goodsType}}，</text>
									<text v-if="res.totalWeight">{{res.totalWeight}}千克，</text>
									<text v-if="res.totalVol">{{res.totalVol}}方</text>
								</view>
								<view class="two">
									<text v-if="res.vehicleSpecs" space="ensp">{{res.vehicleSpecs}} {{res.vehicleType}}，</text>
									<!-- <text v-if="res.loadingTime">{{res.loadingTime}}装货，</text> -->
									<text>{{res.uploudType}} </text>
								</view>
							</view>
						</view>
						<view class="evaluate" v-if="res.orderStatus == 4">
							<u-button v-if="evaluated" shape="circle" size="mini" @click="toEvaluate_Click(idx)">评 价</u-button>
							<u-button v-if="!evaluated" shape="circle" size="mini" @click="evaluated_Click(idx)">已评价</u-button>
						</view>

					</view>
					<view style="margin-top:30rpx;">
						<u-gap height="30" bg-color="#f5f5f5"></u-gap>
					</view>
					<!-- 与u-tabs-swiper无关，自己的内容结束 -->
				</scroll-view>
			</swiper-item>

		</swiper>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				page_container_list: [
					[],
					[]
				], // 页数列表
				pull_off_shelves_show: false, // 是否上架
				put_on_shelves_show: false, // 是否下架
				operation_item: {}, // 操作的元素
				menu_list: [{
					name: '已接单'
				}, {
					name: '运输中'
				}, {
					name: '评价'
				}, {
					name: '全部'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				businessId: 0, // 用户id
				keyword: "", // 搜索关键词
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				load_status: ['loadmore', 'loadmore'],
				params_index: [1, 1],
				params_size: 50,
				allow_next_page: true, // 是否允许上拉刷新，避免多次触发上拉函数导致bug
				logo_url: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3057463025,217485477&fm=26&gp=0.jpg",
				mode_data: {
					"msg": "操作成功",
					"code": 0,
					"list": [{
						"id": 47,
						"orderNo": "12020120417365779791753549",
						"externalOrderNo": null,
						"clientOrderNo": null,
						"clientId": 1,
						"clientName": "深圳凯东源物流有限公司",
						"issueProvince": "广东省",
						"issueCity": "东莞市",
						"issueDistrict": "福田区",
						"receiveProvince": "广东省",
						"receiveCity": "深圳市",
						"receiveDistrict": null,
						"goodsType": "钢铁 ",
						"totalWeight": 2,
						"totalVol": 3,
						"totalCount": 4,
						"vehicleType": "金杯车",
						"vehicleSpecs": "10.5M",
						"uploudType": "一装一卸",
						"priceType": null,
						"totalPrice": 210.6,
						"price": 200,
						"realPrice": null,
						"platformPrice": 10.6,
						"floatPrice": 0,
						"orderStatus": 2,
						"payStatus": null,
						"payRemark": null,
						"payCtm": null,
						"payEndTm": null,
						"loadLat": null,
						"loadLng": null,
						"publishUserId": null,
						"publishUserName": "admin",
						"publishUserPhone": null,
						"driverId": 55,
						"driverName": "离地铁",
						"driverPhone": "13726027405",
						"orderEndTm": null,
						"orderRemark": "",
						"deliveryDate": null,
						"receiptDate": null,
						"receiptRemark": null,
						"receiptImg": null,
						"crtTm": 1607074619000,
						"lmfName": "离地铁",
						"lmfTm": 1607074766000,
						"isComment": 0
					}]
				}
			}
		},
		watch: {
			swiperCurrent(newVal, oldVal) {
				if (oldVal != newVal) {
					console.log("watch")
					this.params_index[this.swiperCurrent] = 1
					this.request_list()
				}
			}
		},
		onShow() {

			console.log("onShow")
			this.params_index[this.swiperCurrent] = 1
			this.request_list()
		},
		onLoad(option) {

			console.log("onLoad")
			if (option.businessId) {
				this.businessId = JSON.parse(option.businessId)
			}
		},
		// 下拉监听事件
		onPullDownRefresh() {

			this.params_index[this.swiperCurrent] = 1
			this.request_list()
		},
		created() {

			console.log("created")
		},
		methods: {
			item_click(res) {

				uni.navigateTo({
					url: '/pages/order/detail?orderId=' + res.orderId + "&orderStatus=" + res.orderStatus
				})
			},
			search_change(val) {

				this.keyword = val
				this.params_index[this.swiperCurrent] = 1
				this.request_list()
			},
			// 13位时间戳 --> 2020-12-03 11:22:19
			timeStamp(value) {
				var date = new Date(value)
				var year = date.getFullYear()
				var month = ("0" + (date.getMonth() + 1)).slice(-2)
				var sdate = ("0" + date.getDate()).slice(-2)
				var hour = ("0" + date.getHours()).slice(-2)
				var minute = ("0" + date.getMinutes()).slice(-2)
				var second = ("0" + date.getSeconds()).slice(-2)
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second
				return result
			},
			// 13位时间戳 --> 1分钟前
			deal_last_edit_time(dateTimeStamp) {
				var minute = 1000 * 60
				var hour = minute * 60
				var day = hour * 24
				var week = day * 7
				var halfamonth = day * 15
				var month = day * 30
				var now = new Date().getTime()
				var diffValue = now - dateTimeStamp
				if (diffValue < 0) {
					console.log("diffValue<0", datetime, dateTimeStamp, now, diffValue);
					return '刚刚'
				}
				// 计算时间差的分，时，天，周，月
				var minC = diffValue / minute
				var hourC = diffValue / hour
				var dayC = diffValue / day
				var weekC = diffValue / week
				var monthC = diffValue / month
				var result = "2"
				// if (monthC >= 1 && monthC <= 3) {
				// 	result = " " + parseInt(monthC) + "月前"
				// } else if (weekC >= 1 && weekC <= 3) {
				// 	result = " " + parseInt(weekC) + "周前"
				// } else if (dayC >= 1 && dayC <= 6) {
				// 	result = " " + parseInt(dayC) + "天前"
				// } else if (hourC >= 1 && hourC <= 23) {
				// 	result = " " + parseInt(hourC) + "小时前"
				// } 
				// else 
				if (minC >= 1 && minC <= 59) {
					result = " " + parseInt(minC) + "分钟前"
				} else if (diffValue >= 0 && diffValue <= minute) {
					result = "刚刚"
				} else {
					var datetime = new Date()
					datetime.setTime(dateTimeStamp)
					var Nyear = datetime.getFullYear()
					var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1
					var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate()
					var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours()
					var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes()
					var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds()
					result = Nyear + "-" + Nmonth + "-" + Ndate + " " + Nhour + ":" + Nminute + ":" + Nsecond
				}
				return result
			},
			// 预览图片单张
			preview_img(imgs_url) {

				let imgs_array = this.imgsUrl_to_imgsArray(imgs_url)
				uni.previewImage({
					current: 0,
					urls: imgs_array
				})
			},
			// 多图片链接，取第一个图片
			deal_img_url(url) {

				var url_list = url.split(",")
				return url_list.length ? url_list[0] : ""
			},
			// 多图片链接，用英文逗号分割，转成图片数组
			imgsUrl_to_imgsArray(url) {

				var url_list = url.split(",")
				return url_list.length ? url_list : []
			},
			// scroll-view到底部加载更多
			onreachBottom() {

				// 避免上拉时多次触发此事件
				if (this.allow_next_page) {
					this.allow_next_page = false
					if (this.page_container_list[this.current].length) {
						this.load_status.splice(this.current, 1, "loading")
						var that = this
						setTimeout(() => {
							that.params_index[that.swiperCurrent]++
							that.request_list()
						}, 1200)
					}
				}
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// tab栏切换
			tabsChange(index) {

				this.swiperCurrent = index;
			},
			request_list() {

				var status = 0
				if (this.swiperCurrent == 1) {
					status = -2
				}
				const u = uni.getStorageSync(this.user_info_key).user
				this.page_container_list[this.swiperCurrent] = this.mode_data.list
			},
			add_click() {

				uni.navigateTo({
					url: '/pages/goods/goods_create'
				})
			},
			edit_click(item) {

				var it = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/order/detail'
				})
			},
			pull_off_shelves_click(item) {

				this.operation_item = item
				this.pull_off_shelves_show = true
			},
			put_on_shelves_click(item) {

				this.operation_item = item
				this.put_on_shelves_show = true
			},
			put_pull_shelves_click_confirm(tag) {

				var status = -1
				if (tag == "上架") {
					status = 0
				} else if (tag == "下架") {
					status = -2
				}
				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"businessId": u.userId,
					"goodsId": this.operation_item.id,
					"status": status,
				}
				this.http_request({
					url: 'ddGoods/unSellGoods',
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {

						that.params_index[that.swiperCurrent] = 1
						that.request_list()
						that.$refs.uToast.show({
							title: tag + "成功",
							type: 'success'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			.left {
				line-height: 50rpx;

				text {
					padding: 8rpx;
				}
			}

			.one,
			.two {
				display: flex;
				font-weight: 550;
				justify-content: space-between;
				margin-bottom: 10rpx;

				.icon {
					font-size: 26rpx;
					border: 1rpx solid #FACE51;
					border-radius: 8rpx;
					background-color: #FACE51;
					font-weight: 500;
				}

				.crtTm {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #999;
				}
			}

			.two {
				.icon {
					border: 1rpx solid #FD757F;
					background-color: #FD757F;
				}
			}

			.right {
				color: $u-type-warning-dark;
			}
		}

		.Info {
			display: flex;
			justify-content: flex-start;

			.Image {
				width: 90rpx;
				margin-right: 10rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					padding-top: 6rpx;
				}
			}

			.orderInfo {
				width: 90%;

				.one,
				.two {
					line-height: 50rpx;

					.view {
						margin-right: 3rpx;
					}
				}

				.two {}
			}
		}

		.evaluate {
			text-align: right;

			button {
				color: #EC662C;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
			}
		}
	}
</style>
