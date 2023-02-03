/*
 * @Author: kevin
 * @Date: 2022-03-04 14:29:18
 * @LastEditors: kevin
 * @LastEditTime: 2022-08-04 16:28:53
 * @Description: Do not edit
 */
// import Index from '@/layout/index.vue'

const routes = [
  // {
  //   path: '/manage',
  //   name: 'manage',
  //   redirect: '/manage/workIndex',
  //   meta: {},
  //   component: () => import(/* webpackChunkIndex: "Index" */'@/views/login.vue')
  //   // children: []
  // },
  {
    path: '/manage',
    name: 'manage',
    redirect: '/manage/workIndex',
    meta: {
       title: '水平测试考务管理系统',
    },
    component: () => import(/* webpackChunkIndex: "Index" */'@/layout/index.vue')
    // children: []
  },
  {
    path: '/manage',
    name: 'manage',
    meta: {
      title: '水平测试考务管理系统',
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    
    component: () => import(/* webpackChunkIndex: "Index" */'@/layout/index.vue'),
    children: [

    ]
  },
  {
    path: '/',
    redirect: '/manage/workIndex'
  },
  {
    path: '/:pathMatch(.*)',
    // path: '/:pathMatch(.*)*', // 后面加*，pathMatch拿到的是数组['jjj','ggg']
		name: 'notFound',
		component: () => import(/* webpackChunkName: "notFound-chunk" */'@/views/NotFound.vue')
	},
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */'@/views/login.vue')
  }
]

export default routes
