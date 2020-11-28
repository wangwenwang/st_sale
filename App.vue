<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
</style>

<style lang="scss">
	@import "uview-ui/index.scss";
    @import "./static/iconfont/iconfont.css";
	
	/*导入字体图标*/
	@font-face {
		font-family: 'iconfont';
		src: url('~@/static/iconfont.ttf') format('truetype');
	}

	/*设置字体图标*/
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 1em;
		font-style: normal;
	}
</style>
