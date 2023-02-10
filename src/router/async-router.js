/*
 * @Author: kevin
 * @Date: 2022-02-28 15:57:13
 * @LastEditors: kavinluo 821335797@qq.com
 * @LastEditTime: 2023-02-08 16:04:52
 * @Description: 动态获取路由
 */

// let firstMenu = null

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
 export const mapMenusToRoutes = (routerMap, parent) => {
  // debugger
  const routers = routerMap.map(item => {
    // eslint-disable-next-line no-unused-vars
    const {  id } = item || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path:  '/manage/'+ item.modName, //`/manage${item?.modName || parent && parent.modName || ''}/${item.modName}`,
      // 路由名称，建议唯一
      name: item.modName || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // component: () => import(`@/views/${item.modName}/${item.modName}.vue`),
      sequence: item.sequence,
      // meta: 页面标题, 菜单图标,
      meta: {
        id: id,
        title: item.name,
        icon: item.icon || undefined,
        // target: target
        // link: link
      },
      title: item.name,
      parentId: item.parentId,
      id,
      // depth: deppath,
      hidden: false, // 是否可见
      redirect: item.children && item.children?.length ? item.children[0].path : ''
    }
    // 是否设置了隐藏菜单 1 可见 0 不可见
    // if (isSee === 0) {
    //   currentRouter.hidden = true
    // }
    // 是否设置了隐藏子菜单
    // if (hideChildren) {
    //   currentRouter.hideChildrenInMenu = true
    // }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // item.redirect = item.children.length > 0 item.children[0]

    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = mapMenusToRoutes(item.children, currentRouter)
    }
    return currentRouter
  })
  return routers
}

export function mapMenusToPermissions (userMenus) {
  const permissions = []

  const _recurseGetPermission = (menus) => {
    for (const menu of menus) {
      if (menu.type === 1 || menu.type === 2) {
        _recurseGetPermission(menu.children ?? [])
      } else if (menu.type === 3) {
        permissions.push(menu.permission)
      }
    }
  }
  _recurseGetPermission(userMenus)

  return permissions
}

export function menuMapLeafKeys (menuList) {
  const leftKeys = []

  const _recurseGetLeaf = (menuList) => {
    for (const menu of menuList) {
      if (menu.children) {
        _recurseGetLeaf(menu.children)
      } else {
        leftKeys.push(menu.id)
      }
    }
  }
  _recurseGetLeaf(menuList)

  return leftKeys
}
