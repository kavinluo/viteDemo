const basic = {
  name: 'basic',
  path: '/manage/basic',
  component: () => import(/* webpackChunkName: "login" */'@/views/basic/basic.vue'),
  children: [
    
  ]
}

export {
  basic
}