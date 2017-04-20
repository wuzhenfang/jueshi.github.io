$(function(){
	$("#list").jTable({ 
		minusHeight: 80,
		totalCount: 16,
		pagination: true,
		renderTbodyTr:function(){
			var tbody_tr = $('<tbody></tbody>');
			for(var d = 0 ; d < gridData.length; d++){
				var data = gridData[d];
				$tr = $('<tr></tr>');
				for(var key in data) {
					var value = data[key];
					$td = $('<td style="text-align:center;"></td>');
					$td.append(value);
					$tr.append($td);
				}
				tbody_tr.append($tr);
			}
			return tbody_tr.children();
		}
	});
	$("body").on("dblclick",".gridTbody table tbody tr",function(){
		var name = $(this).children("td").filter(":eq(0)").find("div").html();
		var idcard = $(this).children("td").filter(":eq(1)").find("div").html();
		$(window.opener.document).find(".xname").val(name);
		$(window.opener.document).find(".idcard").val(idcard);
		$("#wuclose_tmbg").click();
	});
});
