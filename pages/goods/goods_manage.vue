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
						<u-search :animation="true" :show-action="false" @change="search_change" placeholder="按商品名称搜索" input-align="center"
						 v-model="keyword"></u-search>
					</view>
					<!-- 与u-tabs-swiper无关，自己的内容 -->
					<view>
						<view v-for="(item, index) in it" :key="index">
							<view style="overflow: hidden; margin: 30rpx;">
								<view style="float:left;width:180rpx;height:180rpx;overflow: hidden;">
									<u-image :src="u_picture.get_first_imgurl(item.imgSlide)" height="100%" mode="scaleToFill" @click="preview_img_click(item.imgSlide)"></u-image>
								</view>
								<view style="float:left; width: calc(100% - 180rpx);overflow: hidden;">
									<view style="padding-left:15rpx; word-break:break-all;">{{ item.title }}</view>
									<view style="padding-left:15rpx;padding-top:30rpx;color:#999999;">{{ item.specs }}</view>
									<view style="padding-left:15rpx;padding-top:30rpx;color:#999999;font-size:25rpx;">编辑时间：{{ u_date.just(item.lmfTm ? item.lmfTm : item.crtTm) }}</view>
								</view>
							</view>
							<view style="padding:0 30rpx;">
								<u-line color="#d5f5f5" />
							</view>
							<view style="overflow:hidden;">
								<view @click="edit_click(item)" style="width:150rpx;height:55rpx;background-color:white;float:right;line-height:55rpx;text-align:center;margin-top:15rpx;margin-right:30rpx;border-radius:10rpx;color:#555555;border:2rpx solid #f39e38;">编辑</view>
								<view v-if="idx == 0" @click="pull_off_shelves_click(item)" style="width:150rpx;height:55rpx;background-color:white;float:right;line-height:55rpx;text-align:center;margin-top:15rpx;margin-right:30rpx;border-radius:10rpx;color:#555555;border:2rpx solid #f39e38;">下架</view>
								<view v-if="idx == 1" @click="put_on_shelves_click(item)" style="width:150rpx;height:55rpx;background-color:white;float:right;line-height:55rpx;text-align:center;margin-top:15rpx;margin-right:30rpx;border-radius:10rpx;color:#555555;border:2rpx solid #f39e38;">上架</view>
							</view>
							<view style="margin-top:30rpx;">
								<u-gap height="30" bg-color="#f5f5f5"></u-gap>
							</view>
						</view>
						<u-loadmore :margin-top="20" :status="load_status[idx]" :load-text="loadText" />
						<view style="height:180rpx;"></view>
					</view>
					<!-- 与u-tabs-swiper无关，自己的内容结束 -->
				</scroll-view>
			</swiper-item>

		</swiper>

		<!-- 按钮 -->
		<view style="bottom:0;left:0;right:0;position:absolute;background-color:white;height:150rpx;">
			<u-button style="bottom:40rpx;left:30rpx;right:30rpx;position:absolute;" type="warning" @click="add_click">发布商品</u-button>
		</view>

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
					name: '在售中'
				}, {
					name: '已下架'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				businessId: 0, // 用户id
				deptId: -1, // 部门id
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
			if (option.deptId) {
				this.deptId = JSON.parse(option.deptId)
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
			preview_img_click(urls) {

				this.u_picture.preview_img(urls)
			},
			search_change(val) {

				this.keyword = val
				this.params_index[this.swiperCurrent] = 1
				this.request_list()
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
				var that = this
				var _interface = "ddGoods/getGoodsListById"
				var params = {
					"businessId": this.businessId,
					"status": status,
					"index": this.params_index[this.swiperCurrent],
					"size": this.params_size,
					"title": this.keyword,
				}
				// 查看自己发布的商品
				if (this.deptId >= 0) {
					_interface = "ddGoods/getGoodsList"
					params.deptId = this.deptId
				}
				this.http_request({
					url: _interface,
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					// 上拉加载时不显示小菊花
					hideLoading: this.params_index[this.swiperCurrent] == 1 ? false : true,
					success: function(res) {

						if (that.params_index[that.swiperCurrent] == 1) {
							if (res.list.length) {
								that.page_container_list[that.swiperCurrent] = res.list
							} else {
								that.page_container_list[that.swiperCurrent] = []
							}
						} else {
							for (var i = 0; i < res.list.length; i++) {
								var item = res.list[i]
								that.page_container_list[that.swiperCurrent].push(item)
							}
						}
						if (!res.list.length || res.list.length < that.params_size) {
							that.loadText.nomore = "共" + that.page_container_list[that.swiperCurrent].length + "个商品"
							that.load_status.splice(that.swiperCurrent, 1, "nomore")
						} else {
							that.load_status.splice(that.swiperCurrent, 1, "loadmore")
							that.allow_next_page = true
						}
						uni.stopPullDownRefresh()
						that.$forceUpdate()
					}
				})
			},
			add_click() {

				if (this.has_logined()) {
					uni.navigateTo({
						url: '/pages/goods/goods_create'
					})
				}
			},
			edit_click(item) {

				var it = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/goods/goods_create?edit_item=' + it
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
</style>
