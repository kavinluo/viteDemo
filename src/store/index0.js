/*
 * @Author: kevin
 * @Date: 2023-02-2 13:55:23
 * @LastEditors: kavinluo 821335797@qq.com
 * @LastEditTime: 2023-02-08 12:57:17
 * @Description: Do not edit
 */

import { createStore, useStore as useVuexStore } from 'vuex'
// import user from './modules/user'
import { getEnvs, login, getMenuTree, getUserInfo } from '@/api/common.js'
// import { login } from '@/api/login.js'
import router from '@/router'
import { setStaticData, setCookie, delStaticData, getStaticData, getCookie } from '@/utils/util'
// import { mapMenusToRoutes } from '@/router/async-router'
const store = createStore({
  namespaced: true, // 命名空间
  modules: {
    // user
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

      isWorkIndex: true, // 是否考务管理首页
      useInfo: null,
      menuData: null,
      headerMenuStatus: null,
      subMenus: [], // 储存子菜单
      hasSubMenus: false, // 是否有子菜单
      isJump: true, // 菜单是否跳转
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
    changerEven (state, envs) {
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

      state.isWorkIndex = data.length && data[0].name === 'examinationManage'

      // router.push('/manage')
      // const _routes = mapMenusToRoutes(data)

      // _routes.forEach((route) => {
      //   router.addRoute('manage', route)
      // })
      // state.menuData = _routes
      // // 刷新页面时先从本地获取
      // const hasSubMenus = getStaticData('hasSubMenus')
  
      // const subMenus = getStaticData('subMenus')
      // state.subMenus = subMenus || _routes[0].children
      // state.hasSubMenus = hasSubMenus || (state.subMenus?.length > 0)
      // if (state.isJump) {
      //   if (state.hasSubMenus) {
      //     router.push('/manage')
      //     // router.push(state.menuData[0].path)
      //   } else {
      //     router.push(data[0]?.path || '/manage')
      //   }
      // }
    },
    changeSubMenus (state, subMenus) {
      state.subMenus = subMenus
      state.hasSubMenus = subMenus.length > 0
      // 切换时候存储菜单状态
      setStaticData('subMenus', state.subMenus)
      setStaticData('hasSubMenus', state.hasSubMenus)
    },

    changeHeaderStatus (state, type) {
      console.log('type', type)
      state.headerMenuStatus = type
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

  changerRouterPath (state, pathObj) {
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
  
     /**
     * // 获取envs并设置 
     * @param {*} param0 
     * @param {*} payload 
     */

    async envsAction ({ commit }, payload) {
      const envsRes = await getEnvs(payload)
      const timeStamp = new Date().getTime();
      let severTimestamp = envsRes.data["timestamp"];
      severTimestamp = (severTimestamp !== null && severTimestamp != "") ? timeStamp - parseInt(severTimestamp) : null;
      console.log(envsRes.data, "res.data");
      setCookie('ServerLongTime', severTimestamp, 1);
      setCookie('evn', JSON.stringify(envsRes.data));
      commit('changerEven', envsRes.data)
      setStaticData('envs', envsRes.data)
    },

     /**
     * 获得token
     * @param {*} param0 
     * @param {*} payload 
     */

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
    

     /**
     * 获取个人信息
     * @param {*} param0 
     * @param {*} payload 
     */
    async userInfoActions ({ commit }) {
      const userinfo = await getUserInfo()
      if(userinfo && userinfo.data) {
        setStaticData('userInfo', userinfo.data)
        commit('changeUserInfo', userinfo.data)
      }
    },


    /**
     * 获取菜单
     * @param {*} param0 
     * @param {*} payload 
     */
    async getMenu ({ commit, dispatch }, payload) {
      const menuData = await getMenuTree(payload)
      console.log('menuData.data', menuData.data)
      if (menuData && menuData.data) { // 
        dispatch('setMeuseData', menuData)
      }

    },

    /**
     * 设置菜单
     * @param {*} param0 
     * @param {*} payload 
     */ 
    // setMeuseData({ commit, dispatch },data = []) {
    //   // data = data.sort((a, b) => a.sequence - b.sequence)
    //   data.forEach(item => {
    //     if (item.children?.length) {
    //       item.children = item.children.sort((a, b) => a.sequence - b.sequence)
    //     }
    //   })
    //   setStaticData('menuData', data)
    //   commit('changeMenu', data)
    //   // 设置默认进入后菜单状态
    //   // const defaultActiveValue = (typeof data[0].children !== 'undefined' && data[0].children.length > 0) ? data[0].children[0].id : ''
    //   // setStaticData('defaultActiveValue', defaultActiveValue)
    //   // dispatch('changerCurrentValue', defaultActiveValue, { root: true })
    // },
    setMeuseData({commit, dispatch }, responseData) {
      console.log('responseData', responseData)
      let data = responseData.data || [];
      if (data.length > 0) {
        data = data[0].children;
      }
      console.log('data', data)
      //将设置完成的structureIndex赋值给 navs
      // let infos = this.$store.getters.getUserInfo;
      let index = ''
      // if (infos.userType == 'STU') {
      //   index = '/student'
      // } else {
        index = '/manage'
      // }
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
      dispatch('setRouterPath',data, true);
      // this.$store.commit('setIndexUrl', index);
      // commit('changerRouterPath', this.routerPath);
      // this.$router.push(index);
      // router.push('/manage')
    },
    
     /**
     * 获取所有后台配置的路由地址
     * @param data
     * @param first
     * @param parItem
     */
     setRouterPath({ commit, dispatch }, data, first, parItem) {
      for (var i = 0, item; i < data.length; i++) {
        item = data[i];
        if (!item.children || !item.children.length) { //
          item['path'] = '/manage/' + item['modName'];
        }
        if (first && !(!item.children || !item.children.length)) {
          item['path'] = '/manage';
          item['level'] = 1;
        } else if (parItem) {
          if (parItem['path'] == -1) {
            item['path'] = parItem['modName'] + '/' + item.modName;
          } else {
            item['path'] = parItem['path'] + '/' + item.modName;
          }
          item['level'] = parItem['level'] + 1;
        }
       
        // this.routerPath[item['path']] = item['path'];
        commit('changerRouterPath', {[item['path']]: item['path']})
        if (typeof item.children != 'undefined' && item.children.length > 0) {
          dispatch('setRouterPath', item.children, false, item);
        }
        commit('changeMenu', data)
        setStaticData('menuData', data)
      }
    },

    /**
     *  退出登录
     * @param {*} param0 
     * @param {*} payload 
     */
    async loginOut ({ commit }, payload) {
       const logoutRes = ''//await logout()
      if (!logoutRes) {
        commit('deleteUserInfo', logoutRes)
        router.push('/login')
      }
    },

    async updateRootInfo ({ commit }, payload) {
      commit('changerEven', payload)
    },

    /**
    * 设置子菜单菜单 
     * @param {*} param0 
     * @param {*} payload 
     */
    changeSubMenusActions ({ commit }, payload) {
      setStaticData('subMenus', payload)
      commit('changeSubMenus', payload)
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
    },

      /**
     * 刷新后获取本地数据
     * @param {*} param0 
     * @param {*} payload 
     */
    updateStore ({ commit, dispatch }) {
      const Token = getCookie('Token')
      if (Token) {
        commit('changeToken', Token)
        dispatch('userInfoActions') // 获取个人信息
        dispatch('getMenu') // 获取菜单
      }
      // const userInfo = getStaticData('userInfo')
      //   commit('changeUserInfo', userInfo)
      // const userMenus = getStaticData('userMenus')
      // if (userMenus) {
      //   commit('changeUserMenus', userMenus)
      // }
      // const envs = getStaticData('envs')
      // if (envs) {
      //   dispatch('updateRootInfo', envs, { root: true })
      // }
      // const defaultActiveValue = getStaticData('defaultActiveValue')
      // if (defaultActiveValue) {
      //   dispatch('changerCurrentValue', defaultActiveValue, { root: true })
      // }
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
  store.dispatch('updateStore')
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
