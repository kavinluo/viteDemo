import CryptoJS from 'crypto-js'
import _ from 'lodash';
// let queCount = 0;
const kAppKey = 'AmBuf_product'; //url签名 固定死的
export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 判断数据类型
 * @param obj  {}||[]  各种数据类型
 * @param type string  例如: Object String Array等数据类型
 * @return flag boolean 是否为要验证的数据类型
 * */
export function valDataType (obj, type) {
  let flag = false
  switch (type) {
    case 'String':
      obj.constructor === String ? flag = true : flag = false
      break
    case 'Array':
      obj.constructor === Array ? flag = true : flag = false
      break
    case 'Boolean':
      obj.constructor === Boolean ? flag = true : flag = false
      break
    case 'Date':
      obj.constructor === Date ? flag = true : flag = false
      break
    case 'Object':
      obj.constructor === Object ? flag = true : flag = false
      break
    default:
      alert(type + ':不支持的数据类型验证')
      break
  }
  return flag
}

/**
 * 设置缓存值
 * @param name
 * @param val
 */
export function setStaticData (name, val) {
  localStorage.setItem(name, JSON.stringify(val))
  if (!name) return
  if (typeof val !== 'string') {
    val = JSON.stringify(val)
  }
  window.localStorage.setItem(name, val)
}

/**
 * 获取缓存值
 * @param name
 * @returns {any}
 */
export function getStaticData (name) {
  const value = localStorage.getItem(name)
  if (value) {
    return JSON.parse(value)
  }
}

/**
 * 设置 cookie
 * @param {String} cname
 * @param {String} cvalue
 * @param {Number} exdays
 */
export function setCookie (cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

/**
 * 获得 cookie
 * @param {String} cname
 * @param {String} cvalue
 * @param {Number} exdays
 */

// export function getCookie (cname) {
//   const name = cname + '='
//   const ca = document.cookie.split(';')
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i]
//     while (c.charAt(0) === ' ') {
//       c = c.substring(1)
//     }
//     if (c.indexOf(name) === 0) {
//       return c.substring(name.length, c.length)
//     }
//   }
//   return ''
// }
export function getCookie (name) {
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  arr = document.cookie.match(reg)
  if (arr)
    return unescape(arr[2]);
  else
    return null;
}

/*
  ** 格式化参数  
*/
export function formatParam (paramsStr) {
  let newStr = '';
  if (paramsStr.length > 0 && paramsStr.substring(0, 1) != "&") {
    paramsStr = '&' + paramsStr
  }
  let splitStr = paramsStr.split("&")
  for (let i = 0; i < splitStr.length; i++) {
    let t = splitStr[i].split("=");
    if (t.length > 1 && t[1] != '') {
      newStr += '&' + t[0] + '=' + t[1]
    }
  }
  if (newStr.length > 1) {
    newStr = newStr.substring(1)
  }
  return newStr
}

export function paramsStrSort (paramsStr, urls) {
  let token = getCookie('Token')
  if (!token) {
    token = ''
  }
  if (urls.indexOf('?') > -1) {
    urls = urls.substring(0, urls.indexOf('?'))
  }
  paramsStr = formatParam(paramsStr)
  var url = paramsStr + "&token=" + token;
  var orderParamsStr = url.split("&").sort().join("&");
  var newUrl = '/api' + urls + orderParamsStr + "&appKey=" + kAppKey;
  return CryptoJS.MD5(newUrl).toString();
}

//JSON序列化传入参数形式
export function serializeParams (params, type) {
  if (!params)return;
  let obj = {};
  if (type == 'JSON') {
    if (!_.isString(params)) return;
    if (params.indexOf('&') > -1) {
      let splits = params.split('&');
      splits.forEach(function (v, k) {
        let key = v.split('=')[0] || k;
        let val = v.split('=')[1] || undefined;
        obj[key] = val;
      });
      return obj;
    }
  } else {
    if (!_.isObject(params)) {
      if (!_.isObject(JSON.parse(params))) {
        return;
      } else {
        params = JSON.parse(params);
        console.log('params',params)

      }
    }
    obj = [];
    _.forEach(params, function (v, k) {
      v = !v ? '' : v;
      let val = k + '=' + v;
      obj.push(val);
    });
    return obj.join('&');
  }
}

/**
 * 删除缓存值
 * @param name
 */
export function delStaticData (name) {
  if (name) localStorage.removeItem(name)
}

