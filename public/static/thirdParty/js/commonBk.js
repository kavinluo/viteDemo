/*
 公用js函数
 Author:zyc
 Data:2012-3-16
 */
 /*iframe页面未完全装载时添加loading*/
var stateChangeIE = function(_frame){
	 if (_frame.readyState=="complete"){//state: loading ,interactive,   complete
		 top.$._deLoading();
	 }
	}
var stateChangeFirefox = function (_frame) {
		top.$._deLoading();
	}
//设置普通input外观
$(function(){
	$("input[type='text']").addClass("commInput");
	$("input.inputFile").attr("size","1");
})
//获得页面可见内容区域的高度
function getClient_wh(){

	var w = $("body")[0].clientWidth;
  var h = document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight;
	return [w,h];
}
//获得页面实际内容的高度
function getBdScroll_h(){
  var windowHeight = document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight;
  var h = Math.max(windowHeight, document.getElementsByTagName("body")[0].scrollHeight);
	return h;
}

//随窗口变化而计算宽度的函数
function dealWithSth() {
	if(typeof(setTabCss)=="function"){
		setTabCss();
	}
	if(typeof(setIE7IframeH)=="function"){
		setIE7IframeH();
	}
};
$(function(){
	myzyc_w = document.body.clientWidth;
  myzyc_h = document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight;
	if(typeof(setTabCss)=="function"){
		//setTimeout("setTabCss()",10);
    setTabCss();
  }
  setIE7IframeH();
})

var myzyc_w = 0;
var myzyc_h = 0;
var pResizeTimer = null;
$(window).bind(
  'resize',
 function() {
	var changeW = document.getElementsByTagName("html")[0].clientWidth;
	var changeH = document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight;
	//alert(myzyc_w+"---"+changeW+"&&&"+myzyc_h+"---"+changeH)
   if (myzyc_w == changeW && myzyc_h == changeH) {
		return ;
	}else{
		myzyc_w=changeW;
		myzyc_h=changeH;
	}
   if (pResizeTimer) clearTimeout(pResizeTimer);
    pResizeTimer= setTimeout("dealWithSth()", 10);
 }
);
//设置IE7下IFRAME高度100%
function is360se(){
	var UA=navigator.userAgent;
	return UA.toLowerCase().indexOf('360se')>-1 ? true : false;
}


var setIE7IframeH = function (){
	try{
	if ($.browser.msie){
		 if(parseInt($.browser.version)==7||is360se()){
			 if($(".homeTopBox").html()==null){
			 	$("body").attr("scroll","no");
			 }
		 	/*if($("#Jo_PageContent").html()!=null){
				$("#Jo_PageContent .inner").find("iframe").eq(0).css("height",$("#Jo_PageContent").height());
			}*/
		 }
	};
	}catch(e){}
}

//创建提示语 <a href=\"javascript:delPrompt()\">关闭</a>
function createPrompt(str){
	var loadObj = "<div id=\"promptDiv\" style=\"position:absolute;border:1px solid #cf6600;background-color:#fffbb7;font-weight:bold;text-align:center;top:50%;;left:50%;width:350px;height:30px;line-height:30px;margin:15px 0 0 -150px;display:none;z-index:100000\">"+str+"&nbsp;<iframe style='position:absolute; left:0px; filter:alpha(opacity=0);-moz-opacity:0; z-index:-1;' width=\"350\" height=\"30\" align=\"center\" frameborder=\"0\" scrolling=\"no\" border=\"0\"></iframe></div>";

	if(parent){
		top.$("body").append(loadObj);
		top.$('#promptDiv').stop();
		top.$("#promptDiv").show();
		setTimeout("top.$('#promptDiv').remove()",3000);
	}else{
		$("body").append(loadObj);
		$('#promptDiv').stop();
		$("#promptDiv").show();
		setTimeout("$('#promptDiv').remove()",3000);
	}
}
function delPrompt(){
	if(parent){
		top.$("#promptDiv").remove();
	}else{
		$("#promptDiv").remove();
	}
}

