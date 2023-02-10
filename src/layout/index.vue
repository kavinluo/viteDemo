<!--
 * @Author: kavinluo || luoKevin
 * @Date: 2023-01-31 15:57:34
 * @LastEditors: kavinluo || luoKevin
 * @LastEditTime: 2023-02-09 16:23:24
 * @Description: 无
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author: kevin
 * @Date: 2022-02-25 09:42:38
 * @LastEditors: kavinluo || luoKevin
 * @LastEditTime: 2023-02-09 13:09:02
 * @Description: Do not edit
-->
<template>

  <el-container>
    <el-header id="header" height="80px">
      <headers />
    </el-header>
    <el-container class="main">
      <template v-if="isExamManage === 'examinationManage'">
        <el-aside style="background: inherit">
          <div class="menu-switch">
          </div>
          <exam-left />
        </el-aside>
        <el-main class="right-main" style="background: inherit">
          <div class="right-main-content">
            <router-view />
          </div>
        </el-main>
      </template>
      <template v-else>
        <el-aside :width="'200px'" :style="!isFold ? menuSwitchOffStyle : menuSwitchOnStyle" v-if="hasSubMenus">
          <div class="menu-switch" @click="handleFoldClick">
            <el-icon style="vertical-align: middle;font-size:15px">
              <Fold style="font-size:12px;margin-top: -5px;" v-if="isFold" />
              <Expand style="font-size:12px;margin-top: -5px;" v-else />
            </el-icon>
          </div>
          <leftMenu :collapse="isFold" />
        </el-aside>
        <el-main class="right-main">
          <!-- <div class="path" v-if="hasSubMenus && !hideLeftSide.includes(route.name)"> {{ pathTree.breadcrumbs }} </div> -->
          <div class="right-main-content">
            <router-view />
          </div>
        </el-main>
      </template>

    </el-container>
  </el-container>

</template>

<script setup>
  import headers from './header.vue'
  import leftMenu from './leftMenu.vue'
  import examLeft from '@/views/examinationManage/examIndex/examLeft.vue'
  // import { useState } from '@/store/hooks/index'
  import { useStore } from '@/store'
  import { useRoute } from 'vue-router'
  import { pathMapBreadcrumbs, setStaticData } from '@/utils/util'
  import { ref, computed, watch } from 'vue'
  const store = useStore()
  console.log('store', store.state.headerMenuStatus)
  const isExamManage =  ref('examinationManage') // 是否是考务管理

  const hideLeftSide = ['allExam'] // 手动过滤不显示左侧菜单栏目 workIndex = path.name
  const isFold = ref(false)
  const route = useRoute()

  // 监听头部菜单变化
  watch(
    // [store.state.headerMenuStatus,store.state.hasSubMenus],
    [()=> store.state.headerMenuStatus,
    ()=> store.state.hasSubMenus],
    ([headerMenuNew, hasSubMenusNew], [headerMenuOld, cc]) => {
      isExamManage.value = headerMenuNew
      hasSubMenus.value = hasSubMenusNew
      console.log('headerMenuNew', headerMenuNew)
      console.log('headerMenuOld', headerMenuOld)
      console.log('hasSubMenusNew', hasSubMenusNew)
      console.log('cc', cc)
    },

    // (news) => {
    //   isExamManage.value = news
    //   console.log('isWorkIndex', isExamManage.value)
    // },
    // (news) => {
    //   hasSubMenus.value = news
    //   console.log('hasSubMenus', hasSubMenus.value)
    // },
    )
  // // 监听左侧菜单变化
  // watch(
  //   ()=> store.state.hasSubMenus,
  //   (news) => {
  //     isExamManage.value = news
  //     console.log('isWorkIndex', isExamManage.value)
  // })
  const handleFoldClick = () => {
    isFold.value = !isFold.value
  }
  const hasSubMenus = ref(false)
  const menuSwitchOffStyle = {
    width: '200px',
    transition: 'all .3s ease-out'
  }

  const menuSwitchOnStyle = {
    width: '64px',
    transition: 'all .5s ease-out'
  }
  // 面包屑的数据: [{name: , path: }]
//   const store = useStore()
//   // const userMenus = store.state.user.userMenus
//   const userMenus = useState(['menuData'])
//   const menuData = ref(userMenus.menuData)
//  console.log('menuData', menuData)
//   const pathTree = computed(() => {
//     const currentPath = route.path
//     const pathList = []//pathMapBreadcrumbs(menuData.value, currentPath)
//     const breadcrumbs = pathList.map((item, index) => (index ? '>' : '') + item.name).join(' ')
//     return {
//       breadcrumbs,
//       pathList
//     }
//   })
  // 根据路由获得ID，更新当前左侧点击的状态及内容
  // watch(() => pathTree.value.pathList, (n, o) => {
  //   // 更新子菜单内容
  //   if (n.length) {
  //     store.dispatch('changeSubMenusActions', n[0]?.children || [])
  //     // 设置状态
  //     store.dispatch('changerCurrentValue', n[1].id)
  //     setStaticData('defaultActiveValue', n[1].id)
  //   }
  // })
</script>

<style lang="scss">

  .main {
    height: 100%;
    padding: 0 10px;
    display: flex;
  }
  .right-main {
    background: #fff;
    flex: 1;
    padding: 0 !important;
    margin: 15px 0 0 15px;
    .right-main-content {
      padding: 15px ;
    }
    .path {
      height: 40px;
      line-height:40px;
      background: #fff;
      padding: 0 15px;
      border-bottom: 15px solid #dce9f4;
    }
  }
  .menu-switch {
    height: 15px;
    text-align: center;
    cursor: pointer;
    background:#dce9f4 ;
  }
  #header {
    padding: 0 10px;
    background-image: linear-gradient(90deg,#3551a4,#2284b6 50%,#db9e68),linear-gradient(#3752a3,#3752a3);
    display: flex;
    align-items: center;
    .topbar-left {
      .logo {
        display: flex;
        align-items: center;
        h2 {
          font-size: 22px;
          color: #fff;
          font-weight: 500;
          margin-left: 10px;
          letter-spacing: 2px;
        }
      }
    }
    .topbar-navigation {
      margin-left: 40px;
      a *{
        color: #fff;
      }
    }
    .topbar-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      position: relative;
      .use-name {
        margin-left: 15px;
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        line-height: 30px;
        text-align: center;
        background: #2284b6;
        color: #fff;
        cursor: pointer;
      }
      .show-down {
        width: 100px;
        position: absolute;
        right: -6px;
        background: #2284b6;
        top: 32px;
        padding: 5px 0;
        border-radius: 2px;
        li{
          display: block;
          padding: 5px 0;
          text-align: center;
          font-size: 12px;
          color: aliceblue;
          cursor: pointer;
          &:hover {
            background: #52a9d5;
            color: #fff;
          }
        }
      }
    }
  }
</style>
