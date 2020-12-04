<template>
	<view>

		<view class="top-d">
			<view class="top-cell-content" :class="index == item.type - 1 ? '' : 'bottom_line'" v-for="(item , index) in top_list"
			 :key="index" @click="top_click(item, index)">
				{{ item.name }}
			</view>
		</view>

		<view class="type-list-content">
			<view class="unchosen-cell-content" v-for="(item , index) in curr_list" :key="index" @click="item_click(item)">
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				top_list: [{
					name: "一级分类"
				}], // 已选择分类
				curr_list: [], // 当前显示列表
			}
		},
		methods: {
			top_click(item, index) {

				if (index == 1) {

					this.request_list(this.top_list[0].id, true)
				}



				if (index == 0) {

					this.top_list = [{
						name: "一级分类"
					}]
					this.request_top_list()
				} else if (index == 1) {

					if (this.top_list[this.top_list.length - 1].name == "三级分类") {

						this.top_list.splice(this.top_list.length - 1, 1)
					}
					this.top_list.splice(this.top_list.length - 1, 1)
					this.top_list.push({
						name: "二级分类",
						id: this.top_list[0].id
					})
				} else if (index == 2) {

				}
			},
			item_click(item) {

				if (item.type == 3) {
					var type1 = this.top_list[0].id
					var type2 = this.top_list[1].id
					var type3 = item.id

					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2]; //上一个页面
					//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
					prevPage.setData({
						my_data: {
							type1: type1,
							type2: type2,
							type3: type3
						}
					})
					wx.navigateBack({ //返回
						delta: 1
					})
					return
				}

				if (item.type == 1) {
					this.top_list = []
				}
				this.top_list.push(item)
				this.request_list(item.id, false)
			},
			request_list(pid, is_top) {

				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"pid": pid
				}
				this.http_request({
					url: 'ddGoodsType/getTypeByPid',
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {

						that.curr_list = res.list
						if (res.list[0]) {

							if (res.list[0].type == 2) {
								if (that.top_list.length == 2) {
									if (is_top == false) {
										that.top_list.splice(res.list[0].type - 2, 1)
									}
								} else {
									if (is_top == false) {
										that.top_list.push({
											name: "二级分类",
											id: that.top_list[0].id
										})
									}
								}
							} else if (res.list[0].type == 3) {

								if (that.top_list.length == 3 && is_top == false) {

									that.top_list.splice(res.list[0].type - 2, 1)
									that.top_list.push({
										name: "三级分类",
										id: that.top_list[that.top_list.length - 1].id
									})
								}
							}
						}
					}
				})
			},
			request_top_list() {
				const u = uni.getStorageSync(this.user_info_key).user
				var that = this
				var params = {
					"name": "dd_level1"
				}
				this.http_request({
					url: 'ddGoodsType/getParentByName',
					data: {
						"params": JSON.stringify(params)
					},
					method: "POST",
					success: function(res) {

						that.curr_list = res.list
					}
				})
			}
		},
		onLoad(option) {

			this.request_top_list()
		}
	}
</script>

<style lang="scss" scoped>
	.top-d {
		height: 80rpx;
		position: relative;
		border-bottom: solid #eeeeee 1rpx;

		.top-cell-content {
			float: left;
			height: 100%;
			overflow: hidden;
			line-height: 80rpx;
			text-align: center;
			margin-left: 20rpx;
			margin-right: 20rpx;
		}

		.bottom_line {

			border-bottom: solid #303030 4rpx;
		}
	}

	.type-list-content {
		background-color: #f5f5f5;

		.unchosen-cell-content {
			height: 90rpx;
			line-height: 90rpx;
			border-bottom: solid #ebebeb 2rpx;
			margin-left: 30rpx;
		}
	}
</style>
