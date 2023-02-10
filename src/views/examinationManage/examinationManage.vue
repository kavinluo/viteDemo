
<template>
  <!-- 首页列表 -->
  <allExam v-if="route.name === 'examinationManage'"></allExam>
  <router-view />
</template>

<script setup>
  import allExam from './examIndex/allExam.vue';
  import { useRoute } from 'vue-router'
  const route = useRoute()

</script>

<style lang="scss" scoped>

</style>