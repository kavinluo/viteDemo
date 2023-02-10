/*
 * @Author: kevin
 * @Date: 2022-02-28 09:09:17
 * @LastEditors: kevin
 * @LastEditTime: 2022-07-06 09:03:43
 * @Description: 用户相关
 */
import router from '@/router'
import { login, getUserInfo, getUserMenu, logout } from '@/api/common.js'
import { setStaticData, delStaticData, getStaticData, setCookie, getCookie } from '@/utils/util'
import { mapMenusToRoutes } from '@/router/async-router'
// import menuList from './menuData'
export default ({
  namespaced: true, // 命名空间
  state () {
    return {
      Token: '',
      userInfo: {},
      userMenus: [],
      subMenus: [], // 储存子菜单
      hasSubMenus: false, // 是否有子菜单
      isJump: true // 菜单是否跳转
    }
  },
  mutations: {
    changeToken (state, token) {
      state.Token = token
    },
    changeUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    changeUserMenus (state, userMenus, root) {
      const _routes = mapMenusToRoutes(userMenus)
      // 将routes => router.manage.children
      _routes.forEach((route) => {
        router.addRoute('manage', route)
      })
      state.userMenus = _routes
      // 刷新页面时先从本地获取
      const hasSubMenus = getStaticData('hasSubMenus')
      const subMenus = getStaticData('subMenus')
      state.subMenus = subMenus || _routes[0].children
      state.hasSubMenus = hasSubMenus || (state.subMenus?.length > 0)
      if (state.isJump) {
        if (state.hasSubMenus) {
          router.push(state.userMenus[0].path)
        } else {
          router.push(userMenus[0]?.path || '/manage')
        }
      }
    },
    changeSubMenus (state, subMenus) {
      state.subMenus = subMenus
      state.hasSubMenus = subMenus.length > 0

      // 切换时候存储菜单状态
      setStaticData('subMenus', state.subMenus)
      setStaticData('hasSubMenus', state.hasSubMenus)
    },
    // 删除存储
    deleteUserInfo (state, logoutRes) {
      state.userMenus = null
      state.Token = null
      state.userInfo = null
      delStaticData('userMenus')
      delStaticData('userInfo')
      delStaticData('defaultActiveValue')
      localStorage.clear()
    },
    actionIsJump (state, isJumpStatus = true) {
      state.isJump = isJumpStatus
    }
  },
  actions: {
    // 获得token
    async loginActions ({ commit, dispatch }, payload) {
      const loginRes = await login(payload)
      if (loginRes && typeof loginRes === 'string') { // 这里如果登录用户密码第二次会返回验证码信息，我们不需要
        commit('changeToken', loginRes)
        setCookie('Token', loginRes, 1)
        dispatch('userInfoAction')
      }
    },
     // 请求用户信息
    async userInfoAction ({ commit, dispatch }, payload) {
      const { data } = await getUserInfo()
      const userInfo = data || {}
      setStaticData('userInfo', userInfo)
      commit('changeUserInfo', userInfo)
      dispatch('getUserMenusActions')
    },
     // 请求菜单
     async getUserMenusActions ({ commit, dispatch }, isJumpStatus) {
      commit('actionIsJump', isJumpStatus)
      const getUserMenusRes = await getUserMenu()
      let userMenus = getUserMenusRes?.data ?? []
      userMenus = userMenus.sort((a, b) => a.sequence - b.sequence)
      userMenus.forEach(item => {
        if (item.children?.length) {
          item.children = item.children.sort((a, b) => a.sequence - b.sequence)
        }
      })
      setStaticData('userMenus', userMenus)
      commit('changeUserMenus', userMenus)
      // 设置默认进入后菜单状态
      const defaultActiveValue = (typeof userMenus[0].children !== 'undefined' && userMenus[0].children.length > 0) ? userMenus[0].children[0].id : ''
      setStaticData('defaultActiveValue', defaultActiveValue)
      dispatch('changerCurrentValue', defaultActiveValue, { root: true })
    },

    // 设置子菜单菜单
    changeSubMenusActions ({ commit }, payload) {
      setStaticData('subMenus', payload)
      commit('changeSubMenus', payload)
    },

    // 退出登录
    async loginOut ({ commit }, payload) {
      const logoutRes = await logout()
      if (!logoutRes) {
        commit('deleteUserInfo', logoutRes)
        router.push('/login')
      }
    },

    // 刷新后获取本地数据
    updatStore ({ commit, dispatch, root }) {
      const Token = getCookie('Token')
      if (Token) {
        commit('changeToken', Token)
        // 此处如果需要更新根目录的 store
        // dispatch('updateRootInfo', null, { root: true })
      }
      const userInfo = getStaticData('userInfo')
        commit('changeUserInfo', userInfo)
      const userMenus = getStaticData('userMenus')
      if (userMenus) {
        commit('changeUserMenus', userMenus)
      }
      const envs = getStaticData('envs')
      if (envs) {
        dispatch('updateRootInfo', envs, { root: true })
      }
      const defaultActiveValue = getStaticData('defaultActiveValue')
      if (defaultActiveValue) {
        dispatch('changerCurrentValue', defaultActiveValue, { root: true })
      }
    }
  },
  getters: {
    getsubMenu (state) {
      return state.subMenus
    }
  }
})
