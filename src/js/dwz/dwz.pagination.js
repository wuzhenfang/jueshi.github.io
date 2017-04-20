/**
 * 
 * @author ZhangHuihua@msn.com
 * @param {Object} opts Several options
 */
(function($){
	$.fn.extend({
		pagination: function(opts){
			var setting = {
				first$:"li.j-first", prev$:"li.j-prev", next$:"li.j-next", last$:"li.j-last", nums$:"li.j-num>a", jumpto$:"li.jumpto",
				pageNumFrag:'<li class="#liClass#"><a href="javascript:;" class="btnClass big">#pageNum#</a></li>'
			};
			return this.each(function(){
				var $this = $(this);
				var pc = new Pagination(opts);
				$("#totalCount").text(opts.totalCount);
				var interval = pc.getInterval();
				var pageNumFrag = '';
				for (var i=interval.start; i<interval.end;i++){
					pageNumFrag += setting.pageNumFrag.replaceAll("#pageNum#", i).replaceAll("#liClass#", i==pc.getCurrentPage() ? 'selected j-num' : 'j-num');
				}
				var paginationHtml = '<ul>'+
										'<li class="j-first">'+
											'<a class="first" href="javascript:;"><span class="btnClass big">首页</span></a>'+
											'<span class="first btnClass big">首页</span>'+
										'</li>'+
										'<li class="j-prev">'+
											'<a class="previous" href="javascript:;"><span class="btnClass big"><</span></a>'+
											'<span class="previous btnClass big"><</span>'+
										'</li>'+
										'#pageNumFrag#'+
										'<li class="j-next">'+
											'<a class="next" href="javascript:;"><span class="btnClass big">></span></a>'+
											'<span class="next btnClass big">></span>'+
										'</li>'+
										'<li class="j-last">'+
											'<a class="last" href="javascript:;"><span class="btnClass big">末页</span></a>'+
											'<span class="last btnClass big">末页</span>'+
										'</li>';
				if(pc.opts.pageNumShown <= 0){
					paginationHtml = paginationHtml.replaceAll("首页","").replaceAll("上一页","").replaceAll("下一页","").replaceAll("末页","");
				}
//				if(pc.opts.jumpto){
//					paginationHtml +='<li class="jumpto"><input class="textInput" type="text" size="4" value="#currentPage#" /><input class="goto btnClass big" type="button" value="跳转" /></li>';
//				}
				paginationHtml +='</ul>';
				$this.html(paginationHtml.replaceAll("#pageNumFrag#", pageNumFrag).replaceAll("#currentPage#", pc.getCurrentPage())).find("li").hoverClass();
	
				var $first = $this.find(setting.first$);
				var $prev = $this.find(setting.prev$);
				var $next = $this.find(setting.next$);
				var $last = $this.find(setting.last$);
				
				if (pc.hasPrev()){
					$first.add($prev).find(">span").hide();
					_bindEvent($prev, pc.getCurrentPage()-1, pc.rel());
					_bindEvent($first, 1, pc.rel());
				} else {
					$first.add($prev).addClass("disabled").find(">a").hide();
				}
				
				if (pc.hasNext()) {
					$next.add($last).find(">span").hide();
					_bindEvent($next, pc.getCurrentPage()+1, pc.rel());
					_bindEvent($last, pc.numPages(), pc.rel());
				} else {
					$next.add($last).addClass("disabled").find(">a").hide();
				}
	
				$this.find(setting.nums$).each(function(i){
					_bindEvent($(this), i+interval.start, pc.rel());
				});
				$this.find(setting.jumpto$).each(function(){
					var $this = $(this);
					var $inputBox = $this.find(":text");
					var $button = $this.find(":button");
					$button.click(function(event){
						var pageNum = $inputBox.val();
						if (pageNum && pageNum.isPositiveInteger()) {
							opts.reload({pageNum:pageNum});
						}
					});
					$inputBox.keyup(function(event){
						if (event.keyCode == DWZ.keyCode.ENTER) $button.click();
					});
				});
			});
			
			function _bindEvent($target, pageNum, rel){
				$target.bind("click", {pageNum:pageNum}, function(event){
					opts.reload({pageNum:event.data.pageNum});
					event.preventDefault();
				});
			}
		},
		
		orderBy: function(options){
			var op = $.extend({ asc:"asc", desc:"desc"}, options);
			var me = this;
			return this.each(function(){
				var $this = $(this).css({cursor:"pointer"}).click(function(){
					if($this.attr('buttonDownFlag')){
						$this.removeAttr('buttonDownFlag')
						return;
					}
					var orderField = $this.attr("orderField");
					//清空其他排序
					me.each(function(){
						if($(this).attr("orderField") != orderField){
							$(this).removeClass(op.asc);
							$(this).removeClass(op.desc)
						}
					});
					
					var orderDirection = op.asc;
					if($this.hasClass(op.asc)){
						$this.removeClass(op.asc)
						$this.addClass(op.desc)
						orderDirection = op.desc;
					}else if($this.hasClass(op.desc)){
						$this.removeClass(op.desc)
						$this.addClass(op.asc)
						orderDirection = op.asc;
					}else{
						$this.addClass(op.asc)
						orderDirection = op.asc;
					}
					op.handler(orderField,orderDirection);
				});
				
			});
		},
		pagerForm: function(options){
			var op = $.extend({pagerForm$:"#pagerForm", parentBox:document}, options);
			var frag = '<input type="hidden" name="#name#" value="#value#" />';
			return this.each(function(){
				var $searchForm = $(this), $pagerForm = $(op.pagerForm$, op.parentBox);
				var actionUrl = $pagerForm.attr("action").replaceAll("#rel#", $searchForm.attr("action"));
				$pagerForm.attr("action", actionUrl);
				$searchForm.find(":input").each(function(){
					var $input = $(this), name = $input.attr("name");
					if (name && (!$input.is(":checkbox,:radio") || $input.is(":checked"))){
						if ($pagerForm.find(":input[name='"+name+"']").length == 0) {
							var inputFrag = frag.replaceAll("#name#", name).replaceAll("#value#", $input.val());
							$pagerForm.append(inputFrag);
						}
					}
				});
			});
		}
	});
	
	var Pagination = function(opts) {
		this.opts = $.extend({
			rel:"", //用于局部刷新div id号
			totalCount:0,
			numPerPage:10,
			pageNumShown:10,
			currentPage:1,
			jumpto:true,
			callback:function(){return false;}
		}, opts);
	}
	
	$.extend(Pagination.prototype, {
		rel:function(){return this.opts.rel},
		numPages:function() {
			return Math.ceil(this.opts.totalCount/this.opts.numPerPage);
		},
		getInterval:function(){
			if(this.opts.pageNumShown <= 0){
				return {start:0, end:0};
			}
			var ne_half = Math.ceil(this.opts.pageNumShown/2);
			var np = this.numPages();
			var upper_limit = np - this.opts.pageNumShown;
			var start = this.getCurrentPage() > ne_half ? Math.max( Math.min(this.getCurrentPage() - ne_half, upper_limit), 0 ) : 0;
			var end = this.getCurrentPage() > ne_half ? Math.min(this.getCurrentPage()+ne_half, np) : Math.min(this.opts.pageNumShown, np);
			return {start:start+1, end:end+1};
		},
		getCurrentPage:function(){
			var currentPage = parseInt(this.opts.currentPage);
			if (isNaN(currentPage)) return 1;
			return currentPage;
		},
		hasPrev:function(){
			return this.getCurrentPage() > 1;
		},
		hasNext:function(){
			return this.getCurrentPage() < this.numPages();
		}
	});
})(jQuery);
