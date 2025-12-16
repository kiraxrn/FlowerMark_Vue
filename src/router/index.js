// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用 Vue Router 插件
Vue.use(VueRouter)

// 导入页面组件
import MainPage from '../views/MainPage.vue'
import Tongcheng from '../views/navigation/TongCheng.vue'
import MiaoSha from '../views/navigation/MiaoSha.vue'
import ClassifyPage from '../views/sidebar/ClassifyPage.vue' 
import Help from '../views/navigation/Help.vue'
import ShoppingCart from '../views/product/ShoppingCart.vue'
import SettingPage from '../views/SettingPage.vue'
import ProductDetail from '../views/product/ProductDetail.vue'

// 导入分类子页面（使用懒加载）
const HuaMei = () => import('../views/sidebar/HuaMei.vue')
const HuaZhong = () => import('../views/sidebar/HuaZhong.vue')
const JingGuan = () => import('../views/sidebar/JingGuan.vue')
const KeTing = () => import('../views/sidebar/KeTing.vue')
const YingBin = () => import('../views/sidebar/YingBin.vue')
const YuanYi = () => import('../views/sidebar/YuanYi.vue')

const routes = [

  {
    path: '/',
    redirect: '/login1'//重定向
  },
  {
    path: '/main',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/login1',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/login2',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/login3',
    name: 'LoginRegister',
    component: () => import('@/views/LoginRegister.vue')
  },
  {
    path: '/tongcheng',
    name: 'Tongcheng',
    component: Tongcheng
  },
  {
    path: '/miaosha',
    name: 'Miaosha',
    component: MiaoSha
  },
  {
    path: '/classify',
    name: 'ClassifyPage',
    component: ClassifyPage,
    redirect: '/classify/YingBin', // 默认重定向到第一个分类
    children: [
      {
        path: 'huamei',
        name: 'HuaMei',
        component: HuaMei
      },
      {
        path: 'huazhong',
        name: 'HuaZhong',
        component: HuaZhong
      },
      {
        path: 'jingguan',
        name: 'JingGuan', 
        component: JingGuan
      },
      {
        path: 'keting',
        name: 'KeTing',
        component: KeTing
      },
      {
        path: 'yingbin',
        name: 'YingBin',
        component: YingBin
      },
      {
        path: 'yuanyi',
        name: 'YuanYi',
        component: YuanYi
      }
    ]
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/cart',
    name: 'ShoppingCart',
    component: ShoppingCart
  },
  {
    path: '/settings',
    name: 'Setting',
    component: SettingPage
  },
  {
    path: '/product/:productId',
    name: 'ProductDetail',
    component:ProductDetail,
    props: true 
  }
]

// 使用 Vue Router 3.x 语法创建路由实例
const router = new VueRouter({
  mode: 'history', // 替代 createWebHistory()
  base: process.env.BASE_URL,
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 统一从 sessionStorage 获取 token
  const isLogin = sessionStorage.getItem('token') 
  
  // 需要认证的路由
  const authRequired = ['ShoppingCart', 'Setting', 'ProductDetail']
  
  if (authRequired.includes(to.name) && !isLogin) {
    next('/login2')
  } else {
    next()
  }
})

export default router