/*
 * @Author: kevin
 * @Date: 2023-02-2 13:55:23
 * @LastEditors: kevin
 * @LastEditTime: 2022-05-23 17:50:46
 * @Description: Do not edit
 */

import { createStore, useStore as useVuexStore } from 'vuex'
import user from './modules/user'
import { getEnvs, login, getMenuTree, getUserInfo } from '@/api/common.js'
// import { login } from '@/api/login.js'

import { setStaticData, setCookie } from '@/utils/util'

const store = createStore({
  namespaced: true, // 命名空间
  modules: {
    user
  },
  state () {
    return {
      envs: {},
      Token: '',
      pagination: { // 分页信息
        pageSize: 10,
        curPage: 1
      },
      useInfo: null,
      menuData: null,
      HOST: null,
      fileConfig: null,
      changerPageSizeStatus: true, // 监听切换菜单时候重置分页数据状态
      tableData: [], // 表格数据
      total: 0, // 总条数
      defaultActiveValue: null, // 菜单默认选中的值
      breadcrumbs: [] // 面包屑

    }
  },
  mutations: {
    changerEvet (state, envs) {
      state.envs = envs
      const { fileConfig } = envs
      state.fileConfig = fileConfig
      state.HOST = fileConfig.networkStaticUrl
    },
    changeToken (state, token) {
      state.Token = token
    },
    changeMenu (state, data) {
      state.menuData = data
    },
    
    changeUserInfo (state, data) {
      state.useInfo = data
    },
    
    changerpageSize (state, pageSize) {
      state.pagination.pageSize = pageSize
    },
    changerPageSizeStatus (state, current) {
      state.changerPageSizeStatus = current
    },
    changerCurrentPage (state, current) {
      state.pagination.curPage = current
    },
    defaultActiveValue (state, value) {
      state.defaultActiveValue = value
    },
    setTableData (state, data) {
      state.tableData = data?.list ?? (Array.isArray(data) ? data : [])
      state.total = data?.total ?? 0
    }
  },
  actions: {
    // 获取envs并设置 
    async envsAction ({ commit }, payload) {
      const envsRes = await getEnvs(payload)
      const timeStamp = new Date().getTime();
      let severTimestamp = envsRes.data["timestamp"];
      severTimestamp = (severTimestamp !== null && severTimestamp != "") ? timeStamp - parseInt(severTimestamp) : null;
      console.log(envsRes.data, "res.data");
      setCookie('ServerLongTime', severTimestamp, 1);
      setCookie('evn', JSON.stringify(envsRes.data));
      commit('changerEvet', envsRes.data)
      setStaticData('envs', envsRes.data)
    },

    // 获得token
    async loginActions ({ commit, dispatch }, payload) {
      const loginRes = await login(payload)
      if (loginRes && loginRes.data) { // 这里如果登录用户密码第二次会返回验证码信息，我们不需要
        commit('changeToken', loginRes.data)
        setCookie('Token', loginRes.data, 1);
        setStaticData('Token', loginRes.data)
        dispatch('userInfoActions') // 获取个人信息
        dispatch('getMenu') // 获取菜单
      }
    },

    // 获取个人信息
    async userInfoActions ({ commit, dispatch }) {
      const userinfo = await getUserInfo()
      commit('userInfo', userinfo.data)
      dispatch('changeUserInfo', userinfo.data)
    },

    // 获取菜单
    async getMenu ({ commit }, payload) {
      const menuData = await getMenuTree(payload)
      if (menuData && menuData.data) { // 这里如果登录用户密码第二次会返回验证码信息，我们不需要
        commit('changeMenu', menuData.data)
        setStaticData('menuData', menuData.data)
      }
    },
    async updateRootInfo ({ commit }, payload) {
      commit('changerEvet', payload)
    },

    changerPageSize ({ commit }, payload) {
      commit('changerpageSize', payload)
    },
    changerCurrentPage ({ commit }, payload) {
      commit('changerCurrentPage', payload)
    },
    changerCurrentValue ({ commit }, payload) {
      commit('defaultActiveValue', payload)
    },
    async getListPage ({ commit, state }, { fn, params, baseURL }) {
      const param = Object.assign({}, state.pagination, params)
      const { data = {} } = await fn(param, baseURL)
      commit('setTableData', data)
    },
    changeListPage ({ dispatch }) {
      dispatch('getListPage')
    }

  },
  getters: {
    useInfo (state) {
      return `请叫我 ${state.name}`
    }
  }
})

export function setupStore () {
  store.dispatch('envsAction')
  // store.dispatch('user/updatStore')
}
export function useStore () {
  return useVuexStore()
}

/**
 * 更新列表
 * @param {Function} getListFn
 * @param {Object} params
 * @param {String} baseURL
 */

export function updateList (getListFn, params, baseURL) {
 store.dispatch('getListPage', { fn: getListFn, params, baseURL })
}

export default store