//一维数组中常用的js中没有带有的函数
var _$arr={
	repeatIndexArr:[], //例如：var c = a.concat(b) repeatIndexArr里面存储的是b中与a中重复的元素在c中的索引位置,若想从b删除重复的元素则需要repeatIndexArr中的元素减去a数组的长度即为在b中的索引位置。
  toObject: function (a) {
    var o = {};
		var arr = [];
    for (var i = 0, j = a.length; i < j; i = i + 1) {
			if(o[a[i]]){
				arr.push(i);
			}
			o[a[i]] = true;
		}
		_$arr.repeatIndexArr = arr;
    return o;
  },
  keys: function (o) {
    var a = [], i;
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        a.push(i);
      }
    }
    return a;
	},
	uniq:function(a) {
    return _$arr.keys(_$arr.toObject(a));
	},
	getIndexByValue:function(o,value){
		var index = -1;
		for (var i = 0; i < o.length; i++){
			if (o[i] == value){
				index = i;
				break;
			}
		}
		return index;
	},
	remove:function(o,dx){
		try{
		if(isNaN(dx)||dx>o.length){return false;}
			o.splice(dx,1);
		}catch(e){alert(e.message)}

	},
	getObjectIndexById:function(o,obj){
		var index = -1;
		if(typeof(obj)!="object"){
			return index;
		}
		for (var i = 0; i < o.length; i++){
			if (o[i].id == obj.id){
				index = i;
				break;
			}
		}
		return index;
	}
}
//数组去重
Array.prototype._arrUniq = function(){
	return _$arr.uniq(this);
}
//删除指定索引元素.
Array.prototype._arrRemove = function(dx){
	return _$arr.remove(this,dx);
}
//在数组中获取指定值的元素索引
Array.prototype.getIndexByValue = function(value){
    return _$arr.getIndexByValue(this,value);
}
//在数组中获取指定值的元素索引
Array.prototype.getObjectIndexById = function(obj){
	return _$arr.getObjectIndexById(this,obj);
}


