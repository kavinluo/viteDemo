/* Modified from https://github.com/taylorhakes/fecha
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Taylor Hakes
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 *     The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 *     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// 引入--访问前缀--组件
import globlURLPrefix from "../../../src/components/common/globlURLPrefix";
/*eslint-disable*/
// 把 YYYY-MM-DD 改成了 yyyy-MM-dd
var dateUtil ;
(function (main) {
  'use strict';

  /**
   * Parse or format dates
   * @class fecha
   */
  var fecha = {};
  var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  var twoDigits = /\d\d?/;
  var threeDigits = /\d{3}/;
  var fourDigits = /\d{4}/;
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var noop = function () {
  };

  function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  }

  function monthUpdate(arrName) {
    return function (d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
      if (~index) {
        d.month = index;
      }
    };
  }

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3);
  var dayNamesShort = shorten(dayNames, 3);
  fecha.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
  };

  var formatFlags = {
    D: function(dateObj) {
      return dateObj.getDay();
    },
    DD: function(dateObj) {
      return pad(dateObj.getDay());
    },
    Do: function(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate());
    },
    d: function(dateObj) {
      return dateObj.getDate();
    },
    dd: function(dateObj) {
      return pad(dateObj.getDate());
    },
    ddd: function(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
      return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
      return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()];
    },
    yy: function(dateObj) {
      return String(dateObj.getFullYear()).substr(2);
    },
    yyyy: function(dateObj) {
      return dateObj.getFullYear();
    },
    h: function(dateObj) {
      return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
      return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
      return dateObj.getHours();
    },
    HH: function(dateObj) {
      return pad(dateObj.getHours());
    },
    m: function(dateObj) {
      return dateObj.getMinutes();
    },
    mm: function(dateObj) {
      return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
      return dateObj.getSeconds();
    },
    ss: function(dateObj) {
      return pad(dateObj.getSeconds());
    },
    S: function(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function(dateObj) {
      return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
  };

  var parseFlags = {
    d: [twoDigits, function (d, v) {
      d.day = v;
    }],
    M: [twoDigits, function (d, v) {
      d.month = v - 1;
    }],
    yy: [twoDigits, function (d, v) {
      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
      d.second = v;
    }],
    yyyy: [fourDigits, function (d, v) {
      d.year = v;
    }],
    S: [/\d/, function (d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function (d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function (d, v) {
      d.millisecond = v;
    }],
    D: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.DD = parseFlags.D;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.Do = parseFlags.dd = parseFlags.d;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;


  // Some common format strings
  fecha.masks = {
    'default': 'ddd MMM dd yyyy HH:mm:ss',
    shortDate: 'M/D/yy',
    mediumDate: 'MMM d, yyyy',
    longDate: 'MMMM d, yyyy',
    fullDate: 'dddd, MMMM d, yyyy',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };

  /***
   * Format a date
   * @method format
   * @param {Date|number} dateObj
   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
   */
  fecha.format = function (dateObj, mask, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }

    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      throw new Error('Invalid Date in fecha.format');
    }

    mask = fecha.masks[mask] || mask || fecha.masks['default'];

    return mask.replace(token, function ($0) {
      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
  };

  /**
   * Parse a date string into an object, changes - into /
   * @method parse
   * @param {string} dateStr Date string
   * @param {string} format Date parse format
   * @returns {Date|boolean}
   */
  fecha.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof format !== 'string') {
      throw new Error('Invalid format in fecha.parse');
    }

    format = fecha.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
      return false;
    }

    var isValid = true;
    var dateInfo = {};
    format.replace(token, function ($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0];
        var index = dateStr.search(info[0]);
        if (!~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function (result) {
            info[1](dateInfo, result, i18n);
            dateStr = dateStr.substr(index + result.length);
            return result;
          });
        }
      }

      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
      return false;
    }

    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }

    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fecha;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return fecha;
    });
  } else {
    main.fecha = fecha;
  }
  dateUtil = fecha
})(this);


