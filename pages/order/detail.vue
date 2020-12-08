<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="content">
			<view class="orderInfo" v-for='(dataItem,index) in orderDetailList' :key="index">
				<view><text space="ensp"> 订 单 号： </text><text>{{dataItem.orderNo}}</text></view>
				<view><text>客户单号：</text><text>XHD_202009052330</text></view>
				<view><text>收货单位：</text><text>奥梦</text></view>
				<view class="address"><text>收货地址：</text><text>{{dataItem.receiveAddress}}</text></view>
				<view class="u-p-b-10" style="border-bottom: 1rpx dashed #999;"><text>收货联系人：</text><text>{{dataItem.receiveContractName}}
						{{dataItem.receiveContractPhone}}</text></view>
				<view class="u-p-t-10"><text>装货单位：</text><text>湖北凯东源仓库</text></view>
				<view class="address"><text>装货地址：</text><text>{{dataItem.issueAddress}}</text></view>
				<view><text>装货联系人：</text><text>{{dataItem.issueContractName}} {{dataItem.issueContractPhone}}</text> </view>
				<view><text>货品信息：</text><text space="ensp">{{dataItem.goodsType}} {{dataItem.vol}}方 {{dataItem.weight}}千克</text>
				</view>
				<!-- 折叠块 -->
				<!-- <view class="u-flex u-row-between">
					<view class="u-demo-area">
						<u-collapse style="width: 550rpx;"> 
							<u-collapse-item  :title="collapseHead"> -->
				<!-- <view v-for="(item ,index) in goodsList" :id="index"  :key="index"> -->
				<!-- <view>娃哈哈旺仔小馒头  1箱</view> -->
				<!-- </view> -->
				<!-- </u-collapse-item>
						</u-collapse>
					</view> -->
				<!-- <view><button type="primary" size="mini" style="width: 150rpx;" @click="deliverClick">交付</button></view> -->
				<!-- </view> -->

			</view>

			<view class="btn" v-if="orderStatus == 1">
				<u-button shape="circle" style="width: 220rpx;" type="info" @click="cancel_Click">取消订单</u-button>
				<u-button shape="circle" style="width: 220rpx;" type="warning" @click="shipment_Click">发 运</u-button>
			</view>

			<view class="btn" v-if="orderStatus == 2">
				<u-button shape="circle" style="width: 220rpx;" type="warning" @click="deliver_Click">交 付</u-button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// collapseHead:"货物信息",
				orderDetailList: [],
				orderId: '',
				orderStatus: '',
				user: {},
				mode_data: {
					"msg": "操作成功",
					"code": 0,
					"list": [{
						"id": 118,
						"orderNo": "12020120417365779791753549",
						"externalOrderNo": null,
						"clientId": 1,
						"clientName": "深圳凯东源物流有限公司",
						"issueName": null,
						"issueAddress": "广东省东莞市",
						"issueContractName": "张三",
						"issueContractPhone": "13726027401",
						"issueProvince": "广东省",
						"issueCity": "东莞市",
						"issueDistrict": "",
						"receiveeName": null,
						"receiveAddress": "广东省深圳市福田区深南大道1010号",
						"receiveContractName": "李四",
						"receiveContractPhone": "13726027402",
						"receiveProvince": "广东省",
						"receiveCity": "深圳市",
						"receiveDistrict": "福田区",
						"uploadLat": 22.783236,
						"uploadLng": 114.006486,
						"unloadLat": 22.548456,
						"unloadLng": 114.0772,
						"orderStatus": 2,
						"goodsId": null,
						"goodsBrand": null,
						"goodsType": "钢铁",
						"goodsName": null,
						"weight": 2,
						"count": 4,
						"vol": 3,
						"cargoValue": 300,
						"crtTm": 1607074617000,
						"crtName": "admin",
						"lmfTm": 1607074767000,
						"lmfName": "离地铁"
					}]
				}
			}
		},
		onLoad(option) {

			this.orderId = option.orderId;
			this.orderStatus = option.orderStatus
		},

		created() {

			this.orderDetailList = this.mode_data.list
		},
		methods: {

			// 取消订单
			cancel_Click() {

				var that = this
				this.http_request({
					url: 'order/refuseOrder',
					data: {
						uid: this.user.id,
						orderId: that.orderId,
					},
					method: "POST",
					success: function(res) {
						if (res.code == 0) {
							that.$refs.uToast.show({
								title: '订单取消成功',
								type: 'success',
								url: '/pages/tabbar4/index',
								isTab: 'true'
							})
						} else {
							that.$refs.uToast.show({
								title: '订单取消失败',
								type: 'error'
							})
						}
					},
				})
			},
			// 发运
			shipment_Click() {

				var that = this
				this.http_request({
					url: 'order/dispatchOrders',
					data: {
						uid: that.user.id,
						orderId: that.orderId,
					},
					method: "POST",
					success: function(res) {
						if (res.code == 0) {
							that.$refs.uToast.show({
								title: '发运成功',
								type: 'success',
							})
						} else {
							that.$refs.uToast.show({
								title: '发运失败',
								type: 'error'
							})
						}
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabbar4/index',
								success: function() {
									uni.setStorageSync('swiperCurrent_key', '1')
								}
							})
						}, 2000)
					},
				})
			},
			// 交付
			deliver_Click() {

				uni.navigateTo({
					url: '/pages/order/deliver?orderId=' + this.orderId + "&orderStatus=" + this.orderStatus
				})
			},
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f2f2f2;
	}

	/* #endif */
</style>
<style lang="scss" scoped>
	.content {
		background-color: #f2f2f2;
	}

	.orderInfo {
		overflow: hidden;
		margin: 20rpx 20rpx 40rpx 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;

		view {
			line-height: 50rpx;
		}

		.address {
			display: flex;
			justify-content: flex-start;
		}

		.collapse {
			padding-top: 3rpx;
			color: pink;
			font-size: 20rpx;
		}

		text:first-child {
			width: 144rpx;
		}

		text:last-child {
			color: #999;
		}
	}

	.btn {
		margin: 100rpx auto;
		width: 100%;
		display: flex;
		justify-content: space-around;

	}
</style>