//账户查询弹出层
var $searPopup = {}
$searPopup.createPopFont = function(obj1,obj,searUrl,condUrl,isAdv,isFont,w,h,isForm,handle){

	if(!isAdv) isAdv = false;
	if(!isForm) isForm = false;
	var buttonId = "noButton";
	if(isForm){
		buttonId = "popupDivButon";
	}
	var advHTML="";
	if(isAdv){
		advHTML = "<div class=\"searchAdvanced\"><a href=\"javascript:void(0)\" onclick=\"$searPopup.searchAdvanced('"+condUrl+"','"+obj1+"')\">高级查询</a>&nbsp;&nbsp;</div>"
	}
	var layerDiv = "";
	if(isAdv){
		layerDiv = "<div id=\"searchUserId\" class=\"searchUsBox\" onmouseover=\"$searPopup.showPop();\">"
			+"<div class=\"searchTop\">"
				+"<div class=\"searchTit\">&nbsp;<strong>数据查询</strong></div>"
				+"<div class=\"searchAdvanced\"><a href=\"javascript:void(0)\" onclick=\"$searPopup.hidePop();\">关闭</a></div>"
			+"</div>"
			+"<div class=\"searchCont\"><iframe id=\"searchIframe\" width='100%' height='100%' border='0' frameborder='0' src='" + searUrl + "'></iframe></div>"
			+"<div class=\"searchBotm\">"
			+"<div class=\"searchTit\">&nbsp;&nbsp;&nbsp;<a onmouseover=this.style.color='#FF0000' onmouseout=this.style.color='#000000' id=\""+buttonId+"\" class=\"editBut1\" ><span>&nbsp;&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;&nbsp;</span></a></div>"+advHTML+"</div>"
		+"</div><form action=\""+$searPopup.getRootPath+"/accountController!findAccountListPage.action\" method=\"post\" name=\"myDataForm\" id=\"myDataForm\"><input type=\"hidden\" name=\"actUrl\" id=\"actUrl\"/></form>";
	}else if(isFont){
		layerDiv = "<div id=\"searchUserId\" class=\"searchUsBox\" onmouseover=\"$searPopup.showPop();\">"
			+"<div class=\"searchTop\">"
			+"</div>"
			+"<div class=\"searchCont\"><iframe id=\"searchIframe\" width='100%' height='100%' border='0' frameborder='0' src='" + searUrl + "'></iframe></div>"
			+"<div class=\"searchBotm\">"
		+"</div>";
	}else{
		layerDiv = "<div id=\"searchUserId\" class=\"searchUsBox\" onmouseover=\"$searPopup.showPop();\">"
			+"<div class=\"searchTop\">"
				+"<div class=\"searchTit\">&nbsp;<strong>数据查询</strong></div>"
				+"<div class=\"searchAdvanced\"><a href=\"javascript:void(0)\" onclick=\"$searPopup.hidePop();\">关闭</a></div>"
			+"</div>"
			+"<div class=\"searchCont\"><iframe id=\"searchIframe\" width='100%' height='100%' border='0' frameborder='0' src='" + searUrl + "'></iframe></div>"
			+"<div class=\"searchBotm\">"
			+"<a onmouseover=this.style.color='#FF0000' onmouseout=this.style.color='#000000' id=\""+buttonId+"\" class=\"editBut1\" ><span>&nbsp;&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;&nbsp;</span></a>"+advHTML+"</div>"
		+"</div><form action=\""+$searPopup.getRootPath+"/accountController!findAccountListPage.action\" method=\"post\" name=\"myDataForm\" id=\"myDataForm\"><input type=\"hidden\" name=\"actUrl\" id=\"actUrl\"/></form>";
	}

	var obj_h,obj_t,obj_l,popObj,setLet,searchUserWd,searchUserHt;
		$searPopup.menuObj=popObj = $(obj);
		//alert(w)

  obj_h = popObj.height();
		obj_w = popObj.width();
		obj_t = popObj.offset().top;
		obj_l = popObj.offset().left;

	if($("#searchUserId").html()==null){
		$("body").append(layerDiv);
		/*searchUserWd = !w?$("#searchUserId").width():w;
		(obj_l-(searchUserWd-obj_w)/2>0)?setLet = obj_l-(searchUserWd-obj_w)/2:setLet = obj_l;
		if((getClient_wh()[0]-obj_l+obj_w)-searchUserWd<0&&obj_l-searchUserWd<0){
			setLet = (getClient_wh()[0] - searchUserWd)/2;
		}
		$("#searchUserId").css("left",setLet).css("top",obj_h+5);*/
	}else{
		$searPopup.showPop();
	}
	/*---设置弹出查询窗体显示位置_start---*/
	searchUserWd = !w?$("#searchUserId").width():w;
	(obj_l-(searchUserWd-obj_w)/2>0)?setLet = obj_l-(searchUserWd-obj_w)/2:setLet = obj_l;
	if((getClient_wh()[0]-obj_l+obj_w)-searchUserWd<0&&obj_l-searchUserWd<0){
		setLet = (getClient_wh()[0] - searchUserWd)/2;
	}
	$("#searchUserId").css("left",setLet).css("top",obj_h+5);
	/*---设置弹出查询窗体显示位置_end---*/
	$("#searchUserId").css("width",searchUserWd);
	//alert(h)
	if(!h){}else{$(".searchCont").css("height",h)};

	$("#searchUserId").click(function(e){
		e.stopPropagation();
	})
	$(document).click(function(e){
		$searPopup.hidePop();
	})
	$("#popupDivButon").unbind("click");
	$("#popupDivButon").click(function(){
		if(isAdv){//账户查询
			if(typeof(handle)=="function"){
				var PageForm =$("#searchUserId").find("#searchIframe").contents().find("#cxform");
				//handle(PageForm);
				//var oSettings = tbl.fnSettings();
				//oSettings.sAjaxSource =PageForm.attr("action")+"?"+$(PageForm).serialize();
				//tbl.fnClearTable(0);
				//tbl.fnDraw();
				$searPopup.hidePop();
				var dataInfo =($(PageForm).serialize()).replace(/=/g,"*").replace(/&/g,"@");
				$("#actUrl").val(dataInfo);
				$("#myDataForm").submit();

				//handle(dataInfo+"");
				//location.href=$searPopup.getRootPath+'accountController!findAccountListPage.action?errorInfo=0&dataInfo='+dataInfo;
			}else{
				var PageForm =$("#searchUserId").find("#searchIframe").contents().find("#cxform");
				var oSettings = tbl.fnSettings();
				oSettings.sAjaxSource = $searPopup.getRootPath+"/accountInfoController!findAccountListData.action";
				oSettings.sAjaxSource =PageForm.attr("action")+"?"+$(PageForm).serialize();
				tbl.fnClearTable(0);
				tbl.fnDraw();
				$searPopup.hidePop();

			}

		}else{

			if(typeof(handle)=="function"){
				handle();
			}
			$searPopup.hidePop();
    }
	})
}
$searPopup.createPop = function(obj1,obj,searUrl,condUrl,isAdv,w,h,isForm,handle){

	if(!isAdv) isAdv = false;
	if(!isForm) isForm = false;
	var buttonId = "noButton";
	if(isForm){
		buttonId = "popupDivButon";
	}
	var advHTML="";
	if(isAdv){
		advHTML = "<div class=\"searchAdvanced\"><a href=\"javascript:void(0)\" onclick=\"$searPopup.searchAdvanced('"+condUrl+"','"+obj1+"')\">高级查询</a>&nbsp;&nbsp;</div>"
	}
	var layerDiv = "";
	if(isAdv){
		layerDiv = "<div id=\"searchUserId\" class=\"searchUsBox\" onmouseover=\"$searPopup.showPop();\">"
			+"<div class=\"searchTop\">"
				+"<div class=\"searchTit\">&nbsp;<strong>数据查询</strong></div>"
				+"<div class=\"searchAdvanced\"><a href=\"javascript:void(0)\" onclick=\"$searPopup.hidePop();\">关闭</a></div>"
			+"</div>"
			+"<div class=\"searchCont\"><iframe id=\"searchIframe\" width='100%' height='100%' border='0' frameborder='0' src='" + searUrl + "'></iframe></div>"
			+"<div class=\"searchBotm\">"
			+"<div class=\"searchTit\">&nbsp;&nbsp;&nbsp;<a onmouseover=this.style.color='#FF0000' onmouseout=this.style.color='#000000' id=\""+buttonId+"\" class=\"editBut1\" ><span>&nbsp;&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;&nbsp;</span></a>"
      + "&nbsp;&nbsp;&nbsp;<a onmouseover=this.style.color='#FF0000' onmouseout=this.style.color='#000000' id='resetButton' class=\"editBut1\" ><span>&nbsp;&nbsp;&nbsp;重&nbsp;&nbsp;置&nbsp;&nbsp;&nbsp;</span></a>"
			+"</div>"+advHTML+"</div>"
		+"</div><form action=\""+$searPopup.getRootPath+"/accountController!findAccountListPage.action\" method=\"post\" name=\"myDataForm\" id=\"myDataForm\"><input type=\"hidden\" name=\"actUrl\" id=\"actUrl\"/></form>";
	}else{
		layerDiv = "<div id=\"searchUserId\" class=\"searchUsBox\" onmouseover=\"$searPopup.showPop();\">"
			+"<div class=\"searchTop\">"
				+"<div class=\"searchTit\">&nbsp;<strong>数据查询</strong></div>"
				+"<div class=\"searchAdvanced\"><a href=\"javascript:void(0)\" onclick=\"$searPopup.hidePop();\">关闭</a></div>"
			+"</div>"
			+"<div class=\"searchCont\"><iframe id=\"searchIframe\" width='100%' height='100%' border='0' frameborder='0' src='" + searUrl + "'></iframe></div>"
			+"<div class=\"searchBotm\">"
			+"<a onmouseover=this.style.color='#FF0000' onmouseout=this.style.color='#000000' id=\""+buttonId+"\" class=\"editBut1\" ><span>&nbsp;&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;&nbsp;</span></a>"
			+"&nbsp;&nbsp;&nbsp;<a onmouseover=this.style.color='#FF0000' onmouseout=this.style.color='#000000' id='resetButton' class=\"editBut1\" ><span>&nbsp;&nbsp;&nbsp;重&nbsp;&nbsp;置&nbsp;&nbsp;&nbsp;</span></a>"
			+advHTML+"</div>"
		+"</div><form action=\""+$searPopup.getRootPath+"/accountController!findAccountListPage.action\" method=\"post\" name=\"myDataForm\" id=\"myDataForm\"><input type=\"hidden\" name=\"actUrl\" id=\"actUrl\"/></form>";
	}

	var obj_h,obj_t,obj_l,popObj,setLet,searchUserWd,searchUserHt;
		$searPopup.menuObj=popObj = $(obj);
		//alert(w)

  obj_h = popObj.height();
		obj_w = popObj.width();
		obj_t = popObj.offset().top;
		obj_l = popObj.offset().left;

	if($("#searchUserId").html()==null){
		$("body").append(layerDiv);
		searchUserWd = !w?$("#searchUserId").width():w;
		(obj_l-(searchUserWd-obj_w)/2>0)?setLet = obj_l-(searchUserWd-obj_w)/2:setLet = obj_l;
		if((getClient_wh()[0]-obj_l+obj_w)-searchUserWd<0&&obj_l-searchUserWd<0){
			setLet = (getClient_wh()[0] - searchUserWd)/2;
			if((getClient_wh()[0]-setLet)<searchUserWd){
				setLet += searchUserWd-(getClient_wh()[0] - setLet);
			}
		}
		$("#searchUserId").css("left",setLet).css("top",obj_h+5);
	}else{
		searchUserWd = !w?$("#searchUserId").width():w;
		var setLet = (getClient_wh()[0] - searchUserWd)/2;
		if((getClient_wh()[0]-setLet)<searchUserWd){
			setLet += searchUserWd-(getClient_wh()[0] - setLet);
			$("#searchUserId").css("left",setLet);
		}else{
			(obj_l-(searchUserWd-obj_w)/2>0)?setLet = obj_l-(searchUserWd-obj_w)/2:setLet = obj_l;
			if((getClient_wh()[0]-obj_l+obj_w)-searchUserWd<0&&obj_l-searchUserWd<0){
				setLet = (getClient_wh()[0] - searchUserWd)/2;
			}
			$("#searchUserId").css("left",setLet);
		}

		$searPopup.showPop();
	}
	$("#searchUserId").css("width",searchUserWd);
	//alert(h)
	if(!h){}else{$(".searchCont").css("height",h)};

	$("#searchUserId").click(function(e){
		e.stopPropagation();
	})
	$(document).click(function(e){
		$searPopup.hidePop();
	})
	$("#popupDivButon").unbind("click");
	$("#popupDivButon").click(function(){
		if(isAdv){//账户查询
			if(typeof(handle)=="function"){
				var PageForm =$("#searchUserId").find("#searchIframe").contents().find("#cxform");
				//handle(PageForm);
				//var oSettings = tbl.fnSettings();
				//oSettings.sAjaxSource =PageForm.attr("action")+"?"+$(PageForm).serialize();
				//tbl.fnClearTable(0);
				//tbl.fnDraw();
				$searPopup.hidePop();
				var dataInfo =($(PageForm).serialize()).replace(/=/g,"*").replace(/&/g,"@");
				$("#actUrl").val(dataInfo);
				$("#myDataForm").submit();

				//handle(dataInfo+"");
				//location.href=$searPopup.getRootPath+'/accountController!findAccountListPage.action?errorInfo=0&dataInfo='+dataInfo;
			}else{
				var PageForm =$("#searchUserId").find("#searchIframe").contents().find("#cxform");
				var oSettings = tbl.fnSettings();
				//oSettings.sAjaxSource = $searPopup.getRootPath+"/accountInfoController!findAccountListData.action";
				oSettings.sAjaxSource =PageForm.attr("action")+"?"+decodeURIComponent($(PageForm).serialize(),true);
				tbl.fnClearTable(0);
				tbl.fnDraw();
				$searPopup.hidePop();

			}

		}else{
			if(typeof(handle)=="function"){
				handle();
				$searPopup.hidePop();
			}

    }
	})
	$("#resetButton").unbind("click");
	$("#resetButton").click(function(){
		//if(isAdv){//账户查询
			PageForm =$("#searchUserId").find("#searchIframe").contents().find("#cxform");
    $(':input', PageForm)
      .not(':button, :submit, :reset, :hidden')
      .val('')
      .removeAttr('checked')
      .removeAttr('selected');
		//}
	})
}
$searPopup.searchAdvanced = function(url,obj1){
	top.ymPrompt.win({message:url,width:600,height:570,title:'高级查询',handler:function(tp){
		if("ok"==tp){
			if(obj1){
				 var alertWin=top.ymPrompt.getPage().contentWindow; // 获取弹出层的window对象
        var PageForm = $(alertWin.document.body).find("#cxform");
				//handle(PageForm);
				//var oSettings = tbl.fnSettings();
				//oSettings.sAjaxSource =PageForm.attr("action")+"?"+$(PageForm).serialize();
				//tbl.fnClearTable(0);
				//tbl.fnDraw();
				$searPopup.hidePop();
				var dataInfo =($(PageForm).serialize()).replace(/=/g,"*").replace(/&/g,"@");
				$("#actUrl").val(dataInfo);
				$("#myDataForm").submit();
				 top.ymPrompt.close();
				//handle(dataInfo+"");
				//location.href=$searPopup.getRootPath+'/accountController!findAccountListPage.action?errorInfo=0&dataInfo='+dataInfo;
			}else{
				 var alertWin=top.ymPrompt.getPage().contentWindow; // 获取弹出层的window对象
        var PageForm = $(alertWin.document.body).find("#cxform");
				 var oSettings = tbl.fnSettings();

				  oSettings.sAjaxSource =PageForm.attr("action")+"?"+decodeURIComponent($(PageForm).serialize(),true);
			        tbl.fnClearTable(0);
			        tbl.fnDraw();
			        $searPopup.hidePop();
			        top.ymPrompt.close();

      }

    }else{
			top.ymPrompt.close();
	  }
	},iframe:true,autoClose:false});
	$searPopup.hidePop();
}