var toDate = function (date) {
  return isDate(date) ? new Date(date) : null;
};

var isDate = function (date) {
  if (date === null || date === undefined) return false;
  if (isNaN(new Date(date).getTime())) return false;
  return true;
};

var formatDate = function (date, format) {
  date = toDate(date);
  if (!date) return '';
  return dateUtil.format(date, format || 'yyyy-MM-dd');
};

var parseDate = function (string, format) {
  return dateUtil.parse(string, format || 'yyyy-MM-dd');
};


/*
    * 将字符串时间转换为时间戳
    * @param date  {String}  例如:201-08-01
    * */
var parseTimestamp = function(date){
  var timestamp;
  if(navigator.userAgent.indexOf("Firefox")>0){  //解决火狐兼容性问题
    date &&(date =date+'T09:00:00');
    timestamp = date ? Date.parse(date) : new Date().getTime();
  }else {
    timestamp = date ? new Date(date).getTime() : new Date().getTime();
  }
  return timestamp;
};



/*
        * 对表单数据的时间进行转换
        * @params  data    obj|array  需要转换的数据源
        * @parans fn        fun||string  操作的方法或字符串模板，yyyy-mm
        * @parans targer   array  需要操作的对象的名
        * */
var formDate = function(data, targer, fn) {
  var length = targer.length;
  var isObject = this.valDataType(data, "Object");
  if (isObject) {
    for (var i = 0; i < length; i++) {
      if(typeof fn =='string'){
        data[targer[i]] = formatDate(data[targer[i]],fn)
      }else {
        fn = fn || yearMonthData || function () {};
        data[targer[i]] = fn(data[targer[i]]);
      }
    }
    return data
  }
  data.forEach(data, function (value) {
    for (var i = 0; i < length; i++) {
      if(typeof fn =='string'){
        value[targer[i]] =formatDate(value[targer[i]],fn)
      }else {
        fn = fn || yearMonthData || function () {};
        value[targer[i]] = fn(value[targer[i]]);
      }
    }
  })
  return data
};


//从获取的Res中挑选出需要的名值对
var getFormValidate = function (data,res){
  var length = arguments.length;
  var arr = Array.prototype.slice.call(arguments,2);

  if(length<2) return data
  var obj={}
  data.forEach(data,function (val,key) {
    obj[key] = res[key];
  })

  if(length>=3)obj = this.getFormValidate.apply(this,[].concat(obj,arr));
  return obj

};

/*
 * 对表单数据的时间进行转换
 * @parans date   string|obj  操作的方法
 * @return 199-02-12格式的时间
 * */
var yearMonthData = function(date) {
  if (typeof date !='object') return date;

  var datetime = new Date(date);
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1;
  var D = date.getDate() + '';
  if (month < 10) {
    month = "0" + month;
  }
  if (D < 10) {
    D = "0" + D;
  }
  return year + '-' + month + '-' + D;
};

/*
  * 判断数据类型
  * @param obj  {}||[]  各种数据类型
  * @param type string  例如: Object String Array等数据类型
  * @return flag boolean 是否为要验证的数据类型
  * */
var valDataType = function (obj, type) {
  var flag = false;
  switch (type) {
    case "String":
      obj.constructor == String ? flag = true : flag = false;
      break;
    case "Array":
      obj.constructor == Array ? flag = true : flag = false;
      break;
    case "Boolean":
      obj.constructor == Boolean ? flag = true : flag = false;
      break;
    case "Date":
      obj.constructor == Date ? flag = true : flag = false;
      break;
    case "Object":
      obj.constructor == Object ? flag = true : flag = false;
      break;
    default:
      alert(type + ":不支持的数据类型验证");
      break;
  }
  return flag;
};

