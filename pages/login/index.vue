<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录创销优选</view>
			<u-input v-model="tel" type="number" maxlength="11" placeholder-style="font-size:35rpx;color:#C0C4CC;" placeholder="请输入手机号" />
			<u-line color="#999999" />
			<view v-if="login_type == 2" style="height: 50rpx;"></view>
			<u-input v-if="login_type == 2" v-model="value" type="password" placeholder-style="font-size:35rpx;color:#C0C4CC;"
			 placeholder="请输入密码" />
			<u-line v-if="login_type == 2" color="#999999" />
			<view v-if="login_type == 1" class="tips">未注册的手机号验证后自动创建创销优选账号</view>
			<button @tap="login_click" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
			<view class="alternative">
				<!-- <view class="password" ref='btn1' @tap="switch_click">{{ login_prompt }}</view> -->
				<!-- <view class="issue">遇到问题</view> -->
			</view>
		</view>
		<view style="position:absolute;bottom:200rpx;left:0;right:0;">
			<view style="text-align:center;">登录可使用上传、管理商品功能</view>
		</view>
		<view class="buttom">
			<view class="hint">
				登录代表同意
				<text class="link"><text @click="protocol_click()">创销优选用户协议</text>、<text @click="privacy_click()">隐私政策</text>，</text>
				并授权使用您的创销优选账号信息（如昵称、头像、收获地址）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: '',
				value: '',
				login_type: 1,
				login_prompt: "密码登录",
			}
		},
		computed: {
			inputStyle() {
				let style = {}
				if (this.tel) {
					style.color = "#fff"
					style.backgroundColor = this.$u.color['warning']
				}
				return style
			}
		},
		created() {

			// this.tel = "13726027405"
		},
		methods: {

			protocol_click() {

				uni.navigateTo({
					url: '/pages/login/protocol'
				})
			},
			privacy_click() {

				uni.navigateTo({
					url: '/pages/login/privacy'
				})
			},
			login_click() {

				if (!this.$u.test.mobile(this.tel)) {
					this.$refs.uToast.show({
						title: '手机号格式不正确',
						type: 'error',
						position: 'bottom',
					})
					return
				}

				// // 前期开发，节约成本，不发验证码
				// uni.navigateTo({
				// 	url: '/pages/login/code?tel=' + this.tel
				// })
				// return

				var that = this
				this.http_request({
					url: 'sendSms?cellphone=' + this.tel + '&type=regist',
					method: "POST",
					success: function(res) {
						uni.navigateTo({
							url: '/pages/login/code?tel=' + that.tel
						})
					}
				})
			},
			switch_click() {

				if (this.login_type == 1) {
					this.login_type = 2
					this.login_prompt = "验证码登录"
				} else if (this.login_type == 2) {
					this.login_type = 1
					this.login_prompt = "密码登录"
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;
		height: 80%;

		.content {
			width: 600rpx;
			margin: 0rpx auto 0;
			padding-top: 80rpx;
			overflow: hidden;


			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			.tips {
				color: #999999;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
				font-size: 26rpx;
			}

			.getCaptcha {
				background-color: rgb(253, 243, 208);
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;
				margin-top: 100rpx;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: #555555;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			position: absolute;
			bottom: 0rpx;

			.loginType {
				display: flex;
				padding: 0rpx 200rpx 150rpx 200rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 20rpx;
				color: $u-tips-color;

				.link {
					color: $u-type-warning;
				}
			}
		}
	}
</style>
