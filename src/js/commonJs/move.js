//下面是弹出框可以拖动的效果写法
$(function() {
	var document_ = top.document;
	var clicked = "Nope.";
	var mausx = "0";
	var mausy = "0";
	var winx = "0";
	var winy = "0";
	var current_drag = null;
	var difx = mausx - winx;
	var dify = mausy - winy;
	
	var key = 0,keypop = 0;
	$(document_.body).on("mousedown", ".window .pew", function(event) {
		clicked = "Yeah.";
		key = 1;
		mausx = event.pageX;
		mausy = event.pageY;
		winx = $(event.target).parent().offset().left;
		winy = $(event.target).parent().offset().top;
		difx = mausx - winx;
		dify = mausy - winy;
		current_drag = $(event.target).parent(".window");
	});
	//鼠标在窗体的任何地方松开左键时，弹出框不移动
	$(document_.body).on("mouseup", ".tm_bj", function(event) {
		clicked = "Nope.";
		key = 0;
	});
	//在整个页面中的X, Y坐标
	$(document_.body).on("mousemove", ".tm_bj", function(event) {
		if(key == 1) {
			
			newx = event.pageX - difx - current_drag.css("marginLeft").replace('px', '');
			newy = event.pageY - dify - current_drag.css("marginTop").replace('px', '');
			
			//判断如果鼠标按下左键时，那么才给窗口赋值坐标
			current_drag.css({
				top: newy,
				left: newx
			})
		}
	});

	
});