/*
 * @Author: kevin
 * @Date: 2022-03-04 14:29:18
 * @LastEditors: kavinluo || luoKevin
 * @LastEditTime: 2023-02-09 14:00:03
 * @Description: Do not edit
 */
  import  { workIndex, examinationManage } from './routesLIst'
  import  { basic } from './base'

  const routes = [
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import(/* webpackChunkName: "notFound-chunk" */'@/views/NotFound.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */'@/views/login.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      redirect: '/manage/examinationManage',
      meta: {
        title: '考务管理系统',
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import(/* webpackChunkName: "index" */'@/layout/index.vue'),
      children: [
        workIndex,
        examinationManage,
        basic,
      ],
    },
    // {
    //   path: '/',
    //   redirect: '/manage/examinationManage'
    // },

  ]
  console.log('routes', routes)
  export default routes