$searPopup.showPop = function(){
	$("#searchUserId").show();
	//$searPopup.menuObj.css("background-color","#a1d1fa");
}
$searPopup.hidePop = function(){
	$("#searchUserId").hide();
	//$searPopup.menuObj.css("background-color","");
}

$searPopup.getRootPath = function(){
  var pathName = window.location.pathname.substring(1);
  var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
  var rootPath = window.location.protocol + '//' + window.location.host /*+ '/'*/ + '';
  	 if(webName != ''){
       rootPath = rootPath + '/' + webName;
  	 }
  	 return rootPath;
}

/*ymPrompt弹出层数据提交回调函数*/
$ymExtend = {}
//ym弹出窗体的最大值
function ymWinMaxMinValue(){
var _w=1000,_h=540;
	screen.width>1024?_w+=(screen.width-1024)/2:_w=_w;
	screen.height>768?_h+=(screen.height-768)/2:_h=_h;
	$ymExtend._w = _w;
	$ymExtend._h = _h;
}
ymWinMaxMinValue();
$ymExtend.subData = function(obj){
	if(!obj) obj = top;
	obj.ymPrompt.doHandler("ok");//参数说明:ok提交数据，undefined如果为undefined回调函数自动关闭否则将调用回调函数内部的自定义关闭方法。
}
/*设置新建页面背景色*/
function setNewPageBg(){
	if($(".DivScrollH408").html()!=null && $(".newWrapper").html()!=null){
		var setH = $(".newWrapper").find("table:first").height();
		if(setH>$(".DivScrollH408").height()){
			$(".leftFieldBg").css("height",setH);
		}
	}
}
$(function(){
	setNewPageBg();
})
//判断当前浏览器是否存在盒模型
function isExistBoxModel(){
	var isBoxModel = jQuery.support.boxModel;
  return isBoxModel; // 如果这个页面和浏览器是以W3C CSS盒式模型来渲染的，则等于true。通常在IE 6和IE 7的怪癖模式中这个值是false。在document准备就绪前，这个值是null。
}

