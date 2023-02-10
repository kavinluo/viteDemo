/*
 * @Author: kevin
 * @Date: 2022-02-21 13:45:02
 * @LastEditors: kavinluo
 * @LastEditTime: 2023-02-09 18:19:58
 * @Description: Do not edit
 */

import axios from "axios";
import { ElMessage } from "element-plus";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar custom style
import { getCookie, serializeParams, paramsStrSort } from "./util";
import router from "@/router";
import store from "@/store";
import config from "../config/config";
import _ from "lodash";

let ajaxconfig = config.ajaxconfig;
//添加一个请求拦截器
//  axios.interceptors.request.use(function (config) {
//   //在请求发送之前做一些事
//   return config;
// }, function (error) {
//   //当出现请求错误是做一些事
//   return Promise.reject(error);
// });

// import { computed } from 'vue'
// 创建 axios 实例
let service = axios.create(ajaxconfig);

const err = (e) => {
  const error = e.response;
  if (error) {
    const data = error.data;
    const msg = data.message;
    const token = null; // Vue.ls.get(ACCESS_TOKEN)
    const code = error.status;
    NProgress.done();
    switch (code) {
      case 403:
        ElMessage.error(msg + "！");
        break;
      case 500:
        ElMessage.error("服务器异常-code：500" + "！");
        break;
      case 404:
      ElMessage.error("未找到页面-code:404");
      break;
      case '504':
        ElMessage.error('服务器网络异常(网关超时）!');
        break;
        
    }
    if (error.status === 401 && !(data.result && data.result.isLogin)) {
      if (token) {
        store.dispatch("Logout").then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }
    }
  }
  return Promise.reject(error);
};

// request interceptor
// 添加请求拦截器
service.interceptors.request.use(
  (options) => {
    // const ajaxconfig = config.ajaxconfig;
    if (options.isLoading) {
      NProgress.start();
    }

    const token = getCookie("Token");
    if (token) {
      options["headers"]["token"] = token;
    }
    if (typeof options['Content-Type'] !== 'undefined') {
      options.headers['Content-Type'] = options['Content-Type']
    }
    //  return options
    return _.defaultsDeep({}, setAjaxRequer(options));
  },err);

/**
 * response interceptor
 * 所有请求统一返回
 */
service.interceptors.response.use((response) => {
  console.log("response8765675", response);
  NProgress.done();
  if (errorCode(response)) {
    if (response.request.responseType === "blob") {
      return response;
    }
    return response.data;
  }
  return response.data; // 这里必须返回 免得报错
}, err);

function errorCode(response) {
  console.log("response", response);
  const { data, status } = response;
  const code = data?.status?.code;
  const msg = data?.status?.msg;
  const config = response.config
  let flag = true;
  if (code === "4") {
    // 登录超时
    router.push("/login");
    ElMessage.error(msg)
    flag = false;
    localStorage.clear();
  }
  if (code && code !== "0") {
    ElMessage.error(status.errorTitle || msg);
    flag = false;
  }
  if (code === "0" && config.successTitle) {
    // 如果需要成功后提示
    ElMessage.success(config.successTitle);
  }
  return flag;
}


function setAjaxQuestHeader(key, v) {
  ajaxconfig["headers"][key] = v;
  // service = axios.create(ajaxconfig);
}

function setAjaxRequer(options) {
  //必须基本设置请求参数
  let url = options.url || "";
  let evn = {};
  if (getCookie("evn")) {
    evn = JSON.parse(getCookie("evn"));
  }
  let isSecurity =
    !evn["sysSecurityConfig"] || !evn["sysSecurityConfig"]["apiUrlSignOpen"]
      ? false
      : true;

  let method = options.method || ajaxconfig.method; //"get" "post"  "put" ，默认请求get

  let isParseStringJSON = options["jsonString"];

  //扩展基本配置项
  let myConfig = options.baseConfing || {}; //{}
  let config = _.defaultsDeep({}, myConfig);
  config.method = method;
  let ServerLongTime = getCookie("ServerLongTime");
  ServerLongTime = !ServerLongTime ? 0 : ServerLongTime;
  var timeStamp = new Date().getTime() - ServerLongTime; // 时间戳
  //获取服务端数据
  if (method === "post" || method === "put" || method === "patch") {
    //POST提交数据时必选参数  如果设置了url签名  需要对参数是数组的进行封装
    if (isSecurity && options.data && options.data.constructor == Array) {
      options.data = { jsonArrData: options.data };
    }
    let potsData = options.data || {}; //{firstName: 'Fred',lastName: 'FlintStone'}
    if (isSecurity) {
      potsData.timeStamp = timeStamp;
    }
    if (_.isObject(potsData)) {
      debugger
      if (typeof isParseStringJSON != "undefined") {
        options.headers['Content-Type'] = 'application/json'
        // setAjaxQuestHeader("Content-Type", "application/json");
        if (isSecurity) {
          let signJsonStr = "&timeStamp=" + timeStamp;
          potsData.sign = paramsStrSort(signJsonStr, url);
        }
        potsData = JSON.stringify(potsData);
      } else {
        // setAjaxQuestHeader('Content-Type', 'application/x-www-form-urlencoded');
        potsData = serializeParams(potsData);
        if (isSecurity) {
          potsData = potsData + "&sign=" + paramsStrSort(potsData, url);
        }
      }
    }
    console.log("potsData", potsData, options.url);
    options.data = potsData;

    return options; // service[method].bind(service, url, potsData, config);
    // return service[method].bind(service, url, potsData, config);
  } else {
    //GET提交数据时必选参数
    let myParams = options.params || {}; //{params: {ID: 12345}} || '/user?ID=12345'
    if (options.url.indexOf("?") > -1) {
      myParams = options.url.substring(options.url.indexOf("?") + 1);
      url = url.substring(0, url.indexOf("?"));
    }
    if (typeof myParams == "string" && isSecurity) {
      myParams = myParams + "&timeStamp=" + timeStamp;
      myParams = serializeParams(myParams, "JSON");
    } else if (isSecurity) {
      myParams.timeStamp = timeStamp;
    } else {
      console.log("else");
    }
    if (isSecurity) {
      options.params = Object.assign({}, myParams, {
        // mathRand: Math.random() * 100000000000000000,
        sign: paramsStrSort(serializeParams(myParams), url), // url签名
      });
    } else {
      options.params = Object.assign({}, myParams, {
        mathRand: Math.random() * 100000000000000000,
      });
      // myParams = Object.assign({}, myParams, { mathRand: Math.random() * 100000000000000000});
    }
    return options; //service[method].bind(service, url, config);
    // return service[method].bind(service, url, config);
  }
}

export { service as axios };
