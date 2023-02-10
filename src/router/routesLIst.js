

const workIndex = {
    path: 'workIndex',
    name: 'workIndex',
    component: () => import(/* webpackChunkName: "workIndex" */'@/views/workIndex/workIndex.vue')
  }
  // 全部考试
  const allExam = {
    path: '/manage/allExam',
    name: 'allExam',
    component: () => import(/* webpackChunkName: "allExam" */'@/views/examinationManage/examIndex/allExam.vue')
  }

  // 回收站
 const trash = {
    path: '/manage/trash',
    name: 'trash',
    component: () => import(/* webpackChunkName: "trash" */'@/views/examinationManage/examIndex/trash.vue')
 }
 const examPlan = {
  path: '/manage/examPlan',
  name: 'examPlan',
  component: () => import(/* webpackChunkName: "examPla" */'@/views/examinationManage/examPlan/examPla.vue')
}
 const examinationManage = {
  path: '/manage/examinationManage',
  name: 'examinationManage',
  // redirect: '/manage/allExam',
  component: () => import(/* webpackChunkName: "examinationManage" */'@/views/examinationManage/examinationManage.vue'),
  children: [
    trash,
    allExam,
    examPlan
  ]
}


  export {
    workIndex,
    // trash,
    // allExam,
    examinationManage,
    // examPlan
  }
