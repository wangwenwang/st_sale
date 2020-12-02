<template>
	<view class="wrap">
		<!-- 组件 -->
		<u-modal v-model="show" title="退出当前账号" content=" " :show-cancel-button="true" @confirm="logout_confirm"></u-modal>
		<!-- 页面 -->
		<view class="swiper">
			<u-swiper :list="list" :effect3d="true"></u-swiper>
		</view>
		<view class="grid">
			<u-grid :col="3" border>
				<u-grid-item @click="to_goods_manage_click">
					<i class="iconfont iconshangpinguanli" style="color: #D9231F;"></i>
					<view class="grid-text">商品管理</view>
				</u-grid-item>
				<u-grid-item @click="to_user_click">
					<i class="iconfont iconyonghuguanli" style="color: #D9231F;"></i>
					<view class="grid-text">用户管理</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 按钮 -->
		<u-button style="bottom:40rpx;left:30rpx;right:30rpx;position:absolute;" type="warning" @click="logout_click">{{ login_logout_text }}</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeColor: '#EC662C',
				list: [{
						image: '/static/img/swipe/i-swipe-2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: '/static/img/swipe/i-swipe-3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				show: false,
				login_logout_text: "登录", // 登录/退出登录
			}
		},
		onShow() {

			if (this.is_login()) {
				this.login_logout_text = "退出登录"
			}
		},
		methods: {
			to_user_click() {

				if (this.has_logined()) {
					uni.navigateTo({
						url: '/pages/user/user_manage'
					})
				}
			},
			to_goods_manage_click() {

				if (this.has_logined()) {
					uni.navigateTo({
						url: '/pages/home/goods_manage'
					})
				}
			},
			logout_click() {

				if (this.is_login()) {
					this.show = true
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

<style lang="scss" scoped>
	.wrap {
		width: 100%;
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
		color: $u-type-info;
	}
</style>
