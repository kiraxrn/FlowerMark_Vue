const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  // 开发环境服务器配置（端口、自动打开页面等）
  devServer: {
    port: 8082, // 自定义端口号
    open: true, // 启动项目后自动打开浏览器
    host: '0.0.0.0', // 允许局域网内其他设备访问（可选，默认 localhost）
  }
}