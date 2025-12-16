// 环境配置
const config = {
    // 开发环境配置
    development: {
      baseURL: process.env.VUE_APP_API_BASE_URL || '/api', // 默认使用 Mock
      useMock: process.env.VUE_APP_USE_MOCK !== 'false', // 默认启用 Mock
      mockBaseURL: '/api', // Mock 接口前缀
      realBaseURL: process.env.VUE_APP_REAL_API_BASE_URL || 'http://localhost:3000/api' // 真实接口地址
    },
    // 生产环境配置
    production: {
      baseURL: process.env.VUE_APP_API_BASE_URL || 'http://your-production-api.com/api',
      useMock: false, // 生产环境默认不使用 Mock
      mockBaseURL: '/api',
      realBaseURL: process.env.VUE_APP_API_BASE_URL || 'http://your-production-api.com/api'
    }
  }
  
  const env = process.env.NODE_ENV || 'development'
  export default config[env]