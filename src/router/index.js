/* 创建路由配置 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/login2',
    name: 'Login'
  },
  {
    path: '/cart',
    name: 'Cart'
  },
  {
    path: '/settings',
    name: 'Settings'
  },
  {
    path: '/product/:comId',
    name: 'ProductDetail'
  }
]

const router = new VueRouter({
  routes
})

export default router