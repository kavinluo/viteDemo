/*
 * @Author: kevin
 * @Date: 2022-02-24 09:12:57
 * @LastEditors: kevin
 * @LastEditTime: 2022-03-10 16:57:10
 * @Description: Do not edit
 */
import { mapState, createNamespacedHelpers } from 'vuex'
import useMapper from './useMapper'
/**
 * @param {Object or Array} mapper
 * @param {string} moduleName
 * @returns function
 */
//  useState([], 'XX')
export default function useState (mapper, moduleName) {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  }
  return useMapper(mapper, mapperFn)
}
