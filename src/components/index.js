/*
 * @Author: kevin
 * @Date: 2022-02-28 09:09:17
 * @LastEditors: kevin
 * @LastEditTime: 2022-03-21 13:35:05
 * @Description: 组件注册
 */
import { components, plugins } from './element-ui/register-element'
import { ViewComponents } from './view-ui/register-view-ui'
import UserIcon from '@/components/kvIcon/kvIcon.js'
import modalHeader from './common/modalHeader.vue';
// import keTable from '@/components/kvTable'
// import KvFrom from '@/components/kvform'
// import kvDialog from '@/components/kvDialog'
const concatComponent = [...components, ...ViewComponents, modalHeader]// keTable, KvFrom, kvDialog]
function globalRegisterComponent (app) {
  for (const component of concatComponent) {
    if (component.name === 'Menu') { // Menu组件名称和html本身标签重名
      app.component('IconMenu', component)
    }
    app.component(component.name, component)
  }
  plugins.forEach((plugin) => {
    app.use(plugin)
  })
  const { name, kvIcon } = UserIcon
  app.component(name, kvIcon)
}

export {
  globalRegisterComponent
}
