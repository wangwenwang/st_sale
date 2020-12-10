// 多图片链接，取第一个图片链接
// urls: https://baidu.com/1.jpg,https://baidu.com/2.jpg
// return: https://baidu.com/1.jpg
const get_first_imgurl = urls => {
	var url_list = urls.split(",")
	return url_list.length ? url_list[0] : ""
}
// 多图片链接，用英文逗号分割，转成图片数组
// urls: https://baidu.com/1.jpg,https://baidu.com/2.jpg 
const imgsurl_to_imgsarray = urls => {
	var url_list = urls.split(",")
	return url_list.length ? url_list : []
}
// 预览多张图片
// urls: https://baidu.com/1.jpg,https://baidu.com/2.jpg 
const preview_img = urls => {
	var imgs_array = (urls && urls.length) ? urls.split(",") : []
	uni.previewImage({
		current: 0,
		urls: imgs_array
	})
}

module.exports = {
	get_first_imgurl,
	imgsurl_to_imgsarray,
	preview_img
}
