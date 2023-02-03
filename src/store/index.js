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
import router from '@/router'
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
      indexUrl: '',
      routerPath: {},
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

    /**
       * 设置路由默认首页地址
       * @param state  {} 状态对象
       *
       * @param index string "/index/manage"
    */
      setIndexUrl (state, index) {
        state.indexUrl = index;
      },

    /**
       * 设置server返回的所有路由地址信息
       * @param state  {} 状态对象
       *
       * @param pathObj {"/index/manage":"/index/manage",.....}
   */

  setRouterPath (state, pathObj) {
    state.routerPath = pathObj;
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
    async userInfoActions ({ commit }) {
      const userinfo = await getUserInfo()
      if(userinfo && userinfo.data) {
        setStaticData('userInfo', userinfo.data)
        commit('changeUserInfo', userinfo.data)
      }
    },

    // 获取菜单
    async getMenu ({ commit, dispatch }, payload) {
      const menuData = await getMenuTree(payload)
      if (menuData && menuData.data) { // 这里如果登录用户密码第二次会返回验证码信息，我们不需要
        // dispatch('setMeusData', menuData.data)
      }
    },

    setMeusData({ commit, dispatch },data = []) {
      // let data = responseData.data || [];
      // debugger
      if (data.length > 0) {
        data = data[0].children;
      }
      //将设置完成的structureIndex赋值给 navs
      let infos = { } //this.$store.getters.getUserInfo;
      let index = ''
      if (infos?.userType == 'STU') {
        index = '/student'
      } else {
        index = '/manage'
      }
      if (data[0].children && data[0].children.length) {
        let myData = data[0].children || [];
        for (var i = 0; i < myData.length;) {
          if (typeof myData[i].children != 'undefined') {
            index += '/' + myData[i]['modName'];
            myData = myData[i].children;
          } else {
            index += '/' + myData[i]['modName'];
            break;
          }
        }
      } else {
        index += '/' + data[0].modName
      }
      // dispatch('setRouterPath', data, true) 
      commit('setIndexUrl', index);
      // commit('setRouterPath', this.routerPath);
      commit('changeMenu', data)
      console.log('menuData', data)
      setStaticData('menuData', data)
      console.log('index', index)
      debugger
      router.push(index);
      
    },

    // setRouterPath({ commit, dispatch}, data, first, parItem) {
    //   for (var i = 0, item; i < data.length; i++) {
    //     item = data[i];
    //     if (!item.children || !item.children.length) { //
    //       item['path'] = '/manage/' + item['modName'];
    //     }
    //     if (first && !(!item.children || !item.children.length)) {
    //       item['path'] = '/manage';
    //       item['level'] = 1;
    //     } else if (parItem) {
    //       if (parItem['path'] == -1) {
    //         item['path'] = parItem['modName'] + '/' + item.modName;
    //       } else {
    //         item['path'] = parItem['path'] + '/' + item.modName;
    //       }
    //       item['level'] = parItem['level'] + 1;
    //     }
    //     // this.routerPath[item['path']] = item['path'];
    //     commit('setRouterPath', {[item['path']]: item['path']});
    //     if (typeof item.children != 'undefined' && item.children.length > 0) {
    //       dispatch('setRouterPath', item.children, false, item);
    //     }
    //   }
    // },


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
  },
  getIndexUrl: state => {
    return state.indexUrl;
  },
  getRouterPath: state => {
    return state.routerPath;
  },
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
