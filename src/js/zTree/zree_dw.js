$(function(){
	$(window).resize(function(){
		var w = $(window).height();
	$(".divInline").height(w-100);
	$(".leftPeople").height(w-142);
	$(".rightdj").width($(".centerBody").width()-250);
	});
	$(window).resize();
	$(".bottommenu .baocun").click(function(){
		$(this).popAlert({
			noticeStr:"添加成功！"
		});
	});
	var appendhtml;
	var zNodes = [
        { id: 100, pId: 0, name:"北京市发展改革委机关党委", open:true},
		{ id: 1, pId: 100, name:"办公室党支部"},
		{ id: 2, pId: 100, name:"研究室党支部"},
 		{ id: 3, pId: 100, name:"法规处党支部"},
 		{ id: 4, pId: 100, name:"规划处党支部"},
 		{ id: 5, pId: 100, name:"综合处党支部"},
 		{ id: 6, pId: 100, name:"体改处党支部"},
 		{ id: 7, pId: 100, name:"人口处党支部"},
 		{ id: 8, pId: 100, name:"投资处党支部"},
 		{ id: 9, pId: 100, name:"产业处党支部"},
 		{ id: 10, pId: 100, name:"外资处党支部"},
 		{ id: 11, pId: 100, name:"区县处党支部"},
 		{ id: 12, pId: 100, name:"协同处党支部"},
 		{ id: 13, pId: 100, name:"基础处党支部"},
 		{ id: 14, pId: 100, name:"高技术处党支部"},
 		{ id: 15, pId: 100, name:"资环处党支部"},
 		{ id: 16, pId: 100, name:"社会处党支部"},
 		{ id: 17, pId: 100, name:"经贸处党支部"},
 		{ id: 18, pId: 100, name:"价格处党支部"},
 		{ id: 19, pId: 100, name:"收费处党支部"},
		{ id: 20, pId: 100, name:"机关服务党支部"},
		{ id: 21, pId: 100, name:"世行办(21世纪办)党支部"},
		{ id: 22, pId: 100, name:"气候研究党支部"},
		{ id: 23, pId: 100, name:"市价监局党委"},
		{ id: 24, pId: 100, name:"联合党委"},
		{ id: 25, pId: 100, name:"节能中心党委"},
		{ id: 26, pId: 100, name:"工程咨询党委"},
		{ id: 27, pId: 100, name:"信息中心党总支"},
		{ id: 28, pId: 100, name:"老干部党总支"}
 	];
   	var zTree;
 	//配置菜单树
 	var setting = {
 		view:{
 			showLine: false,
 			autoCancelSelected:false,//不允许多选
 			nameIsHTML:true
 		},
 		data: {
 			key: {
 				name: "name",
 				title: "name"
 			},
 			simpleData: {
 				enable: true
 			}
 		},
 		callback:{
 			onAsyncSuccess: function(event, treeId, treeNode, msg){
 				if (!zTree.getNodes()) return null;
 				zTree.expandNode(zTree.getNodes()[0], true, false, false);
 			},
 			beforeClick: function(treeId, treeNode){
 				if(treeNode.isParent){
 					if(!treeNode.open) {
 						zTree.expandNode(treeNode);
 					}
 				}
 			}
 		}
 	};
 	
 	zTree = $.fn.zTree.init($("#tree"), setting, zNodes);
 
 	
 	
});