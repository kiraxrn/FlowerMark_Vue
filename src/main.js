import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'
import AppSidebar from './components/Sidebar.vue'
import store from './store'

// 全局配置
Vue.prototype.$axios = axios
Vue.prototype.$Swal = Swal

// 全局注册组件
Vue.component('AppHeader', AppHeader)
Vue.component('AppFooter', AppFooter)
Vue.component('AppSidebar', AppSidebar)

// 注册使用 ElementUI
Vue.use(ElementUI)

// 在开发环境中引入 Mock
if (process.env.NODE_ENV === 'development') {
  require('./mock/mock')
  console.log('Mock 数据已启用')
}

// 根据环境设置不同的 baseURL
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || '/api'

// 添加请求拦截器处理token
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器处理错误
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 未授权，跳转到登录页
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('token')
      router.push('/login2')
      
      // 使用 ElementUI 的 Message
      ElementUI.Message.error('登录已过期，请重新登录')
    }
    return Promise.reject(error)
  }
)

// 检查登录状态并设置全局变量
const checkAuthStatus = () => {
  const token = sessionStorage.getItem('token')
  const userId = sessionStorage.getItem('userId')
  return !!(token && userId)
}

Vue.prototype.$isAuthenticated = checkAuthStatus
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')