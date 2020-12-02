<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="key-input">
			<view class="title">输入验证码</view>
			<view class="tips">验证码已发送至 {{ tel }}</view>
			<u-message-input :focus="true" :value="value" @finish="finish" mode="bottomLine" :maxlength="maxlength"></u-message-input>
			<view class="captcha">
				<text :class="{ noCaptcha: show }" @tap="noCaptcha">收不到验证码点这里</text>
				<text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maxlength: 4,
				value: '',
				second: 60,
				show: false,
				tel: 0,
				is_leave_code_vue: false, // 解决使用真机时，使用手机一键输入验证码功能，会执行两次finish函数，导致重复跳转问题
			};
		},
		onLoad(option) {
			this.tel = option.tel
			// this.getCaptcha()
			let interval = setInterval(() => {
				this.second--
				if (this.second <= 0) {
					this.show = true
					clearInterval(interval)
				}
			}, 1000)
		},
		methods: {
			// 收不到验证码选择时的选择
			noCaptcha() {
				var that = this
				uni.showActionSheet({
					itemList: ['重新获取验证码'],
					success: function(res) {
						that.http_request({
							url: 'sendSms?cellphone=' + that.tel + '&type=regist',
							method: "POST",
							success: function(res) {
								that.$refs.uToast.show({
									title: '发送成功',
									type: 'success',
								})
							}
						})
					},
					fail: function(res) {}
				})
			},
			// 输入完验证码最后一位执行
			finish(value) {

				var that = this
				this.http_request({
					url: 'auth/login?cellphone=' + this.tel + '&utype=1' + '&cid=fds' + '&code=' + value + '&ltype=1' +
						'&dno=kt',
					method: "POST",
					hideLoading: true,
					success: function(res) {
						if (that.is_leave_code_vue == false) {
							that.is_leave_code_vue = true
							uni.setStorageSync(that.user_info_key, res)
							uni.navigateTo({
								url: '/pages/home/index'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 80rpx;
	}

	.box {
		margin: 30rpx 0;
		font-size: 30rpx;
		color: 555;
	}

	.key-input {
		padding: 30rpx 0;

		text {
			display: none;
		}

		.error {
			display: block;
			color: red;
			font-size: 30rpx;
			margin: 20rpx 0;
		}
	}

	.title {
		font-size: 50rpx;
		color: #333;
	}

	.key-input .tips {
		font-size: 30rpx;
		color: #333;
		margin-top: 20rpx;
		margin-bottom: 60rpx;
	}

	.captcha {
		color: $u-type-warning;
		font-size: 30rpx;
		margin-top: 40rpx;

		.noCaptcha {
			display: block;
		}

		.regain {
			display: block;
		}
	}
</style>
