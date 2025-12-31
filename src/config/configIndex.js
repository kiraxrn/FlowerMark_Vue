// 环境配置
// src/config/configIndex.js
const config = {
  // 开发环境：默认启用 Mock
  development: {
    baseURL: process.env.VUE_APP_API_BASE_URL || '/api', 
    useMock: process.env.VUE_APP_USE_MOCK !== 'false', // Mock 开关核心
    mockBaseURL: '/api', 
    realBaseURL: process.env.VUE_APP_REAL_API_BASE_URL || 'http://localhost:3000/api'
  },
  // 生产环境：默认关闭 Mock
  production: {
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://your-production-api.com/api',
    useMock: false, // 生产环境禁用 Mock
    realBaseURL: process.env.VUE_APP_API_BASE_URL || 'http://your-production-api.com/api'
  }
}
  
  const env = process.env.NODE_ENV || 'development'
  export default config[env]