function openwindow(url, name, iWidth, iHeight) {
	var url;  	//转向网页的地址;
	var name;   	//网页名称，可为空;
	var iWidth; 	//弹出窗口的宽度;
	var iHeight; 	//弹出窗口的高度;
	var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
	var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
	window.open(url, name, "height=" + iHeight + ",,innerHeight=" + iHeight + ",width=" + iWidth + ",innerWidth=" + iWidth + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no,menubar=no,scrollbars=yes,resizeable=no,location=no,status=no");
}

$("a").bind("keypress",function(e){
	var code;
	if(!e){var e=window.event;}
	if(e.keyCode){code=e.keyCode;}else if(e.which){code = e.which;}
	if(code == 13){
		return false;
	}
})
var $fckobj = {}
//显示FCK
function publicShowFCK(LabelsName,path,height,width){
  var oFCKeditor = new FCKeditor(LabelsName);
  $fckobj.inputId = LabelsName;
  oFCKeditor.BasePath = path + '/FCKeditor/';
	oFCKeditor.ToolbarSet = 'public' ;
	if(height=="" || typeof(height)=="undefined"){
    oFCKeditor.Width = "96%";
	}else{
    oFCKeditor.Width = width;
  }
	if(height=="" || typeof(height)=="undefined"){
		oFCKeditor.Height = 251 ;
	}else{
    oFCKeditor.Height = height;
	}
	oFCKeditor.ImageBrowser = true;
  oFCKeditor.ImageBrowserURL = $searPopup.getRootPath + '/FCKeditor/editor/filemanager/browser/default/browser.html?Type=Image&Connector=connectors/jsp/connector';
  oFCKeditor.LinkBrowserURL = $searPopup.getRootPath + '/FCKeditor/editor/filemanager/browser/default/browser.html?Connector=connectors/jsp/connector';
  oFCKeditor.FlashBrowserURL = $searPopup.getRootPath + '/FCKeditor/editor/filemanager/browser/default/browser.html?Type=Flash&Connector=connectors/jsp/connector';
  oFCKeditor.ImageUploadURL = $searPopup.getRootPath + '/FCKeditor/editor/filemanager/upload/simpleuploader?Type=Image';
  oFCKeditor.LinkUploadURL = $searPopup.getRootPath + '/FCKeditor/editor/filemanager/upload/simpleuploader?Type=File';
  oFCKeditor.FlashUploadURL = $searPopup.getRootPath + '/FCKeditor/editor/filemanager/upload/simpleuploader?Type=Flash';
	oFCKeditor.ReplaceTextarea();
}
// 设置FCK里的值
$fckobj.htmlStr="",interTimer=0;
function publicSetFCKVal(htmlStr) {
	$fckobj.htmlStr = htmlStr;
	if(publicFCKIsExit() == null){
		interTimer = setTimeout("setFCKValFun()",10);
	}else{
    clearTimeout(interTimer);
		var oEditor = FCKeditorAPI.GetInstance($fckobj.inputId);
		oEditor.InsertHtml($fckobj.htmlStr);
	}
}
function setFCKValFun(){
	publicSetFCKVal($fckobj.htmlStr);
}
//获取FCK里的值
function publicFCKValue(){
		var oEditor = FCKeditorAPI.GetInstance($fckobj.inputId);
	    var inpuVal=oEditor.GetXHTML();
	   	$("#"+$fckobj.inputId).text(inpuVal);
	   	return inpuVal;
}
//置空FCK里的值
function publicFCKNull(){
		if(publicFCKValue()=="<br />"||publicFCKValue()==""){return "";}else{return publicFCKValue();};
}
//判断FCKAPI是否存在
function publicFCKIsExit(){
	 try {
		 var isExit= FCKeditorAPI.GetInstance($fckobj.inputId);
		 return isExit.EditorDocument.body;
	} catch (e) {
		return null;
	}
}

//导航上按钮过多处理 menuTotal_w 所占距离宽度 leftValue 按钮距离左侧边的距离
$moreMenu = {menuTotal_w:0,leftValue:0};
//初始化函数
$moreMenu.init = function(obj,tag){
	if(typeof(tag)=="undefined") var tag = "a";
	$moreMenu.isContObj = obj.find(tag).length>0?true:false;
	if(!$moreMenu.isContObj) return;
	if($moreMenu.menuTotal_w==0){
		obj.find(tag).each(function(){
      $moreMenu.menuTotal_w += $(this).outerWidth(true) + 10;
		})
	}
	if($moreMenu.leftValue==0){
		$moreMenu.leftValue = obj.css("padding-left");
	}
	obj.css("padding-left",0);
  var _w = obj.width();
  var isCalculate = $moreMenu.menuTotal_w > _w ? true : false;
	var html = obj.find(".v_content_list").html();
		if(html!=null){
			obj.html(html);
    }
	if(!isCalculate){
		obj.css("padding-left",$moreMenu.leftValue);
	}else{
		$moreMenu.createSrollMold(obj,_w);
	}
}
//创建滚动的模板
$moreMenu.createSrollMold = function(obj,_w){
	var menuHtml = obj.html();
	var srollMenu_w = 21;
	var congt_w = _w-srollMenu_w*2-2;
	var str = !obj.attr("id")?obj.attr("class"):obj.attr("id");
	var lHtml = "<div id=\"leftScrollLink"+str+"\" class=\"leftScrollLink\" style=\"float:left;\"></div>";
	var cHtml = "<div class=\"v_show\" style=\"width:"+congt_w+"px;float:left;\"><div class=\"v_content\" style=\"width:"+congt_w+"px\"><div id=\"v_content_list"+str+"\" class=\"v_content_list\"><label>"+menuHtml+"</label></div></div></div>";
	var rHtml = "<div id=\"rightScrollLink"+str+"\" class=\"rightScrollLink\" style=\"float:right;\"></div>";
	obj.css("padding",0).html(lHtml+cHtml+rHtml);
	$moreMenu.bindEvent(obj,$("#leftScrollLink"+str),$("#rightScrollLink"+str),$("#v_content_list"+str));
}
//绑定滚动事件、实现滚动功能
$moreMenu.bindEvent = function(obj,lObj,rObj,menuContObj){
	var $v_show = obj.find(".v_content_list");
	var v_width = 100;
	var page = 1;
	var obj_w = obj.width();
	var n = Math.ceil($moreMenu.menuTotal_w /obj_w);
	var page_count = n>1?n:1;
	rObj.bind("click",function(){
		if(( $moreMenu.menuTotal_w - obj.width() - parseInt($v_show.css("left")) ) > obj.width()){
			v_width = obj.width();
		}else{
			v_width = $moreMenu.menuTotal_w - obj.width();
		}
		if( !$v_show.is(":animated") ){    //判断“按钮区域”是否正在处于动画
			  if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
					$v_show.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面
					page = 1;
			   }else{
					$v_show.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面
					page++;
			   }
		 }
	})
	lObj.bind("click",function(){
		if(( $moreMenu.menuTotal_w - obj.width() - parseInt($v_show.css("left")) ) > obj.width()){
			v_width = obj.width();
		}else{
			v_width = $moreMenu.menuTotal_w - obj.width();
		}
		if( !$v_show.is(":animated") ){    //判断“按钮区域”是否正在处于动画
		 	 if( page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
				$v_show.animate({ left : '-='+($moreMenu.menuTotal_w - obj.width())}, "slow");
				page = page_count;
			}else{
				$v_show.animate({ left : '+='+v_width }, "slow");
				page--;
			}
		}
	})
	lObj.hover(
		function(){
			$(this).attr("class","leftScrollOver");
		},
		function(){
			$(this).attr("class","leftScrollLink");
		}
	)
	rObj.hover(
		function(){
			$(this).attr("class","rightScrollOver");
		},
		function(){
			$(this).attr("class","rightScrollLink");
		}
	)
}

