<template>
	<view class="wrap">
		<!-- 组件 -->
		<u-modal v-model="exit_show" title="退出当前账号" content=" " :show-cancel-button="true" @confirm="logout_confirm"></u-modal>
		<!-- 页面 -->
		<view style="margin-top:10rpx; overflow:hidden;">
			<view style="width: 200rpx;height: 200rpx;float:left; padding:30rpx; overflow:hidden;">
				<u-image style="width:100%; height:100%; overflow: hidden;" height="100%" :src="logo_url" shape="circle" mode="scaleToFill"></u-image>
			</view>
			<view style="float: left;">
				<view style="margin-top:40rpx;font-size: 40rpx;">{{ deptName }}</view>
				<view style="margin-top:25rpx;font-size: 30rpx; color: #989898;">{{ mobile }}</view>
			</view>
		</view>
		<view style="height: 400rpx;background-color: white; margin-top: 30rpx;border-top-left-radius:35rpx;border-top-right-radius:35rpx;">

			<view class="grid">
				<u-grid :col="3" :border="false">
					<u-grid-item bg-color="transparent" @click="to_goods_manage_click">
						<i class="iconfont iconshangpinguanli" style="color: #D9231F; font-size: 70rpx;"></i>
						<view class="grid-text">商品管理</view>
					</u-grid-item>
					<u-grid-item v-if="isCo == 0" @click="to_user_click">
						<i class="iconfont iconyonghuguanli" style="color: #D9231F; font-size: 70rpx;"></i>
						<view class="grid-text">用户管理</view>
					</u-grid-item>
					<!-- <u-grid-item bg-color="transparent" @click="to_order_click">
						<i class="iconfont icondingdan" style="color: #D9231F; font-size: 70rpx;"></i>
						<view class="grid-text">订单管理</view>
					</u-grid-item> -->
				</u-grid>
			</view>
		</view>

		<!-- 按钮 -->
		<u-button style="bottom:40rpx;left:30rpx;right:30rpx;position:absolute;" type="warning" @click="logout_click">{{ login_logout_text }}</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				exit_show: false,
				login_logout_text: "登录", // 登录/退出登录
				logo_url: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3057463025,217485477&fm=26&gp=0.jpg",
				deptName: "请登录", // 部门
				mobile: "", // 手机号
				isCo: -1, // 0 平台，1 经销商
			}
		},
		onShow() {

			if (this.is_login()) {
				this.login_logout_text = "退出登录"
			}
			var u = uni.getStorageSync(this.user_info_key).user
			if (u) {
				this.deptName = u.deptName
				this.mobile = u.mobile
				this.logo_url = u.imageUrl ? u.imageUrl : this.logo_url
				this.isCo = u.isCo
			}
		},
		methods: {
			to_order_click() {

				if (this.has_logined()) {
					uni.navigateTo({
						url: '/pages/order/order_list'
					})
				}
			},
			to_user_click() {

				if (this.has_logined()) {
					uni.navigateTo({
						url: '/pages/user/user_manage'
					})
				}
			},
			to_goods_manage_click() {

				const u = uni.getStorageSync(this.user_info_key).user
				if (this.has_logined()) {
					uni.navigateTo({
						url: '/pages/goods/goods_manage?businessId=' + u.userId + "&deptId=" + u.deptId
					})
				}
			},
			logout_click() {

				if (this.is_login()) {
					this.exit_show = true
				} else {
					uni.navigateTo({
						url: '/pages/login/index'
					})
				}
			},
			logout_confirm() {

				uni.clearStorageSync()
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
		}
	}
</script>

<style>
	page {
		background: #f2f2f2;
	}
</style>
<style lang="scss" scoped>
	page {
		background-color: #f2f2f2;
	}

	.wrap {
		width: 100%;
		height: 100%;
	}

	.swiper {
		padding: 30rpx;
		transform: translateZ(0);
	}

	.u-grid-item {
		height: 200rpx;
	}

	i {
		font-size: 80rpx;
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: #333333;
	}
</style>
