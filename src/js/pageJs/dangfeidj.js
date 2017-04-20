$(function(){
	$(".trname").on("click","i.icon-seach",function(){
		$(this).popIframe({
			iframeSrc:"./src/page/dyinfo.html",
			tk_width:500,
			tk_height:560,
			noticeTitle:"党员信息"
		});
	});
	$(".bottommenu .baocun").click(function(){
		$(this).popAlert({
			noticeStr:"保持成功！"
		});
	});
});
