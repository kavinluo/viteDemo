/*
 * @Author: kevin
 * @Date: 2022-03-08 17:55:35
 * @LastEditors: kevin
 * @LastEditTime: 2022-05-05 15:55:57
 * @Description: 时间格式化
 */

import * as Dayjs from 'dayjs'

/**
 * 格式化时间戳
 * @param useTime Number
 * @param useMat String
 */

export function formatTimestamp (useTime, useMat) {
  if (useTime === undefined) return ''
  return Dayjs(useTime).format(useMat)
}
