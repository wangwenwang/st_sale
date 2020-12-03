<template>
	<view class="wrap">

		<!-- 顶部菜单栏 -->
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height:100%;width:100%;" @scrolltolower="onreachBottom">

					<!-- 与u-tabs-swiper无关，自己的内容 -->
					<view>
						<view v-for="(item , idx) in user_list" :key="item.id" @click="item_click()">
							<view style="overflow: hidden; margin: 30rpx 30rpx 20rpx 30rpx;">
								用户名：{{ item.username }}
							</view>
							<!-- <view style="overflow: hidden; margin: 20rpx 30rpx 20rpx 30rpx;">
								手机号：{{ item.mobile }}
							</view> -->
							<view style="overflow: hidden; margin: 20rpx 30rpx 30rpx 30rpx;">
								手机号：{{ item.mobile }}
							</view>
							<view style="margin-top:30rpx;">
								<u-gap height="30" bg-color="#f5f5f5"></u-gap>
							</view>
						</view>
						<view style="height:180rpx;"></view>
					</view>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_list: [], // 用户列表
				operation_item: {}, // 操作的元素
				current: 0,
				swiperCurrent: 0,
			}
		},
		watch: {
			swiperCurrent(newVal, oldVal) {
				console.log(333)
				if (oldVal != newVal) {
					console.log("watch")
					this.request_list(newVal)
				}
			}
		},
		onShow() {

			console.log("onShow")
			this.request_list(this.swiperCurrent)
		},
		onLoad() {

			console.log("onLoad")
		},
		created() {

			console.log("created")
		},
		methods: {
			item_click() {

				uni.navigateTo({
					url: '/pages/home/goods_manage'
				})
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				//滑到底部加载更多
				// 此tab为空数据
				// if (this.orderList[this.current].length) {
				// 	this.loadStatus.splice(this.current, 1, "loading")
				// 	setTimeout(() => {
				// 		this.getOrderList(this.current);
				// 	}, 1200);
				// }
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.swiperCurrent = current;
				this.current = current;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			request_list(index) {

				var status = 0
				if (index == 1) {
					status = -2
				}
				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"uid": u.userId,
					"deptId": u.deptId,
				}
				this.http_request({
					url: 'buser/getBuserById',
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {

						that.user_list = res.bUsers
						that.$forceUpdate()
					}
				})
			},
			add_click() {

				uni.navigateTo({
					url: '/pages/home/goods_create'
				})
			},
			edit_click(item) {

				var it = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/home/goods_create?edit_item=' + it
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
</style>
