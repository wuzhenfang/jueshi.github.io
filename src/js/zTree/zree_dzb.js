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
 		{ id: 1, pId: 100, name:"市价监局"},
 			{ id: 11, pId: 1, name:"张三"},
 			{ id: 12, pId: 1, name:"李四"},
 		{ id: 2, pId: 100, name:"资环处"},
 			{ id: 21, pId: 2, name:"王五"},
 			{ id: 22, pId: 2, name:"赵六"}
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