/**
 *删除附件
 */
function deleteuploadfile(upLoadTypeId,allfilenames,newfileName,id,flag,isMoreUploadBegin,isMoreUploadEnd){
	var customBegin="",customEnd = "";
	if(isMoreUploadBegin){
	 	customBegin = isMoreUploadBegin;
	}
	if(isMoreUploadEnd){
		customEnd = isMoreUploadEnd;
	}
	var olduploadname=document.getElementById(customBegin+"fileName"+customEnd).value;
	var olduploadurl=document.getElementById(customBegin+"fileUrl"+customEnd).value;
	var olduploadsize=document.getElementById(customBegin+"fileSize"+customEnd).value;
	var customPath="";
	if(document.getElementById(customBegin+"customPath"+customEnd)!=null){
		customPath=document.getElementById(customBegin+"customPath"+customEnd).value;
	}

  var olduploadnamearray=olduploadname.split("@#@");
	var olduploadurlarray=olduploadurl.split("@#@");
	var olduploadsizearray=olduploadsize.split("@#@");
	var uploadnametemp="";
	var uploadurltemp="";
	var uploadsizetemp="";
	for(var i=0;i<olduploadurlarray.length-1;i++){
		if(olduploadurlarray[i]==newfileName){
      continue;
		}
		uploadnametemp+=olduploadnamearray[i]+"@#@";
		uploadurltemp+=olduploadurlarray[i]+"@#@";
		uploadsizetemp+=olduploadsizearray[i]+"@#@";
	}
	document.getElementById(customBegin+"fileName"+customEnd).value=uploadnametemp;
	document.getElementById(customBegin+"fileUrl"+customEnd).value=uploadurltemp;
	document.getElementById(customBegin+"fileSize"+customEnd).value=uploadsizetemp;
  document.getElementById(allfilenames).removeChild(document.getElementById(newfileName));
	//调用方法删除附件
	var url = $searPopup.getRootPath+"/common/fileControl!delete.action";
	var pars = {newFileName:newfileName,customPath:customPath};
	jQuery.ajax({
		url : url,
		type : "POST",
		data : pars,
		beforeSend : function() {
			// 这个改成对dialog弹出窗口的确定按钮disable
		},
		error : function(responseResult) {
			// 这个改成对dialog弹出窗口的确定按钮enable
		},
		success : function(responseResult) {
		}
	});
}
function subStrLength(str,index){
	if(index<20){
		//index = 20;
	}
	var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128){
			realLength += 1;
		}else{
			realLength += 2;
		}
    }
	if(str!=""&&str!=null&&realLength>index){
		str = str.substring(0,index)+"...";
	}
	return str;
}
function showKeyPress(evt) {
 evt = (evt) ? evt : window.event;
 var obj = evt.srcElement || evt.target;
 var keycode = evt.keyCode;//获取按键值
 if(keycode!=37&&keycode!=38&&keycode!=39&&keycode!=40){//如果是方向键则不执行
	 if(obj.tagName.toLocaleUpperCase()!="INPUT"&&obj.tagName.toLocaleUpperCase()!="TEXTAREA") return;
	 return checkSpecificKey(obj,obj.value);
 }

}

