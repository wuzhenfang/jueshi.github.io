//弹出框统一样式
;(function($) {
	$.fn.extend({
		popIframe: function(option) { //iframe
			var myid = getTimer();
			var document_ = top.document;
			var screen_h = document_.documentElement.clientHeight || document_.body.clientHeight;
			var defaultStr = {
				iframeSrc: "",//iframe的路径
				display: "block",//默认为隐藏状态
				noticeTitle: "提示信息",//提示title
				tk_width: 300,//弹框的默认宽度
				tk_height: 120,//弹框的默认高度
				closeCallBack: closeCallBack,
				parentVal:"",
				w_ifid : "iframe"+myid
			};
			if(option){
				if(option.closeCallBack){
					defaultStr.closeCallBack = option.closeCallBack;
				}
				if(option.w_ifid){
					defaultStr.w_ifid = option.w_ifid;
				}
				if(option.parentVal){
					defaultStr.parentVal = option.parentVal;
				}
			}
			if(defaultStr.tk_height>screen_h){
				defaultStr.tk_height = screen_h - 10;
				defaultStr.tk_top = ( screen_h - 10 )/2;
			}
			var setting = $.extend(defaultStr, option);
			var tmbj = '<div class="tm_bj" id="'+setting.w_ifid
					+'"><div class="window notice_select"><a class="close">×</a>'
					+'<div class="pew pewwin"></div>'
					+'<iframe src="" frameBorder="0"></iframe>'
					+'</div></div>';
			$(document_.body).append(tmbj);
			var iframe_ = $(document_.body).find("#"+setting.w_ifid).children().children("iframe");
			iframe_.attr({
				"src": setting.iframeSrc
				}).css({
				"width": setting.tk_width + "px",
				"height": setting.tk_height - 40 + "px",
				"display": "block"
			});
			iframe_.parent(".notice_select").css({
				"display": setting.display,
				"width": setting.tk_width + "px",
				"height": setting.tk_height + "px",
				"margin-left": -setting.tk_width/2 + "px",
				"margin-top": -setting.tk_height/2 + "px",
				"left": "50%",
				"top": "50%"
			});
			iframe_.siblings(".pewwin").append(setting.noticeTitle);
			//点击弹出框关闭按钮时，弹出框和透明层关闭
			iframe_.siblings(".close").unbind("click").click(function() {
				$(this).parent().parent().remove();
				setting.closeCallBack();
			});
			function closeCallBack(){}
			//给打开的iframe添加opener方法
			iframe_.on("load", function(status){
				if($(this)[0].src =="" || $(this)[0].src=="about:blank"){
					return;
				}
				var targetWin =$(this)[0].contentWindow || $(this)[0].contentDocument;
				if(!targetWin.opener){
					targetWin.opener = window;
				}
				var metarget =  $(this)[0].contentWindow.document.body || $(this)[0].contentDocument.document.body;
				$(metarget).append('<div id="wuclose_tmbg" style="visibility: hidden;position:absolute;z-index:1;left:0;top:0;"><span>'+setting.parentVal+'</span>关闭当前弹出以及遮罩</div>');
				var closeWin = $(metarget).find("#wuclose_tmbg");
				closeWin.on("click", function(){
					$(metarget).remove();
					iframe_.remove();
					$(document_.body).find("#"+setting.w_ifid).remove();
					try{CollectGarbage();}catch(e){}
				});
			});
			return iframe_;
		},
		popAlert: function(option){/*alert*/
			var myid = getTimer();
			var document_ = top.document;
			var screen_h = document_.documentElement.clientHeight || document_.body.clientHeight;
			var defaultStr = {
				display: "block",//默认为隐藏状态
				noticeTitle: "提示信息",//提示title
				tk_width: 300,//弹框的默认宽度
				tk_height: 120,//弹框的默认高度
				noticeStr: "确定",
				w_ifid : "alert"+myid,
				okCallBack: okback
			};
			if(option){
				if(option.okCallBack){
					defaultStr.okCallBack = option.okCallBack;
				}
				if(option.noticeStr){
					defaultStr.noticeStr = option.noticeStr;
				}
				if(option.w_ifid){
					defaultStr.w_ifid = option.w_ifid;
				}
			}
			if(defaultStr.tk_height>screen_h){
				defaultStr.tk_height = screen_h - 10;
				defaultStr.tk_top = ( screen_h - 10 )/2;
			}
			var setting = $.extend(defaultStr, option);
			$(document_.body).append('<div class="tm_bj" id="'+setting.w_ifid
					+'"><div class="window notice_notice">'
					+'<div class="notice_text"><div class="notice_content pop_m"></div>'
					+'<div style="clear:both"></div>'
					+'<button class="zf_btn zf_btn_ok press_public_ok">确定</button>'
					+'</div></div></div>');
			var windowpop = $(document_.body).find("#"+setting.w_ifid).children(".notice_notice");
			windowpop.css({
				"display": setting.display,
				"width": setting.tk_width + "px",
				"height": setting.tk_height + "px",
				"margin-left": -setting.tk_width/2 + "px",
				"margin-top": -setting.tk_height/2 + "px",
				"left": "50%",
				"top": "50%"
			});
			windowpop.find(".pop_m").append(setting.noticeStr);
			windowpop.find(".press_public_ok").unbind("click").click(function() {
				$(this).parent().parent().parent().remove();
				setting.okCallBack();
			});
			$(document_.body).on("keydown",function(){
				if(event.keyCode == 13){
					if($(document_.body).find("#"+setting.w_ifid).length>0){
						$(document_.body).find("#"+setting.w_ifid).remove();
						setting.okCallBack();
					}
				}
			});
			function okback(){}
			return windowpop;
		},
		popConfirm:function(option){//confirm
			var myid = getTimer();
			var document_ = top.document;
			var screen_h = document_.documentElement.clientHeight || document_.body.clientHeight;
			var defaultStr = {
					display: "block",//默认为隐藏状态
					noticeTitle: "提示信息",//提示title
					tk_width: 300,//弹框的默认宽度
					tk_height: 120,//弹框的默认高度
					noticeStr: "确定",
					okCallBack: okback,
					closeCallBack:closeback,
					okStr: "确定",
					closeStr: "取消",
					w_ifid : "confirm"+myid
				};
			if(option){
				if(option.okCallBack){
					defaultStr.okCallBack = option.okCallBack;
				}
				if(option.closeCallBack){
					defaultStr.closeCallBack = option.closeCallBack;
				}
				if(option.noticeStr){
					defaultStr.noticeStr = option.noticeStr;
				}
				if(option.okStr){
					defaultStr.okStr = option.okStr;
				}
				if(option.closeStr){
					defaultStr.closeStr = option.closeStr;
				}
				if(option.w_ifid){
					defaultStr.w_ifid = option.w_ifid;
				}
				
			}
			if(defaultStr.tk_height>screen_h){
				defaultStr.tk_height = screen_h - 10;
				defaultStr.tk_top = ( screen_h - 10 )/2;
			}
			var setting = $.extend(defaultStr, option);
			$(document_.body).append('<div class="tm_bj" id="'+ setting.w_ifid 
					+'"><div class="window notice_confirm">'
					+'<div class="notice_text"><div class="notice_content confirm_m"></div>'
					+'<div style="clear:both"></div>'
					+'<div class="zf_btn zf_btn_ok public_ok"><i class="iconfont icon-yes"></i>'+setting.okStr+'</div>'
					+'<div class="zf_btn zf_btn_back publick_back"><i class="iconfont icon-guanbi1"></i>'+setting.closeStr+'</div>'+
					'</div></div></div>');
			var windowcon = $(document_.body).find("#"+setting.w_ifid).children(".notice_confirm");
			windowcon.css({
				"display": setting.display,
				"width": setting.tk_width + "px",
				"height": setting.tk_height + "px",
				"margin-left": -setting.tk_width/2 + "px",
				"margin-top": -setting.tk_height/2 + "px",
				"left": "50%",
				"top": "50%"
			});
			windowcon.find(".confirm_m").append(setting.noticeStr);
			windowcon.find(".public_ok").unbind("click").click(function() {
				$(this).parent().parent().parent().remove();
				setting.okCallBack();
			});
			windowcon.find(".publick_back").unbind("click").click(function(){
				$(this).parent().parent().parent().remove();
				setting.closeCallBack();
			});
			function okback(){}
			function closeback(){}
			return windowcon;
		},
		popQian: function(option){//confirm
			var myid = getTimer();
			var document_ = top.document;
			var screen_h = document_.documentElement.clientHeight || document_.body.clientHeight;
			var defaultStr = {
				display: "block",//默认为隐藏状态
				noticeTitle: "提示信息",//提示title
				tk_width: 300,//弹框的默认宽度
				tk_height: 120,//弹框的默认高度
				noticeStr: "确定",
				okCallBack: okback,
				closeCallBack: closeback,
				okStr: "签章",
				closeStr: "取消",
				w_ifid : "confirm"+myid
			};
			if(option){
				if(option.okCallBack){
					defaultStr.okCallBack = option.okCallBack;
				}
				if(option.closeCallBack){
					defaultStr.closeCallBack = option.closeCallBack;
				}
				if(option.noticeStr){
					defaultStr.noticeStr = option.noticeStr;
				}
				if(option.okStr){
					defaultStr.okStr = option.okStr;
				}
				if(option.closeStr){
					defaultStr.closeStr = option.closeStr;
				}
				if(option.w_ifid){
					defaultStr.w_ifid = option.w_ifid;
				}
			}
			if(defaultStr.tk_height>screen_h){
				defaultStr.tk_height = screen_h - 10;
				defaultStr.tk_top = ( screen_h - 10 )/2;
			}
			var setting = $.extend(defaultStr, option);
			$(document_.body).append('<div class="tm_bj" id="'+ setting.w_ifid 
					+'"><div class="window notice_qian">'
					+'<div class="notice_text"><div class="notice_content qian_m"></div>'
					+'<div style="clear:both"></div>'
					+'<div class="zf_btn zf_btn_ok public_ok"><i style="padding-right:5px" class="iconfont icon-qianbao"></i>'+setting.okStr+'</div>'
					+'<div class="zf_btn zf_btn_back publick_back">'+setting.closeStr+'</div>'
					+'</div></div></div>');
			var windowcon = $(document_.body).find("#"+setting.w_ifid).children(".notice_qian");
			windowcon.css({
				"display": setting.display,
				"width": setting.tk_width + "px",
				"height": setting.tk_height + "px",
				"margin-left": -setting.tk_width/2 + "px",
				"margin-top": -setting.tk_height/2 + "px",
				"left": "50%",
				"top": "50%"
			});
			windowcon.find(".qian_m").append(setting.noticeStr);
			windowcon.find(".public_ok").unbind("click").click(function() {
				$(this).parent().parent().parent().remove();
				setting.okCallBack();
			});
			windowcon.find(".publick_back").unbind("click").click(function(){
				$(this).parent().parent().parent().remove();
				setting.closeCallBack();
			});
			function okback(){}
			function closeback(){}
			return windowcon;
		}
	});
})(jQuery);
//上面是插件的写法

function getTimer(){
	var timer = "";
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth()+1;
	var day = myDate.getDate();
	var hour = myDate.getHours();
	var minus = myDate.getMinutes();
	var second = myDate.getSeconds();
	timer = year+ ""  + month+ ""  + day+ ""  + hour+ ""  + minus+ ""  + second + "" +Math.round(Math.random()*100);
	return timer;
}