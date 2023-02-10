import { axios } from '@/utils/request' 

const baseURL = '/passport/pc'

/**
 * 创建考试名称
 * @param {*} data 
 * @returns 
 */
export function addExam (data) {
  return axios({
    url: `${baseURL}/examPlan/add`,
    method: 'post',
    data: data,
    successTitle: '创建成功',
    jsonString: true
  })
}
/**
 * 修改考试名称
 * @param {*} parameter 
 * @returns 
 */
export function modifyExam (parameter,id) {
  return axios({
    url: `${baseURL}/examPlan/modify/${id}`,
    method: 'put',
    parameter: parameter,
    successTitle: '修改成功'
  })
}
