<template>
	<view class="wrap">
		<!-- 控件 -->
		<u-toast ref="uToast" />
		<u-modal v-model="show" @confirm="del_click_confirm" :show-title="false" :show-cancel-button="true" content="确定下架此商品？"></u-modal>
		<!-- 顶部菜单栏 -->
		<u-tabs-swiper active-color="#f29100" ref="tabs" :list="menu_list" :current="current" @change="tabsChange" :is-scroll="false"
		 swiperWidth="750"></u-tabs-swiper>
		<view style="padding:0 0rpx;">
			<u-line color="#e2e2e2" />
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height:100%;width:100%;" @scrolltolower="onreachBottom">

					<!-- 与u-tabs-swiper无关，自己的内容 -->
					<view>
						<view v-for="(item , idx) in page_container_list[0]" :key="item.id">
							<view style="overflow: hidden; margin: 30rpx;">
								<view style="float:left;width:120rpx;height:120rpx;">
									<u-image :src="deal_img_url(item.imgSlide)" height="100%" mode="scaleToFill" @click="preview_img(item.imgSlide)"></u-image>
								</view>
								<view style="float:left;">
									<view style="margin-left:15rpx;">{{ item.title }}</view>
									<view style="margin-left:15rpx;margin-top:30rpx;color:#999999;">{{ item.specs }}</view>
								</view>
							</view>
							<view style="padding:0 30rpx;">
								<u-line color="#d5f5f5" />
							</view>
							<view style="overflow:hidden;">
								<view @click="edit_click(item)" style="width:150rpx;height:55rpx;background-color:white;float:right;line-height:55rpx;text-align:center;margin-top:15rpx;margin-right:30rpx;border-radius:10rpx;color:#555555;border:2rpx solid #f39e38;">编辑</view>
								<view @click="del_click_1(item)" style="width:150rpx;height:55rpx;background-color:white;float:right;line-height:55rpx;text-align:center;margin-top:15rpx;margin-right:30rpx;border-radius:10rpx;color:#555555;border:2rpx solid #f39e38;">下架</view>
							</view>
							<view style="margin-top:30rpx;">
								<u-gap height="30" bg-color="#f5f5f5"></u-gap>
							</view>
						</view>
						<view style="height:180rpx;"></view>
					</view>

				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height:100%;width:100%;" @scrolltolower="onreachBottom">

					<!-- 与u-tabs-swiper无关，自己的内容 -->
					<view>
						<view v-for="(item , idx) in page_container_list[1]" :key="item.id">
							<view style="overflow: hidden; margin: 30rpx;">
								<view style="float:left;width:120rpx;height:120rpx;">
									<u-image :src="deal_img_url(item.imgSlide)" height="100%" mode="scaleToFill" @click="preview_img(item.imgSlide)"></u-image>
								</view>
								<view style="float:left;">
									<view style="margin-left:15rpx;">{{ item.title }}</view>
									<view style="margin-left:15rpx;margin-top:30rpx;color:#999999;">{{ item.specs }}</view>
								</view>
							</view>
							<view style="padding:0 30rpx;">
								<u-line color="#d5f5f5" />
							</view>
							<view style="overflow:hidden;">
								<!-- <view @click="del_click_1(item)" style="width:150rpx;height:55rpx;background-color:white;float:right;line-height:55rpx;text-align:center;margin-top:15rpx;margin-right:30rpx;border-radius:10rpx;color:#555555;border:2rpx solid #f39e38;">上架</view> -->
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

		<!-- 按钮 -->
		<u-button style="bottom:40rpx;left:30rpx;right:30rpx;position:absolute;" type="warning" @click="add_click">发布商品</u-button>
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
				show: false, // 是否弹modal
				operation_item: {}, // 操作的元素
				menu_list: [{
					name: '在售中'
				}, {
					name: '已下架'
				}],
				current: 0,
				swiperCurrent: 0,
			}
		},
		watch: {
			swiperCurrent(newVal, oldVal) {
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
			request_list(index) {

				var status = 0
				if (index == 1) {
					status = -2
				}
				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"businessId": u.userId,
					"deptId": u.deptId,
					"status": status,
					"index": 0,
					"size": 999,
				}
				this.http_request({
					url: 'ddGoods/getGoodsList',
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {

						that.page_container_list[index] = res.list
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
			del_click_1(item) {

				this.operation_item = item
				this.show = true
			},
			del_click_confirm() {

				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"businessId": u.id,
					"goodsId": this.operation_item.id,
					"status": -2,
				}
				this.http_request({
					url: 'ddGoods/unSellGoods',
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {

						that.request_list(0)
						that.$refs.uToast.show({
							title: "下架成功",
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
</style>