//传输加密
export function encrypt (word, keyStr) {
  keyStr = keyStr ? keyStr : 'AmBuf01062011627';
  var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
  // return encrypted.toString();
  return encrypted.ciphertext.toString().toUpperCase();
}
//传输解密 HEX 16进制
export function decrypt (word, keyStr) {
  keyStr = keyStr ? keyStr : 'AmBuf01062011627';
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var key = CryptoJS.enc.Utf8.parse(keyStr);//
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//传输解密Base64
export function decrypt64 (word, keyStr) {
  keyStr = keyStr ? keyStr : 'AmBuf01062011627';
  var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

export const compareTime = {
  formatDateToTen: function (d) {
    return d > 9 ? d : '0' + d
  },
  getYearFun: function (d) {
    d = new Date(d)
    let m = d.getMonth()
    const dt = d.getDate()
    const arr1 = [
      d.getFullYear(),
      this.formatDateToTen(++m),
      this.formatDateToTen(dt)
    ]
    return arr1.join('-')
  },
  formatDateToStamp: function (d) {
    let m = d.getMonth()
    const dt = d.getDate()
    const arr1 = [
      d.getFullYear(),
      this.formatDateToTen(++m),
      this.formatDateToTen(dt)
    ]
    const arr2 = [
      this.formatDateToTen(d.getHours()),
      this.formatDateToTen(d.getMinutes()),
      '00'
    ]
    return new Date(arr1.join('-') + ' ' + arr2.join(':')).getTime()
  }
}

export function downloadFile (res) {
  const blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
  const contentDisposition = res.headers['content-disposition']
  const pat = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const result = pat.exec(contentDisposition)
  const filename = result[1]
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  const reg = /^["](.*)["]$/g
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href)
}

// 通过身份证获取出生年月日
export function getBirth (idCard) {
  let birthday = ''
  // eslint-disable-next-line eqeqeq
  if (idCard) {
    // eslint-disable-next-line eqeqeq
    if (idCard.length == 15) {
      birthday = '19' + idCard.slice(6, 12)
      // eslint-disable-next-line eqeqeq
    } else if (idCard.length == 18) {
      birthday = idCard.slice(6, 14)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
    // 通过正则表达式来指定输出格式为:1990-01-01
  }
  return birthday
}

export function getSex (idCard) {
  let sexStr = ''
  // eslint-disable-next-line eqeqeq
  if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
    sexStr = '男'
  } else {
    sexStr = '女'
  }
  return sexStr
}

export function pathMapBreadcrumbs (userMenus, currentPath) {
  const breadcrumbs = []
  pathMapToMenu(userMenus, currentPath, breadcrumbs)
  return breadcrumbs
}
export function pathMapToMenu (userMenus, currentPath, breadcrumbs) {
  for (const menu of userMenus) {
    if (menu.path === currentPath) { // 匹配当前点击菜单
      return menu
    } else if (menu.children) {
      const findMenu = pathMapToMenu(menu.children, currentPath)
      if (findMenu) {
        breadcrumbs?.push({ name: menu.meta.title, children: menu.children })
        breadcrumbs?.push({ name: findMenu.meta.title, id: findMenu.id })
        return findMenu
      }
    }
  }
}
// 匹配当前点击菜单
export function currPath (userMenus, currentPath) {
  for (const menu of userMenus) {
    if (menu.path === currentPath) { // 匹配当前点击菜单
      return menu
    } else if (menu.children) {
      const findMenu = currPath(menu.children, currentPath)
      if (findMenu) {
        return findMenu
      }
    }
  }
}

export function downloadHandle (res, name, type) {
  const blob = new Blob([res.data], {
    type: 'application/octet-stream;charset=UTF-8'
  })
  const filenameRes = res.headers['content-disposition']?.split('filename=')[1]?.split(';')[0]
  const fileName = decodeURI(filenameRes) || name + (type || '.xls')

  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob)
  } else {
    const link = document.createElement('a')

    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    // 释放内存
    window.URL.revokeObjectURL(link.href)
  }
}
/**
 * [mergeSameCell 单元格合并]
 * @param  {[type]} tbl      [table对应的dom元素]
 * @param  {[type]} beginRow [从第几行开始合并（从0开始）]
 * @param  {[type]} endRow   [合并到哪一行，负数表示从底下数几行不合并]
 * @param  {[type]} colIdxes [合并的列下标的数组，如[0,1]表示合并前两列，[0]表示只合并第一列]
 * @return {[type]}          [description]
*/
 export const mergeSameCell = (tbl, beginRow, endRow, colIdxes) => {
  var colIdx = colIdxes[0]
  var newColIdxes = colIdxes.concat()
  newColIdxes.splice(0, 1)
  // eslint-disable-next-line no-array-constructor
  var delRows = new Array()
  var rs = tbl.rows
  // endRow为0的时候合并到最后一行，小于0时表示最后有-endRow行不合并
  if (endRow === 0) {
      endRow = rs.length - 1
  } else if (endRow < 0) {
      endRow = rs.length - 1 + endRow
  }
  var rowSpan = 1 // 要设置的rowSpan的值
  var rowIdx = beginRow // 要设置rowSpan的cell行下标
  var cellValue // 存储单元格里面的内容
  for (var i = beginRow; i <= endRow + 1; i++) {
      if (i === endRow + 1) { // 过了最后一行的时候合并前面的单元格
          if (newColIdxes.length > 0) {
              mergeSameCell(tbl, rowIdx, endRow, newColIdxes)
          }
          rs[rowIdx].cells[colIdx].rowSpan = rowSpan
      } else {
          var cell = rs[i].cells[colIdx]
          if (i === beginRow) { // 第一行的时候初始化各个参数
              cellValue = cell.innerHTML
              rowSpan = 1
              rowIdx = i
          } else if (cellValue !== cell.innerHTML) { // 数据改变合并前面的单元格
              cellValue = cell.innerHTML
              if (newColIdxes.length > 0) {
                  mergeSameCell(tbl, rowIdx, i - 1, newColIdxes)
              }
              rs[rowIdx].cells[colIdx].rowSpan = rowSpan
              rowSpan = 1
              rowIdx = i
          } else if (cellValue === cell.innerHTML) { // 数据和前面的数据重复的时候删除单元格
              rowSpan++
              delRows.push(i)
          }
      }
  }
  for (var j = 0; j < delRows.length; j++) {
      rs[delRows[j]].deleteCell(colIdx)
  }
}

// 分页信息
export const pageInitPrams = () => {
  let pageSize = 20;
  const pageInitPrams = {
    currentPage: 1,
    pageSizes: [pageSize, 50, 100, 200],
    pageSize: pageSize,
    listLayout: "total, sizes, prev, pager, next, jumper",
    listTotal: 10
  }
  return pageInitPrams
} 