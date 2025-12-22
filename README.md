
# flower-market-vue

## 项目简介
FlowerMark_Vue 是一款基于 Vue 2 生态开发的 花卉垂直电商前端平台，致力于为用户提供便捷的花卉浏览、筛选、购买及咨询服务。项目采用组件化、工程化开发模式，支持 Mock 数据与真实后端接口无缝切换，适配开发 / 生产双环境，兼具美观性、实用性与可扩展性。
本项目可作为 Vue 2 前端开发实训案例、电商类项目模板，或直接用于花卉行业线上销售场景的前端部署。
## 核心功能
 * 用户模块：账号注册 / 密码登录、个人信息管理（头像更新、昵称修改）、登录状态持久化（localStorage+Vuex）
 * 商品模块：花卉分类展示（画眉、景观等）、商品详情页（图片 / 价格 / 库存）、相关商品推荐、关键词搜索
 * 购物车模块：加入购物车、修改商品数量、删除商品、实时计算总数量 / 总金额、跨页面数据同步
 * 导航与首页：首页轮播图（促销 / 热门商品）、分类导航菜单、面包屑路径追踪、公共组件复用（Header/Footer）
 * 帮助中心：常见问题搜索、分类咨询（订单 / 售后 / 账号）、用户留言反馈功能

## 技术栈
核心框架	Vue 2.x
* UI 组件库	Element UI 2.15.12（快速构建响应式界面）
* 路由管理	Vue Router 3.x（路由配置、权限守卫、路径参数传递）
* 状态管理	Vuex 3.x（模块化拆分：user/cart/product/app）
*　网络请求	Axios（统一封装、请求 / 响应拦截、错误处理）
* 模拟数据	Mock.js（开发环境无后端依赖，快速调试）
* 构建工具	Vue CLI 5（工程化配置、打包优化）
* 样式支持	CSS + Element UI 内置样式（统一设计风格）
* 开发工具	VS Code + Chrome DevTools（调试）

## 快速开始
### 1. 环境准备
Node.js ≥ 14.x（推荐 14.18.0+）
npm ≥ 6.x 或 yarn ≥ 1.22.x
### 2. 克隆仓库
```
git clone https://github.com/kiraxrn/FlowerMark_Vue.git
cd FlowerMark_Vue
```
### 3. 安装依赖
```
#npm 安装
npm install
#或 yarn 安装（推荐，速度更快）
yarn install
```
### 4. 启动开发服务器
```
#开发环境（默认使用 Mock 数据，无需后端）
npm run serve
# 或 yarn
yarn serve
启动成功后，访问 http://localhost:8080 即可进入项目首页。
```
### 5. 打包部署
```
# 生产环境打包（自动切换至真实接口，生成静态文件）
npm run build
```
### 6. 环境切换（Mock ↔ 真实接口）
开发环境默认使用 Mock 数据，配置文件：.env.development
```
VUE_APP_USE_MOCK=true # true=Mock数据，false=真实接口
VUE_APP_BASE_API=/api # 真实接口基础路径（需替换为后端地址）
```
切换至真实接口步骤：
修改 VUE_APP_USE_MOCK=false
替换 VUE_APP_BASE_API 为真实后端接口地址（如 http://localhost:3000/api）
重启开发服务器：npm run serve
### 项目目录结构
FlowerMark_Vue/  

├── public/                # 静态资源（favicon.ico、index.html）  

├── src/  

│   ├── api/               # 接口封装   

│   │   ├── request.js     # Axios 实例配置（拦截器、错误处理）  

│   │   ├── commodityAPI.js# 商品模块接口  

│   │   ├── cartAPI.js     # 购物车模块接口  

│   │   ├── userAPI.js     # 用户模块接口  
 
│   │   └── mock/          # Mock 数据模拟（开发环境）  

│   ├── assets/            # 静态资源（图片、全局样式）  

│   ├── components/        # 公共组件（Header.vue、Footer.vue、Breadcrumb.vue）  

│   ├── router/            # 路由配置  

│   │   └── index.js       # 路由规则、权限守卫  

│   ├── store/             # Vuex 状态管理  

│   │   ├── modules/       # 模块拆分（user.js、cart.js、product.js）  
│   │   └── index.js       # Vuex 实例初始化  
│   ├── views/             # 页面组件  
│   │   ├── MainPage.vue   # 首页     
│   │   ├── ProductDetail.vue # 商品详情页   
│   │   ├── Cart.vue       # 购物车页面  
│   │   ├── Login.vue      # 登录页  
│   │   └── Help.vue       # 帮助中心  
│   ├── App.vue            # 根组件  
│   └── main.js            # 入口文件（Vue 实例初始化）  
├── .env.development       # 开发环境配置  
├── .env.production        # 生产环境配置  
├── package.json           # 依赖配置 + 脚本命令  
└── README.md              # 项目说明文档（本文档）  
### 核心技术亮点
组件化开发：公共组件（Header/Footer）复用，业务组件（商品卡片、购物车项）拆分清晰，降低代码耦合度。  
Vuex 模块化：按功能拆分状态模块，通过 mapGetters/mapActions 简化组件对全局状态的调用，实现跨组件数据共享。  
路由权限控制：全局前置守卫拦截未登录用户访问购物车、结算等页面，自动跳转至登录页并记录返回路径。  
统一 API 封装：Axios 拦截器统一处理请求头、响应格式化、错误提示，支持 Mock / 真实接口无缝切换，开发效率提升。  
状态持久化：登录状态、购物车数据同步至 localStorage，页面刷新后自动恢复，提升用户体验。  
## 开发与贡献
本项目为个人独立开发的实训项目，欢迎 Fork 后二次开发或扩展功能（如添加支付模块、订单管理等）。
若需贡献代码，可按以下步骤提交：
Fork 本仓库   
创建特性分支：git checkout -b feature/xxx   
提交修改：git commit -m "feat: 添加xxx功能"   
推送分支：git push origin feature/xxx   
提交 Pull Request  




