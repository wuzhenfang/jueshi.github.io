$(function(){
	$(window).resize(function(){
		var sheight = $(window).height();
		var swidth = $(window).width();
		var leftPlan = $("#leftPlan");
		var mainPlan = $("#mainPlan");
		var panel = $(".panel");
		var iframe = $(".panel>iframe");
		leftPlan.height(sheight-100);
		mainPlan.height(sheight-100);
		mainPlan.width(swidth - leftPlan.width() - 1);
		panel.width(mainPlan.width());
		panel.height(mainPlan.height());
		iframe.width(mainPlan.width());
		iframe.height(mainPlan.height());
	});
	$(window).resize();
	var dengji = "<dt>党费登记<i class='iconfont icon-down'></i></dt>"+"<div class='cxtj'>"+
				 "<dd attr-src='src/page/dangfei_dj.html' class='active'>登记<i class='line'></i></dd>"+"</div>";
	var guanli = "<dt>系统管理<i class='iconfont icon-down'></i></dt>"+"<div class='cxtj'>"+
			   "<dd attr-src='src/page/zzguanli.html' class='active'>党组织管理<i class='line'></i></dd>"+
			   "<dd attr-src='src/page/dyguanli.html'>党员管理<i class='line'></i></dd>"+"</div>";
	var seach = "<dt>查询统计<i class='iconfont icon-down'></i></dt>"+"<div class='cxtj'>"+
				"<dd attr-src='src/page/gr_seach.html' class='active'>个人缴纳情况<i class='line'></i></dd>"+
				"<dd attr-src='src/page/dzb_seach.html'>支部缴纳情况<i class='line'></i></dd>"+
				"<dd attr-src='src/page/dw_seach.html'>机关党委缴纳情况<i class='line'></i></dd>"+"</div>";
	$(".dengji").click(function(){
		$(".leftnav dl").html(dengji);
		$(this).addClass("active").siblings().removeClass("active");
		var src = $(this).find("a").attr("attr-src");
		if(src&&src.length>0){
			$(".panel iframe").attr("src",src);
		}
	});
	$(".seach").click(function(){
		$(".leftnav dl").html(seach);
		$(this).addClass("active").siblings().removeClass("active");
		var src = $(this).find("a").attr("attr-src");
		if(src&&src.length>0){
			$(".panel iframe").attr("src",src);
		}
	});
	$(".gunli").click(function(){
		$(".leftnav dl").html(guanli);
		$(this).addClass("active").siblings().removeClass("active");
		var src = $(this).find("a").attr("attr-src");
		if(src&&src.length>0){
			$(".panel iframe").attr("src",src);
		}
	});
	$(".leftnav").on("click","dd",function(){
		var this_ = $(this);
		var src = this_.attr("attr-src");
		if(src&&src.length>0){
			$(".panel iframe").attr("src",src);
		}
		this_.addClass("active").siblings().removeClass("active");
	});
	$(".leftnav").on("click","dl dt",function(){
		$(this).parent().find(".cxtj").slideToggle();
	});
});
