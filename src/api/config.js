// src/api/config.js
import axios from 'axios'

// 环境检测函数 - 简化
export const isMockEnabled = () => {
  // 可以根据需要修改，比如根据环境变量
  return process.env.NODE_ENV === 'development' || true;
}

// 创建 axios 实例
const api = axios.create({
  baseURL: isMockEnabled() ? '/api' : '', // Mock 环境统一添加 /api 前缀
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 简化逻辑
api.interceptors.request.use(
  (config) => {
    // 添加请求时间戳（防缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // 添加 token
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加自定义 header 标识（可选）
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//响应拦截器
api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.config.url, response.data);
    
    // 重要：检查 response.data 的结构
    // 如果已经是 {code, data, message} 格式，直接返回
    if (response.data && 
        typeof response.data === 'object' && 
        (response.data.code !== undefined || response.data.status !== undefined)) {
      return response.data; // 返回业务数据
    }
    
    // 否则返回完整的 response，让调用方自己处理
    return response;
  },
  error => {
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  }
);
export default api