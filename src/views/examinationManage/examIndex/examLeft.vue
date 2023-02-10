<!--
 * @Author: kavinluo
 * @Date: 2023-02-09 13:22:30
 * @LastEditors: kavinluo
 * @LastEditTime: 2023-02-09 18:10:11
 * @Description: 无
-->
<!--
 * @Author: kavinluo || luoKevin
 * @Date: 2023-02-09 13:22:30
 * @LastEditors: kavinluo
 * @LastEditTime: 2023-02-09 17:59:24
 * @Description: 创建考试
-->

<template>
  <div style="padding: 15px">
    <el-button type="primary" style="line-height:inherit;display: block;font-size:18px;width: 100%;padding: 13px 0 8px;
    height: inherit;" size="large" @click="handleCreate">
      <el-icon :size="25">
        <Plus />
      </el-icon>&nbsp;创建考试</el-button>
    <el-menu :router="true" default-active="1" class="el-menu-vertical-demo">
      <el-menu-item index="1" :route="{ name: 'examinationManage' }">
        <el-icon><icon-menu /></el-icon>
        <span>全部考试</span>
      </el-menu-item>
      <el-menu-item index="2" :route="{ name: 'trash' }">
        <el-icon>
          <DeleteFilled />
        </el-icon>
        <span>回收站</span>
      </el-menu-item>
    </el-menu>
  </div>
  <el-dialog height="200" cancel-text="" v-model="createModal" :width="500">
    <template #header>
      <modal-header :content="{ title: '创建考试' }"></modal-header>
    </template>
    <div>
      <el-form :model="ruleForm" ref="ruleFormRef">
        <el-form-item prop="examName" label="考试名称：">
          <el-input v-model="ruleForm.examName" clearable size="large" placeholder="请输入考试名称"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handelSave(ruleFormRef)">保存</el-button>
        <el-button @click="createModal = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref } from 'vue'
  import { addExam } from '@/api/examPlan.js'
  const createModal = ref(false)
  const ruleFormRef = ref({})
  const ruleForm = ref({
    examName: '',
  })
  const handleCreate = () => {
    createModal.value = true
  }

  const handelSave =  (formEl) => {
    formEl?.validate(async (valid) => {
      if (valid) {
        console.log('提交Ajax')
        const addExamDaa = await addExam({...ruleForm})
        console.log('addExamDaa', addExamDaa)
      } else {
        console.log('error submit!')
        return false
    }
  })
  }
</script>

<style lang="scss" scoped>

</style>