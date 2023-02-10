<!--
 * @Author: kavinluo 
 * @Date: 2023-02-07 14:27:40
 * @LastEditors: kavinluo || luoKevin
 * @LastEditTime: 2023-02-09 13:42:45
-->
<template>
    <el-button @click="handleSetRouter">调整</el-button>
</template>

<script setup>
  import { useState } from '@/store/hooks'
  import { useStore } from '@/store';
  import  router  from '@/router'
  const $store = useStore()
  const handleSetRouter = () => {
    // 改变左侧状态
    $store.dispatch('headerAction', 'left')
    $store.commit('changeSubMenuStatus', true)
    router.push('/manage/examPlan')
    console.log('st', $store.state.hasSubMenus)


}
  console.log('5555', 5555)
</script>

<style lang="scss" scoped>

</style>