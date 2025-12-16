# flower-market-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
开发时默认使用 Mock：无需额外配置

连接真实后端：

在浏览器控制台执行：APISwitch.switchToReal()

或修改 .env.development 中的 VUE_APP_USE_MOCK=false

切换回 Mock：

在浏览器控制台执行：APISwitch.switchToMock()

自动检测：调用 APISwitch.autoSwitch() 自动选择可用环境
