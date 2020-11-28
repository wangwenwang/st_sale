<template>
	<view class="compress">
		<canvas :style="{ width: canvasSize.width,height: canvasSize.height}" canvas-id="myCanvas"></canvas>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic:'',
				canvasSize: {
					width: 0,
					height: 0
				}
			}
		},
		methods: {
			// 压缩
			compress(params) {
				return new Promise(async (resolve, reject) => {
					let info = await this.getImageInfo(params.src).then(info=>info).catch(err=>err);
					
					if(!info){
						reject('获取图片信息异常');
						return;
					}
					
					const maxSize = params.maxSize || 1080;

					let {width,height} = info;
					
					// #ifndef H5
					// 原图尺寸低于50则返回原图
					if(width < 50 || height < 50){
						resolve(params.src);
						return;
					}
					// #endif
					

					if (width > maxSize || height > maxSize) {
						if (width > height) {
							height = Math.floor(height / (width / maxSize));
							width = maxSize;
						} else {
							width = Math.floor(width / (height / maxSize));
							height = maxSize;
						}
					}

					this.canvasSize = {
						width: `${width}rpx`,
						height: `${height}rpx`
					}
					
					this.$nextTick(() => {
						setTimeout(() => {
							const ctx = uni.createCanvasContext('myCanvas', this);
							ctx.clearRect(0,0,width, height)
							ctx.drawImage(info.path, 0, 0, uni.upx2px(width), uni.upx2px(height));
							ctx.draw(false, () => {
								uni.canvasToTempFilePath({
									x: 0,
									y: 0,
									width: uni.upx2px(width),
									height: uni.upx2px(height),
									destWidth: width,
									destHeight: height,
									canvasId: 'myCanvas',
									fileType: params.fileType || 'jpg',
									quality: params.quality || 0.9,
									success: (res) => {
										// 在H5平台下，tempFilePath 为 base64
										resolve(res.tempFilePath);
									},
									fail:(err)=>{
										reject(null);
									}
								},this);
								
							});
						}, 500);
					})
				});
			},
			// 获取图片信息
			getImageInfo(src){
				return new Promise((resolve, reject)=>{
					uni.getImageInfo({
						src,
						success: (info)=> {
							resolve(info);
						},
						fail: () => {
							reject(null);
						}
					});
				});
			},
			// 批量压缩
			batchCompress(params){
				let [index,done,fail] = [0,0,0];
				let paths = [];
				let tatch = ()=>{
					return new Promise((resolve, reject)=>{
						let start = async ()=>{
							params.progress && params.progress({
								done,
								fail,
								count:params.batchSrc.length
							});
							let path = await next();
							if(path){
								done++;
								paths.push(path);
							}else{
								fail++;
							}
							
							index++;
														
							if(index >= params.batchSrc.length){
								resolve(true);
							}else{
								start();
							}
						}
						start();
					});
				}
				let next = ()=>{
					return this.compress({
						src:params.batchSrc[index],
						maxSize:params.maxSize,
						fileType:params.fileType,
						quality:params.quality
					})
				}
				
				return new Promise(async (resolve, reject)=>{
					let res = await tatch();
					if(res){
						resolve(paths);
					}else{
						reject(null);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.compress{
		position: fixed;
		width: 12px;
		height: 12px;
		overflow: hidden;
		top: -99999px;
		left: 0;
	}
</style>
