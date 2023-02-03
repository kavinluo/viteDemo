/*
 js_loading函数
 Author:zyc
 Data:2012-3-16
 */
(function($){		  
	$._crateLoading = function(options,mes){ //页面加载loading		
		var zyc_loadObj = {loadId:'',isHasLoading:true};
		zyc_loadObj = $.extend({},zyc_loadObj, options); //将传递进来的对象移交给zyc_loadObj对象		
		if(zyc_loadObj.loadingObj!=undefined) zyc_loadObj.loadId = zyc_loadObj.loadingObj;
		function getRootPath(){ 
		   	 var pathName = window.location.pathname.substring(1); 
		   	 var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/')); 
		     var rootPath=window.location.protocol + '//' + window.location.host /*+ '/'*/+''; 
		   	 if(webName != ''){
		   		rootPath=rootPath + '/' + webName; 
		   	 }
		   	 return rootPath;
		}    

		//创建loading效果
		/*var loadImg = "<object id=\""+zyc_loadObj.loadId+"_imgId\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0\" width=\"90\" height=\"88\">"
		  +"<param name=\"movie\" value=\"../images/loading.swf\" />"
		  +"<param name=\"quality\" value=\"high\" />"
		  +"<param name=\"wmode\" value=\"transparent\" />"
		  +"<embed id=\""+zyc_loadObj.loadId+"_imgId2\" src=\"../images/loading.swf\" wmode=\"transparent\" quality=\"high\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width=\"90\" height=\"88\"></embed>"
		+"</object>"
		var loadObj = "<div id=\""+zyc_loadObj.loadId+"_loadingId\" style=\"position:absolute; top:50%; left:50%; width:90px; height:88px;  margin:-44px 0 0 -45px;z-index:100000\">"+loadImg+"</div>";*/
		if(typeof(mes)=="undefined"||mes==""){
			mes = "正在加载";
		}
		var loadImg = "<img src=\""+getRootPath()+"/images/loading.gif\" width=\"37\" height=\"37\" /><span style=\"color:#FF0000\">"+mes+"……</span>"
		if(!zyc_loadObj.isHasLoading){
			loadImg="<span style=\"background-color:#F8EFB4;border:1px solid #EED64D;padding:8px;color:#990000;font-size:20px\"><trong>此状态无法修改！</trong></span>";
		}
		var loadObj = "<div id=\""+zyc_loadObj.loadId+"_loadingId\" style=\"position:absolute; top:50%; left:50%; width:120px; height:88px;  margin:-60px 0 0 -45px;z-index:1000001\">"+loadImg+"</div>";
		if(!zyc_loadObj.isHasLoading){
			loadObj = "<div id=\""+zyc_loadObj.loadId+"_loadingId\" style=\"position:absolute;z-index:1000001\">"+loadImg+"</div>";
		}
		
		var maskIframe = "<div id=\""+zyc_loadObj.loadId+"_mask_Id\" style=\"position:absolute;top:0;left:0;background-color:#33393C;filter:alpha(opacity=30);opacity:0.3;z-index:100000\"><iframe id=\""+zyc_loadObj.loadId+"_loadiMaskId\" style='position:absolute; left:0px; filter:alpha(opacity=0);-moz-opacity:0; z-index:99999;' align=\"center\" frameborder=\"0\" scrolling=\"no\" border=\"0\"></iframe></div>"
		if(zyc_loadObj.loadingObj==undefined){
			var wObj=window;
			if(wObj!=wObj.parent){
				var _w,_h;
				_w = top.document.body.clientWidth;
				_h = document.all ? top.document.getElementsByTagName("html")[0].offsetHeight : top.window.innerHeight;
				zyc_loadObj.loadingObj = top.$("body");		
				zyc_loadObj.loadingObj.append(maskIframe);
				zyc_loadObj.loadingObj.append(loadObj);	
				top.$("#"+zyc_loadObj.loadId+"_mask_Id,#"+zyc_loadObj.loadId+"_loadiMaskId").css("width",_w).css("height",_h);
			}else{
				zyc_loadObj.loadingObj = $("body");		
				zyc_loadObj.loadingObj.append(maskIframe);
				zyc_loadObj.loadingObj.append(loadObj);	
				$("#"+zyc_loadObj.loadId+"_mask_Id,#"+zyc_loadObj.loadId+"_loadiMaskId").css("width",getClient_wh()[0]).css("height",getClient_wh()[1]);	
			}			
		}else{
			zyc_loadObj.loadingObj = $("#"+zyc_loadObj.loadingObj);
			zyc_loadObj.loadingObj.append(maskIframe);
			zyc_loadObj.loadingObj.append(loadObj);
			var l,t,w,h,w1 = zyc_loadObj.loadingObj.width(),h1 = zyc_loadObj.loadingObj.height(),loadW,loadH;
				loadW = $("#"+zyc_loadObj.loadId+"_loadingId").width();
				loadH = $("#"+zyc_loadObj.loadId+"_loadingId").height();				
				if(loadW > w1){
					loadH=w1/loadW*h1;
					loadW=w1;
				}
				if(loadH > h1){
					loadW=h1/loadH*loadW;
					loadH=h1;
				}
				w = (w1 - loadW)/2;
				h = (h1 - loadH)/2;
				
				l = zyc_loadObj.loadingObj.offset().left;
				t = zyc_loadObj.loadingObj.offset().top;

			$("#"+zyc_loadObj.loadId+"_mask_Id,#"+zyc_loadObj.loadId+"_loadiMaskId").css("width",w1).css("height",h1);
			$("#"+zyc_loadObj.loadId+"_loadingId").attr("style","");
			$("#"+zyc_loadObj.loadId+"_mask_Id").css({position:"absolute",top:t,left:l});
			$("#"+zyc_loadObj.loadId+"_imgId,#"+zyc_loadObj.loadId+"_imgId2").attr({width:loadW,height:loadH});
			$("#"+zyc_loadObj.loadId+"_loadingId").css({position:"absolute",top:t+h,left:l+w,width:loadW,height:loadH});
		}
	}
	$._deLoading = function(options){
		var zyc_loadObj = {loadId:''};
		zyc_loadObj = $.extend({},zyc_loadObj, options); //将传递进来的对象移交给zyc_loadObj对象
		if(zyc_loadObj.loadingObj!=undefined) zyc_loadObj.loadId = zyc_loadObj.loadingObj;
		if(parent){
			try{
				top.$("#"+zyc_loadObj.loadId+"_loadingId,#"+zyc_loadObj.loadId+"_mask_Id").remove();
			}catch(e){}
		}
		$("#"+zyc_loadObj.loadId+"_loadingId,#"+zyc_loadObj.loadId+"_mask_Id").remove();
	}
})(jQuery);