//格式化时间
function formatDate(date,fmt) {
  if(!valDataType(date,"Date")&&!isNaN(date)){
    date = new Date(date);
  }else{
    return "不是时间类型不能格式化!";
  }
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

/*var serializeParams  = function (params) {
  var obj = [];
  params.forEach( function (v, k) {
    v = !v ? '' : v;
    var val = k + "=" + v;
    obj.push(val);
  })
  return obj.join("&");
}*/




function getRootPath_web() {
  //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
  var curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
  var pathName = window.document.location.pathname;
  var pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8083
  var localhostPaht = curWwwPath.substring(0, pos);
  //获取带"/"的项目名，如：/uimcardprj
  var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
  return (localhostPaht + projectName);
}

//JS操作cookies方法!

//写cookies

function setCookie(name,value)
{
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+';path=/';
}

//读取cookies
function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

//删除cookies
function delCookie(name)
{
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString()+';path=/';
}


function handleAjaxError(status, mess) {
  var flag = false;
  switch (status) {
    case "1":
      flag = true;
      alert(mess+"!");
      break;
    case "2":
      flag = true;
      alert(mess+"!");
      break;
    case "17":
      flag = true;
      alert(mess+"!");
      break;
    case "19":
      flag = true;
      alert(mess+"!");
      break;
    case "38":
      flag = true;
      alert("所有时间段的课程类别必须全部设置!");
      break;
    case "4":
      //token验证失败
      flag = true;
      // if (util.isLegalToken()) {
      if(window.layer==null){
        alert("登录超时!")
      }else {
        layer.msg('登录超时');
      }
      // loginModal()
      // } else {
      //     alert("非法登录!")
      // }

      top.loginModal();
      //$vue.$store.commit('setIndexUrl',"");
      // $vue.$router.push('/login');
      break;
    case "404":
      flag = true;
      if(window.layer==null){
        alert("未找到页面!")
      }else {
        layer.msg('未找到页面');
      }
      break;
    case "500":
      flag = true;
      if(window.layer==null){
        alert("服务器异常!")
      }else {
        layer.msg('服务器异常');
      }
      break;
    case "504":
      flag = true;
      if(window.layer==null){
        alert("服务器网络异常(网关超时）!!")
      }else {
        layer.msg('服务器网络异常(网关超时）!');
      }
      break;
    default:
      if(mess!=""){
        flag = true;
        if(window.layer==null){
          alert(mess+"!")
        }else {
          layer.msg(mess+"!");
        }
      }
  }
  //jQuery('#loading').hideLoading();
  return flag;
}



function getId() {
  var curWwwPath = window.document.location.href;
  return curWwwPath.split('#')
}
var ids = getId();
var baseUrl = '/api' ;
var api = {
  workshopsList:{  //工作坊列表
    path: baseUrl + globlURLPrefix.cstc + "/workshops/list",
    method:"get"
  },
  workshopsOtherList:{  //其他工作坊列表  workshops/other/list/{workshopsId}
    path: baseUrl + globlURLPrefix.cstc + "/workshops/other/list/",
    method:"get"
  },
  workshopsRemove:{  // 工作坊删除接口（可批量删除） workshops/removes/{workshopsIds}
    path: baseUrl + globlURLPrefix.cstc + "/workshops/removes",
    method:"delete"
  },
  workshopsModify:{  // 工作坊修改接口  workshops/modify/{workshopsId}
    path: baseUrl + globlURLPrefix.cstc + "/workshops/modify/",
    method:"put"
  },
  workshopsAdd:{  // 工作坊添加接口  workshops/add
    path: baseUrl + globlURLPrefix.cstc + "/workshops/add",
    method:"post"
  },
  workshopsGet:{  // 工作坊详情接口  workshops/get/{workshopsId}
    path: baseUrl + globlURLPrefix.cstc +"/workshops/get/",
    method:"get"
  },
  getAllRoom:{
    path: baseUrl +globlURLPrefix.cstc + "/room/all/list",  //获取所有房间列表  room/all/list
    method: "get",
  },
  workshopsChatRoom:{  //工作坊聊天信息列表 workshopsChatRoom/messageList/{workshopsId}
    path: baseUrl + globlURLPrefix.cstc +"/workshopsChatRoom/messageList/",
    method: "get",
  },
  sendChatRoom:{  //工作坊聊天信息列表 workshopsChatRoom/sending/message/{workshopsId}
    path: baseUrl + globlURLPrefix.cstc + "/workshopsChatRoom/sending/message/",
    method: "post",
  },
  cameraUrl:{  //获取房间内容摄像机列表（包含工作坊直播地址）  video/room/cameraUrl/list/{id}
    path: baseUrl + globlURLPrefix.cstc + "/video/room/cameraUrl/list/",
    method: "post",
  },
  /**
   *
   * */
  getUserInfo:baseUrl +globlURLPrefix.passport + '/user/getUserInfo',///获取当前登录人的信息
  http:baseUrl +  '/envs',// 查询http
  login:baseUrl + globlURLPrefix.passport + '/login', //登录
  static:baseUrl + '/zuul' + globlURLPrefix.passport + '/file/upload/static' ,//静态资源上传
}

var page={
  curPage:1,
  pageSize:20,
}
/**
 * 获取一级栏目数据
 * */





//公用登录弹窗方法
function loginModal() {
  if(window.layer==null)return;
  delCookie('Token');
  delCookie('userName');
  // jQuery("#logonM").validationEngine(
  //     {   autoHidePrompt:true,
  //         autoHideDelay:3000
  //     }
  // );
  layer.open({
    title: false,
    area: ['400px', '280px'],
    btnAlign:'c',
    content: $('#loginModal').html()
    ,btn: ['登录']
    ,yes: function(index, layero){
      checkLogin(index)
      //如果设定了yes回调，需进行手工关闭
    }
    /*,btn2: function(index, layero){
        checkLogin(index,true)
        //按钮【按钮二】的回调
        return false //开启该代码可禁止点击该按钮关闭
    }*/
  });
  function checkLogin(index,to){
    if(!checForm()){
      return false;
    }
    var data={
      username: $('.layui-layer-content [name=userName]').val(),
      password:  $('.layui-layer-content  [name=password]').val()
    },url =api.login;
    $.post(url,data,function(res){
      var flag = handleAjaxError(res["status"]["code"], res["status"]["msg"]);
      if(!flag){
        var token = res.data;
        top.setCookie('Token', token);
        getEvn()//获取http 并保存
        layer.close(index);
        layer.msg('登录成功');
        getInfo(function (data) {
          if(to){
            location.href=getRootPath_web()+"/manage.html";
          }else {
            location.reload(false)
          }
          top.setCookie('userName',data.name);
        })//登录成功之后存用户名cookie

      }
    })
  }
  //表单验证
  function checForm(){
    return $("#logonM").validationEngine('validate');
  }

  function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht );
  }
}

var userInfo;

/**
 * 获取当前登录人的信息
 * @param {Function} fun 成功之后调用
 * @return {null}
 * */
function getInfo(fun) {
  //jQuery('#loading').showLoading();
  $.ajax(api.getUserInfo, {
    headers:{
      Token:getCookie('Token')
    },
    success :function (res) {
      var flag = handleAjaxError(res["status"]["code"], res["status"]["msg"]);
      if (!flag) {
        userInfo = res.data;
        if (fun) fun(res.data);
      }
      //jQuery('#loading').hideLoading();
    },
    error:function () {
      alert('获取数据失败');
     // jQuery('#loading').hideLoading();
    }
  })
}

var evn = {}
function getEvn() {
  $.get(api.http,function (res) {
    evn = res.data;
    top.setCookie('http', res.data.http);
  })
}
/*var http =getCookie('http');
if(http){
  evn = {http:http};
}else {
  getEvn()
}*/


