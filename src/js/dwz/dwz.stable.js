
(function($){
	$.fn.jTable = function(options){
		var $table = $(this);
	 	var nowrapTD = $table.attr("nowrapTD");
	 	var tlength = $table.width();
	 	var lockColumnNum = options.lockColumnNum?options.lockColumnNum:0;//锁定n列
	 	var fixDiv,fixTheadDiv,fixTbodyDiv,fixTheadDivTable,fixTheadDivThead,fixTheadDivTbody,fixTbodyDivTable,fixTbodyDivThead,fixTbodyDivTbody;
		var aStyles = [];
		var $tc = $table.parent().addClass("j-resizeGrid"); // table parent
															// container
		if(options.pagination){
			var paginationTem = '<div class="panelBar">'+
									'<div class="pages">'+
										'<span>显示</span>'+
										'<select class="combox" name="numPerPage">'+
											'<option value="10">10</option>'+
											'<option value="20">20</option>'+
											'<option value="50">50</option>'+
											'<option value="100">100</option>'+
											'<option value="200">200</option>'+
										'</select>'+
										'<span>条，共 <label id="totalCount">0</label> 条</span>'+
									'</div>'+
									'<div class="pagination"></div>'+
								'</div>';
			$tc.append(paginationTem);
			$("select[name=numPerPage]",$tc).bind("change",function(){
				reload({numPerPage:$(this).val(),pageNum:1});
			});
			//201511007 scl增加查询条件跟踪-开始
			var currentLocationHref = document.location.href;
			if(currentLocationHref.indexOf("http://") > -1){
				currentLocationHref = currentLocationHref.replace("http://","");
				currentLocationHref = currentLocationHref.substring(currentLocationHref.indexOf("/")+1);
			}
//			if(top.myQueryParams && top.myQueryParams[currentLocationHref] 
//				&& top.myQueryParams[currentLocationHref]["numPerPage"]){
//				options.param = $.extend({numPerPage:top.myQueryParams[currentLocationHref]["numPerPage"]},options.param);
//			}else{
//				options.param = $.extend({numPerPage:20},options.param);
//			}
			//201511007 scl增加查询条件跟踪-结束
//			$("select[name=numPerPage] option[value='"+options.param.numPerPage+"']").attr("selected","selected");
		}else{
			options.param = $.extend({numPerPage:10000},options.param);
		}
		var layoutH = $table.attr("layoutH");
		var oldThs = $table.find("thead>tr:last-child").find("th");
		for(var i = 0, l = oldThs.size(); i < l; i++) {
			var $th = $(oldThs[i]);
			var style = [];
			style[0] = $th.width()-7;
			style[1] = $th.attr("align");
			aStyles[aStyles.length] = style;
		}
		$table.wrap("<div class='grid'></div>");
		
		var $grid = $table.parent().html($table.html());
		
		var thead = $grid.find("thead");
		thead.wrap("<div class='gridHeader'><div class='gridThead'><table width='"+$table.attr("width")+"'></table></div></div>");

		var lastH = $(">tr:last-child", thead);
		var ths = $(">th", lastH);
		$("th",thead).each(function(i){
			var $th = $(this);
			if(i >= lockColumnNum){
//				$th.removeAttr("width").width("auto");
//				$th.html("<div class='gridCol'>"+ $th.html() +"</div>");
//				$th.find("div").attr("title",$th.text());
			}
			$th.contents().wrapAll($("<div class='gridCol'></div>").attr("title",$th.text()));
		});
		ths.each(function(i){
			var $th = $(this), style = aStyles[i];
			if(i >= lockColumnNum){
				$th.addClass(style[1]).hoverClass("hover").removeAttr("align").removeAttr("width");
				$th.width(style[0]);
			}
		}).filter("[orderField]").orderBy({
			handler:orderBy
		});
		var tbody = $('<tbody></tbody>');
		$grid.append(tbody);
		var layoutStr = layoutH ? " layoutH='" + layoutH + "'" : "";
		tbody.wrap("<div class='gridScroller'" + layoutStr + " ><div class='gridTbody'><table width='"+$table.attr("width")+"'></table></div></div>");
		
		initData(tbody,options);
		
		var scroller = $(".gridScroller", $grid);
		scroller.scroll(function(event){
			var header = $(".gridThead", $grid);
			if(scroller.scrollLeft() > 0){
				header.css("position", "relative");
				var scroll = scroller.scrollLeft();
				header.css("left", scroller.cssv("left") - scroll);
			}
			if(scroller.scrollLeft() == 0) {
				header.css("position", "relative");
				header.css("left", "0px");
			}
	        return false;
		});		
		if(lockColumnNum > 0){
			fixDiv = $("<div id='lockDiv'></div>").css({"position":"absolute","left":"0px","top":"0px","overflow":"hidden"});
			fixTheadDiv = $("<div></div>");
			fixDiv.append(fixTheadDiv);
			fixTheadDivTable = $("<table width='100%'></table>");
			fixTheadDivThead = $("<thead></thead>");
			fixTheadDivTbody = $("<tbody></tbody>");
			fixTheadDivTable.append(fixTheadDivThead).append(fixTheadDivTbody);
			fixTheadDiv.append(fixTheadDivTable);
			fixTbodyDiv = $("<div></div>").css({"overflow":"hidden"}).attr("class","gridTbody");
			fixDiv.append(fixTbodyDiv);
			fixTbodyDivTable = $("<table width='100%'></table>").css({"backgroundColor":"#efefef"});
			fixTbodyDivThead = $("<thead></thead>");
			fixTbodyDivTbody = $("<tbody></tbody>");
			fixTbodyDivTable.append(fixTbodyDivThead).append(fixTbodyDivTbody);
			fixTbodyDiv.append(fixTbodyDivTable);
			
			$grid.append(fixDiv);
		}
		$grid.append("<div class='resizeMarker' style='height:300px; left:57px;display:none;'></div><div class='resizeProxy' style='height:300px; left:377px;display:none;'></div>");
		$(">tr:last-child", thead).each(function(){
			$(">th", this).each(function(i){
				if(i >= lockColumnNum){
					var th = this, $th = $(this);
					$th.mouseover(function(event){
						var offset = $.jTableTool.getOffset(th, event).offsetX;
						if($th.outerWidth() - offset < 5) {
							$th.css("cursor", "col-resize").mousedown(function(event){
								$th.removeAttr('buttonDownFlag')
								$(".resizeProxy", $grid).show().css({
									left: $.jTableTool.getRight(th)- $(".gridScroller", $grid).scrollLeft(),
									top:$.jTableTool.getTop(th),
									height:$.jTableTool.getHeight(th,$grid),
									cursor:"col-resize"
								});
								$(".resizeMarker", $grid).show().css({
										left: $.jTableTool.getLeft(th) + 1 - $(".gridScroller", $grid).scrollLeft(),
										top: $.jTableTool.getTop(th),
										height:$.jTableTool.getHeight(th,$grid)									
								});
								$(".resizeProxy", $grid).jDrag($.extend(options, {scop:true, cellMinW:20, relObj:$(".resizeMarker", $grid)[0],
										move: "horizontal",
										event:event,
										stop: function(){
											var pleft = $(".resizeProxy", $grid).position().left;
											var mleft = $(".resizeMarker", $grid).position().left;
											var move = pleft - mleft - $th.innerWidth();
											var cols = $.jTableTool.getColspan($th);
											var cellNum = $.jTableTool.getCellNum($th);
											var ftr = $(">tr:first-child", tbody);
											var $dcell = $(">td", ftr).eq(cellNum - 1);
											
											if($dcell){
												$th.width($dcell.width() + move + "px");
												$dcell.width($dcell.width() + move+"px");
											}else{
												$th.width($th.width() + move + "px");
											}
											var $table1 = $(thead).parent();
											var $table2 = $(tbody).parent();
	// alert($table1.width()+","+$table2.width() + ","+$table2.parent().width()+
	// ","+$(".gridScroller", $grid).width());
//											if(($table1.width() + move) >= $(".gridScroller", $grid).width()){
												$table1.parent().width($table2.parent().width() + move);
												$table2.parent().width($table2.parent().width() + move);
//											}else{
//												$table1.parent().width($(".gridScroller", $grid).width()+ move);
//												$table2.parent().width($(".gridScroller", $grid).width()+ move);
//											}
											$(".resizeMarker,.resizeProxy", $grid).hide();
											_resizeGrid();
											var oldThs = $(tbody).find("tr:first").find("td");
											aStyles=[];
											for(var i = 0, l = oldThs.size(); i < l; i++) {
												var style = [];
												style[0] = $(oldThs[i]).width();
												style[1] = $(oldThs[i]).attr("align");
												aStyles[aStyles.length] = style;
											}
											$th.attr('buttonDownFlag',true);
										}
									})
								);
							});
						} else {
							$th.css("cursor", $th.attr("orderField") ? "pointer" : "default");
							$th.unbind("mousedown");
							$th.unbind("mouseup");
						}
						scroller.scroll();
						return false;
					});
				}
			});
		});
		function initData(tbody,options){
			//如果有url则以url为准,
			//否则的话将使用系统提供的统一Query封装，需要传递SQL文件地址
			var toUrl = options.url;
			var opts = {};
			if(!toUrl){
				toUrl = "/form/service/impl/QueryBase/load";//默认
				opts = {sqlFile:options.sqlFile};
			}
			//201511007 scl增加查询条件跟踪-开始
			var tableListParams = $.extend(options.param,opts);
			var myFollowPageListParams = getFollowPageListParams(tableListParams);
			var myFollowPageListParams_tmp = {};
			if(myFollowPageListParams){
				for(var myfplp in myFollowPageListParams){
					myFollowPageListParams_tmp[myfplp] = myFollowPageListParams[myfplp];
				}
				tableListParams = $.extend(myFollowPageListParams_tmp,tableListParams);
			}
			//201511007 scl增加查询条件跟踪-结束
//			$.UqianSoft.ajaxse(toUrl,tableListParams,
//					function(sr){
						if(options.renderTbodyTr){
							var totalCount = 0;
							if(options.totalCount){
								totalCount = options.totalCount;
								if(options.pagination){
									var definePageNumShown = options.pageNumShown||10;
									var jumpto = (options.jumpto|| options.jumpto==undefined)?true:false;
									definePageNumShown = (definePageNumShown>0)?definePageNumShown:0;
									var pageNumShown = Math.ceil(totalCount/$("select[name=numPerPage]").val());
									pageNumShown = pageNumShown>definePageNumShown?definePageNumShown:pageNumShown;
									$("div.pagination", $tc).pagination({
										reload:reload,
										totalCount:totalCount,
										numPerPage: 20,
										pageNumShown:pageNumShown,
										jumpto:jumpto,
										currentPage: 1
									});
								}
							}
							if(totalCount == 0 && sr.dt_pagination) {
								var noResult = "<tr id='noResult'><td colspan=80 style='text-align:center;' >没有任何记录</td></tr>";
								tbody.append(noResult);
							}else {
								tbody.append(options.renderTbodyTr());
								var ftr = $(">tr:first-child", tbody);
								var $trs = tbody.find('>tr');
								$trs.hoverClass().each(function(){
									var $tr = $(this);
									var $ftds = $(">td", this);
									$ftds.css("position","relative");
									for (var i=0; i < $ftds.size(); i++) {
										var $ftd = $($ftds[i]);
										if (nowrapTD != "false"){
											var ftdTitle = $ftd.attr("title");
											if(!$ftd.attr("title")){
												ftdTitle = $ftd.text();
											}
											$ftd.contents().wrapAll($("<div></div>").attr("title",ftdTitle));
	//										$ftd.html("<div>" + $ftd.html() + "</div>");
	//										$ftd.find("div").attr("title",$ftd.text());
										}
						// if (i < aStyles.length) $ftd.addClass(aStyles[i][1]);
									}		
								});
								var tdcolspan_ = 0;
								$(">td",ftr).each(function(i){
									if (i < aStyles.length){
										var tdwidth = parseInt(aStyles[i+tdcolspan_][0]);
										var tdcolspan = $(this).attr("colspan");
										if(tdcolspan){
											for(var tdc = 1 ; tdc < tdcolspan ; tdc++){
												tdwidth += aStyles[i+tdcolspan_+tdc][0];
											}
											tdcolspan_ = tdcolspan-1;
										}
										$(this).width(tdwidth);
									}
								});
							}
							$(window).resize();
						}
						//201511007 scl增加查询条件跟踪-开始
						followPageListParams(tableListParams);
						//201511007 scl增加查询条件跟踪-结束
//					},
//					function(er){
//						if(er){
//							if(er.responseText){
//								var text = JSON.parse(er.responseText);
//								if(text.exception_dt[0]){
//									var msg = text.exception_dt[0].exception_message;
//									if(msg){
//										alert(msg);
//									}
//								}
//							}
//						}
//					}
//			);
		}
		function orderBy(orderField,orderDirection){
			reload({orderField:orderField,orderDirection:orderDirection,pageNum:1});
		}
		function _innerResizeGrid(){
			$("div.j-resizeGrid").each(function(){
				var percentNum = $("div.gridScroller", this).width();
				if (options.minusHeight){
					var bodyHeight = document.documentElement.clientHeight;
					var height = bodyHeight-options.minusHeight;
					$("div.gridScroller", this).height(height+"px");
				}
				var width = $(this).innerWidth();
				$("div.gridScroller", this).width(width);
			});
		}
		function _resizeGrid(){
			$("div.j-resizeGrid").each(function(){
				var percentNum = $("div.gridScroller", this).width();
				if (options.minusHeight){
					var bodyHeight = document.documentElement.clientHeight;
					var height = bodyHeight-options.minusHeight;
					$("div.gridScroller", this).height(height+"px");
				}
				var width = $(this).innerWidth();
//				if($("div.gridTbody table").height() > $("div.gridScroller", this).height()){
//					if($("div.gridTbody tr").length>0){
//						$("div.gridTbody", this).width($("div.gridTbody", this).width()-20);
//					}
//				}
				$("div.gridScroller", this).width(width);
				if($("div.gridTbody tr").length>0 && $("#noResult").length == 0){
					$("div.gridThead", this).width($("div.gridTbody", this).width());
					$("div.gridThead th",this).each(function(i){
						$(this).width("auto");
					});
					var tbodyTdwidth = [];
					$("div.gridTbody tr:first>td", this).each(function(i){
						tbodyTdwidth[i] = $(this).width();
					});
					$("div.gridThead tr:last>th",this).each(function(i){
						$(this).width(tbodyTdwidth[i]);
					});
					if(lockColumnNum > 0){
						fixTheadDiv.height($(this).find("div.grid .gridHeader").height());
						var hasScrollBarH = $(this).find("div.grid .gridScroller")[0].scrollHeight > $(this).find("div.grid .gridScroller").height();
						var hasScrollBarW = $(this).find("div.grid .gridScroller")[0].scrollWidth+17 > $(this).find("div.grid .gridScroller").width();
						var miniHeight = hasScrollBarW?17:0;
						fixTbodyDiv.height($(this).find("div.grid .gridScroller").height()-miniHeight);
						fixTheadDivThead.children().remove();
						$("div.gridThead tr",this).each(function(){
							var $tr = $(this);
							var fixTr = $("<tr></tr>");
							$("th",$tr).each(function(i){
								var $th = $(this);
								var fixTh = $th.clone(true);
								fixTh.css({
									"width":$th.css("width"),
									"height":$th.css("height"),
									"lineHeight":$th.css("lineHeight"),
									"color":$th.css("color"),
									"fontWeight":$th.css("fontWeight"),
									"borderTopWidth":$th.css("borderTopWidth"),
									"borderBottomWidth":$th.css("borderBottomWidth"),
									"borderRightWidth":$th.css("borderRightWidth"),
									"borderLeftWidth":$th.css("borderLeftWidth"),
									"borderTopStyle":$th.css("borderTopStyle"),
									"borderBottomStyle":$th.css("borderBottomStyle"),
									"borderRightStyle":$th.css("borderRightStyle"),
									"borderLeftStyle":$th.css("borderLeftStyle"),
									"borderTopColor":$th.css("borderTopColor"),
									"borderBottomColor":$th.css("borderBottomColor"),
									"borderRightColor":$th.css("borderRightColor"),
									"borderLeftColor":$th.css("borderLeftColor"),
									"paddingTop":$th.css("paddingTop"),
									"paddingBottom":$th.css("paddingBottom"),
									"paddingRight":$th.css("paddingRight"),
									"paddingLeft":$th.css("paddingLeft"),
									"backgroundImage":$th.css("backgroundImage"),
									"backgroundPosition":$th.css("backgroundPosition"),
									"backgroundColor":$th.css("backgroundColor")
								});
								fixTh.find("div").css({
									"width":$th.find("div").css("width"),
									"height":$th.find("div").css("height"),
									"lineHeight":$th.find("div").css("lineHeight"),
									"color":$th.find("div").css("color"),
									"overflow":$th.find("div").css("overflow"),
									"fontWeight":$th.find("div").css("fontWeight"),
									"borderTopWidth":$th.find("div").css("borderTopWidth"),
									"borderBottomWidth":$th.find("div").css("borderBottomWidth"),
									"borderRightWidth":$th.find("div").css("borderRightWidth"),
									"borderLeftWidth":$th.find("div").css("borderLeftWidth"),
									"borderTopStyle":$th.find("div").css("borderTopStyle"),
									"borderBottomStyle":$th.find("div").css("borderBottomStyle"),
									"borderRightStyle":$th.find("div").css("borderRightStyle"),
									"borderLeftStyle":$th.find("div").css("borderLeftStyle"),
									"borderTopColor":$th.find("div").css("borderTopColor"),
									"borderBottomColor":$th.find("div").css("borderBottomColor"),
									"borderRightColor":$th.find("div").css("borderRightColor"),
									"borderLeftColor":$th.find("div").css("borderLeftColor"),
									"paddingTop":$th.find("div").css("paddingTop"),
									"paddingBottom":$th.find("div").css("paddingBottom"),
									"paddingRight":$th.find("div").css("paddingRight"),
									"paddingLeft":$th.find("div").css("paddingLeft"),
									"backgroundColor":$th.find("div").css("backgroundColor")
								});
								if(i < lockColumnNum){
									fixTr.append(fixTh);
								}
							});
							fixTheadDivThead.append(fixTr);
						});
						fixTbodyDivTbody.children().remove();
						$("div.gridTbody tr",this).each(function(){
							var $tr = $(this);
							var fixTr = $("<tr></tr>");
							$("td",$tr).each(function(i){
								var $td = $(this);
								var fixTd = $td.clone(true);
								fixTd.width(tbodyTdwidth[i])
								if(i < lockColumnNum){
									fixTr.append(fixTd);
								}
							});
							fixTbodyDivTbody.append(fixTr);
						});
						$("div.gridScroller", this).scroll(function(){
							fixTbodyDiv.scrollTop($(this).scrollTop());
						});
					}
				}
			});
		}
		_innerResizeGrid();
		$(window).resize(function(){
			_resizeGrid();
		});
		$(window).resize();
		function reload(opts){
			$("div.gridTbody table tbody tr",$grid).remove();
			if(lockColumnNum > 0){
//				fixTheadDivThead.children().remove();
				fixTbodyDivTbody.children().remove();
			}
			options.param = $.extend(options.param,opts)
			initData($("div.gridTbody table tbody",$grid),options);
		}
		//201511007 scl增加查询条件跟踪-开始
		function getFollowPageListParams(optionsParams){
			var myFollowPageListParams = null;
//			if(!top.myQueryParams){
//				top.myQueryParams = {};
//			}
//			var currentLocationHref = document.location.href;
//			if(currentLocationHref.indexOf("http://") > -1){
//				currentLocationHref = currentLocationHref.replace("http://","");
//				currentLocationHref = currentLocationHref.substring(currentLocationHref.indexOf("/")+1);
//			}
//			if(top.myQueryParams && top.myQueryParams[currentLocationHref]){
//				myFollowPageListParams = top.myQueryParams[currentLocationHref];
//				myFollowPageListParams = $.extend(myFollowPageListParams,optionsParams);
//				for(var topMyQueryParam in myFollowPageListParams){
//					if("pageNum" == topMyQueryParam){
//						//不做任何事情
//					}else if("numPerPage" == topMyQueryParam){
//						$("select[name=\"numPerPage\"]").val(myFollowPageListParams[topMyQueryParam]);
//					}else if("orderField" == topMyQueryParam){
//						var orderDirection_ = myFollowPageListParams["orderDirection"];
//						if("asc" == orderDirection_){
//							$("th[orderField=\""+myFollowPageListParams[topMyQueryParam]+"\"]").removeClass("desc");
//							$("th[orderField=\""+myFollowPageListParams[topMyQueryParam]+"\"]").addClass("asc")
//						}else{
//							$("th[orderField=\""+myFollowPageListParams[topMyQueryParam]+"\"]").addClass("desc");
//							$("th[orderField=\""+myFollowPageListParams[topMyQueryParam]+"\"]").removeClass("asc")
//						}
//					}else{
//						$("#"+topMyQueryParam).val(myFollowPageListParams[topMyQueryParam]);
//					}
//					
//				}
//			}
			return myFollowPageListParams;
		}
		function followPageListParams(optionsParams){
//			var currentLocationHref = document.location.href;
//			if(currentLocationHref.indexOf("http://") > -1){
//				currentLocationHref = currentLocationHref.replace("http://","");
//				currentLocationHref = currentLocationHref.substring(currentLocationHref.indexOf("/")+1);
//			}
//			top.myQueryParams[currentLocationHref] = optionsParams;
		}
		//201511007 scl增加查询条件跟踪-结束
		return{
			option:options,
			reload:function(opts){
				reload(opts);
			}
		}
	};
	
	
	$.jTableTool = {
		getLeft:function(obj) {
			var width = 0;
			$(obj).prevAll().each(function(){
				width += $(this).outerWidth();
			});
			return width - 1;
		},
		getRight:function(obj) {
			var width = 0;
			$(obj).prevAll().andSelf().each(function(){
				width += $(this).outerWidth();
			});
			return width - 1;
		},
		getTop:function(obj) {
			var height = 0;
			$(obj).parent().prevAll().each(function(){
				height += $(this).outerHeight();
			});
			return height;
		},
		getHeight:function(obj, parent) {
			var height = 0;
			var head = $(obj).parent();
			head.nextAll().andSelf().each(function(){
				height += $(this).outerHeight();
			});
			$(".gridTbody", parent).children().each(function(){
				height += $(this).outerHeight();
			});
			return height;
		},
		getCellNum:function(obj) {
			return $(obj).prevAll().andSelf().size();
		},
		getColspan:function(obj) {
			return $(obj).attr("colspan") || 1;
		},
		getStart:function(obj) {
			var start = 1;
			$(obj).prevAll().each(function(){
				start += parseInt($(this).attr("colspan") || 1);
			});
			return start;
		},
		getPageCoord:function(element){
			var coord = {x: 0, y: 0};
			while (element){
			    coord.x += element.offsetLeft;
			    coord.y += element.offsetTop;
			    element = element.offsetParent;
			}
			return coord;
		},
		getOffset:function(obj, evt){
			if($.browser.msie ) {
				var objset = $(obj).offset();
				var evtset = {
					offsetX:evt.pageX || evt.screenX,
					offsetY:evt.pageY || evt.screenY
				};
				var offset ={
			    	offsetX: evtset.offsetX - objset.left,
			    	offsetY: evtset.offsetY - objset.top
				};
				return offset;
			}
			var target = evt.target;
			if (target.offsetLeft == undefined){
			    target = target.parentNode;
			}
			var pageCoord = $.jTableTool.getPageCoord(target);
			var eventCoord ={
			    x: window.pageXOffset + evt.clientX,
			    y: window.pageYOffset + evt.clientY
			};
			var offset ={
			    offsetX: eventCoord.x - pageCoord.x,
			    offsetY: eventCoord.y - pageCoord.y
			};
			return offset;
		}
	};
})(jQuery);
$(function(){
	setTimeout(function(){
		$(".gridTbody tbody tr").each(function(){
			var $tr = $(this);
			var $tds = $tr.children("td");
			var $tds_icon = $tds.filter(":eq(0)");
			if($tds_icon.find("i")){
				$tds_icon.find("i").addClass("hhfexid");
				$tds_icon.css({"text-align":"center","padding":"0px"});
				$tds_icon.css("padding-left","2px");
			}
		});
	},50);
	$("body").on("click",".grid input:checkbox[name=items]",function(){
		var flag = this.checked;
		$(this).parents(".grid").find("input:checkbox[name=item]").prop("checked",flag);
	});
	$("body").on("click",".grid input:checkbox[name=item]",function(){
		var flag = $(this).parents(".gridTbody").find(":checkbox[name=item]").length==$(this).parents(".gridTbody").find(":checkbox[name=item]:checked").length;
		$(this).parents(".grid").find("input:checkbox[name=items]").prop("checked",flag);
	});
});