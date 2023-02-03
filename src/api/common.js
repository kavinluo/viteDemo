import { axios } from '@/utils/request' 

const baseURL = '/passport/pc'


/**
 * envs
 */
export function getEnvs (parameter) {
  return axios({
    url: `/envs`,
    method: 'get',
    data: parameter
    // successTitle: ''
  })
}
/**
 * 登录
 */
export function login (parameter) {
  return axios({
    url: `${baseURL}/manage/login`,
    method: 'post',
    data: parameter,
    successTitle: '登录成功！'
  })
}
/**
 * 获取菜单
 */
export function getMenuTree (parameter) {
  return axios({
    url: `${baseURL}/menu/query-tree-by-user`,
    method: 'get',
    parameter: parameter
    // successTitle: ''
  })
}

/**
 * 获得个人信息
 */
export function getUserInfo (parameter) {
  return axios({
    url: `${baseURL}/archivesBasicInfo/getUserInfo`,
    method: 'get',
    parameter: parameter
    // successTitle: ''
  })
}


