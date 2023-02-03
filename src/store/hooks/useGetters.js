import { mapGetters, createNamespacedHelpers } from 'vuex'
import useMapper from './useMapper'

/**
 *
 * @param {Objcet or Array} mapper
 * @param {string} moduleName
 * @returns function
 */
export default function useGetters (mapper, moduleName) {
  let mapperFn = mapGetters
  if (typeof moduleName === 'string' && moduleName) {
    // 如果有module
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  }
  return useMapper(mapper, mapperFn)
}
