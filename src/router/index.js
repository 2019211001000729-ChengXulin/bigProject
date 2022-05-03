import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 路由的重定向  使得用户第一次进入程序时  直接到登录界面
  {
    path: '/',
    redirect: '/login'
  },
  // 登录界面路由
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // 注册界面路由
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  // 管理界面路由
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/Manage.vue'),
    children: [
      {
        path: 'home',
        component: () => import('../views/home/Home.vue')
      },
      {
        path: 'songDetail',
        component: () => import('../views/home/songDetail.vue')
      },
      {
        path: 'recommendSound',
        component: () => import('../views/home/recommendSound.vue')
      },
      {
        path: 'musicList',
        component: () => import('../views/home/musicList.vue')
      },
      {
        path: 'hotMusicList',
        component: () => import('../views/home/hotMusicList.vue')
      },
      {
        path: 'search',
        component: () => import('../views/search/Search.vue')
      },
      {
        path: 'mine',
        component: () => import('../views/mine/Mine.vue')
      },
    ]
  }

]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
