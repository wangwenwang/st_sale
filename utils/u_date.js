// 13位时间戳 --> 2020-12-03 11:22:19
const y_m_d_h_m_s = timestamp => {
	var date = new Date(timestamp)
	var year = date.getFullYear()
	var month = ("0" + (date.getMonth() + 1)).slice(-2)
	var sdate = ("0" + date.getDate()).slice(-2)
	var hour = ("0" + date.getHours()).slice(-2)
	var minute = ("0" + date.getMinutes()).slice(-2)
	var second = ("0" + date.getSeconds()).slice(-2)
	var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second
	return result
}
// 13位时间戳 --> 1分钟前
just = timestamp => {
	var minute = 1000 * 60
	var hour = minute * 60
	var day = hour * 24
	var week = day * 7
	var halfamonth = day * 15
	var month = day * 30
	var now = new Date().getTime()
	var diffValue = now - timestamp
	if (diffValue < 0) {
		console.log("diffValue<0", datetime, timestamp, now, diffValue);
		return '刚刚'
	}
	// 计算时间差的分，时，天，周，月
	var minC = diffValue / minute
	var hourC = diffValue / hour
	var dayC = diffValue / day
	var weekC = diffValue / week
	var monthC = diffValue / month
	var result = "2"
	// if (monthC >= 1 && monthC <= 3) {
	// 	result = " " + parseInt(monthC) + "月前"
	// } else if (weekC >= 1 && weekC <= 3) {
	// 	result = " " + parseInt(weekC) + "周前"
	// } else if (dayC >= 1 && dayC <= 6) {
	// 	result = " " + parseInt(dayC) + "天前"
	// } else if (hourC >= 1 && hourC <= 23) {
	// 	result = " " + parseInt(hourC) + "小时前"
	// } 
	// else 
	if (minC >= 1 && minC <= 59) {
		result = " " + parseInt(minC) + "分钟前"
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = "刚刚"
	} else {
		var datetime = new Date()
		datetime.setTime(timestamp)
		var Nyear = datetime.getFullYear()
		var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1
		var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate()
		var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours()
		var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes()
		var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds()
		result = Nyear + "-" + Nmonth + "-" + Ndate + " " + Nhour + ":" + Nminute + ":" + Nsecond
	}
	return result
}

module.exports = {
	y_m_d_h_m_s,
	just
}
