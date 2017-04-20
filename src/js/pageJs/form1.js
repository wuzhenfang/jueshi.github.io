$(function(){
	$(".tabMenu div").click(function(){
		var id = $(this).attr("id");
		$(this).siblings().removeClass("choose").addClass("nochoose");
		$(this).addClass("choose").removeClass("nochoose");
		$(".tabPage").find(".tabPagePanel").removeClass("choose").addClass("nochoose");
		$(".tabPage").find("#page"+id).addClass("choose").removeClass("nochoose");
	});
});
