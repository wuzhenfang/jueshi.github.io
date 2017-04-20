(function($){
	$.fn.extend({
		initMenuCtrl: function(){
			var lis = $(this).children("ul").children("li");
			lis.children("ul").each(function(){
				var sublis = $(this).children("li");
				var oneHeight = sublis.eq(0).height()+3;
				var size = sublis.length;
				$(this).css("top", -oneHeight*(size)+"px"); 
				$(this).height(oneHeight*size);
				var liWidth = 0;
				sublis.each(function(){
					var $thisWidth = ($(this).text().length*18)+55;
					liWidth =$thisWidth>liWidth?$thisWidth:liWidth;
				});
				$(this).width(liWidth+"px");
			});
			lis.hover(function(){
				var subMenus = $(this).children("a").siblings("ul");
				subMenus.show();
			},function(){
				var subMenus = $(this).children("a").siblings("ul");
				subMenus.hide();
			});
		}
	});
})(jQuery);