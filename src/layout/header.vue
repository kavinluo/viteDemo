<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author: kevin
 * @Date: 2022-02-25 09:42:38
 * @LastEditors: kavinluo || luoKevin
 * @LastEditTime: 2023-02-09 14:41:13
 * @Description: Do not edit
-->
<template>
  <div class="topbar-left">
    <div class="logo">
      <img src="/static/image/KwLogo.png" height="60"/>
      <h2>无纸化考试系统</h2>
    </div>
  </div>
  <div class="topbar-navigation topbar-left">
    <template v-for="(item, y) in menuData" :key="y">
      <router-link :to="item.path" @click="handleMenu(item)" style="margin-right: 15px">
        <el-button color="#ffffff1a" size="large" type="primary">
          <!-- <el-icon><kvIcon :name="item.meta?.icon" /></el-icon> -->
           {{ item.title }}
        </el-button>
      </router-link>
    </template>
  </div>
  <div class="topbar-info topbar-right" ref="headline">
    <div class="welcome-info">
      欢迎您，{{ userInfo?.name }}
    </div>
    <el-dropdown class="use-name">
      <span class="el-dropdown-link">
        <span @click="downOut" id="useName">{{ userInfo?.name ? userInfo.name.substr(0,1) : '' }}</span>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useStore } from '@/store'
  import { useState } from '@/store/hooks/index'
  import { useRouter } from 'vue-router'
  import { setStaticData } from '@/utils/util'

  // export default {
  //   setup () {
      const store = useStore()
      const router = useRouter()
      const downStatus = ref(false)
      const headline = ref(null) // $refs
      const userInfo = store.state.useInfo
      console.log('userInfo', userInfo)
      const userMenus = store.state.menuData
      const menuData = store.state.menuData // ref(userMenus.menuData)

      console.log(userMenus);
      const handleMenu = (item) => {
        store.dispatch('headerAction', item.name)

        
        console.log('store', store.state.headerMenuStatus)
        // 却换时重置分页信息to do...
        // store.commit('changerpageSize', 10)
        // store.commit('changerCurrentPage', 1)
        router.push(item.path)
        // 如果是考务管理单独设置
        // if(item.name === 'examinationManage') {

        // } else {
          const subMenuList = item.children || []
          store.dispatch('changeSubMenusActions', subMenuList)
          const currentPathId = (subMenuList.length > 0 && typeof subMenuList[0].children !== 'undefined' && subMenuList[0].children.length > 0) ? subMenuList[0].children[0].id : subMenuList.length > 0 ? subMenuList[0].id : ''
          store.dispatch('changerCurrentValue', currentPathId)
          setStaticData('defaultActiveValue', currentPathId)

          // 如果点击的是考务管理设置为左侧菜单为 无
          if (item.name === 'examinationManage') {
            store.commit('changeSubMenuStatus', false)
          } else {
            store.commit('changeSubMenuStatus', true)
          }
        // }
      }

      const downOut = () => {
        downStatus.value = !downStatus.value
      }
      const logOut = () => {
        store.dispatch('loginOut')
      }
      // 点击任何区域关闭
      const handleBodyClick = (event) => {
        const sp = headline.value
        if (sp) {
          if (!sp.contains(event.target)) {
            downStatus.value = false
          }
        }
      }
      document.addEventListener('click', handleBodyClick)
 
</script>
<style lang="scss" scoped>
  .router-link-active {
    button {
      background: #3e95ef;
    }
  }
</style>