function checkSpecificKey(obj,keyCode) {
  var specialKey = "#$%\^*\'\"\+\\\/\?";//Specific Key list
    //var flg = false;
	var arr=[];
	for(var i=0;i<keyCode.length;i++){
		if(specialKey.indexOf(keyCode.substring(i,i+1)) < 0){
			arr.push(keyCode.substring(i,i+1));
		}
	}
	if(keyCode!=arr.join("")){
		obj.value = arr.join("");
	}
	/*var keyCode2 = arr[arr.length-1];
    flg = (specialKey.indexOf(keyCode2) >= 0);
    if (flg) {
		obj.value = obj.value.substring(0,obj.value.toString().length-1);
        return false;
    }
    return true;*/
}
//绑定input输入函数，放置输入特殊字符；
/*document.onkeyup  = showKeyPress;*/
//document.onkeypress  = showKeyPress;

/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
        	//alert(("00" + o[k]).substr(("" + o[k]).length)+"##########"+o['Y+'])
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//表单重复提交相关
_wzk_firstSubmit = 0;//重复提交标识参数
function isFirstSubmit(){//是否第一次提交
	if(_wzk_firstSubmit != 0){
		_wzk_firstSubmit +=1;
        return false;
    }else{
    	_wzk_firstSubmit=1;
    	return true;
    }
}
function resetFirstSubmit(){//重置标识参数
	_wzk_firstSubmit=0;
}

$(function(){
	/*! 底部公用 - v1.1.2 - 2015-04-07*/
	var clientWd = document.body.clientWidth;
	var gdWidth = 1200;
  if (clientWd < gdWidth) {
			var w = (clientWd-14);
			$("#home-menu-wrapper,#ambuf-prd-ml-id").css("width",w);
		}
	//显示二级菜单目录
	$("#prdAndServeicsId").click(function(e){
		e.stopPropagation();
		$(".ambuf-prd-ml").show();
		$(".ambuf-prd-maker").show();
	})
	$(".ambuf-prd-ml").hover(
		function(){
			$(this).show();
			$(".ambuf-prd-maker").show();
		}
	).click(function(e){
		e.stopPropagation();
	})
	$(window).click(function(){
		$(".ambuf-prd-ml").hide();
		$(".ambuf-prd-maker").hide();
	})
})
