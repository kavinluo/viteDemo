/**
 *  * @Author: kevin
 * @Date: 2022-03-04 11:52:13
 * @LastEditors: kevin
 * @LastEditTime: 2022-03-04 11:52:55
 * @Description:
 *  使用传入element-plus 中的icon名
 * 例： <el-icon><kvicon :name="aim"/></el-icon>
*/

import { createVNode } from 'vue'
import * as kIcon from '@element-plus/icons-vue'

const kvIcon = (props) => {
  const { name } = props
  return createVNode(kIcon[name])
}

export default { name: 'kvIcon', kvIcon }
