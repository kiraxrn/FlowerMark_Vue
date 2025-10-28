<template>
    <div class="main1">
      <!-- 头部组件 -->
      <Header/>
      
      <div class="main2">
        <!-- 侧边栏组件 -->
        <Sidebar />
        
        <!-- 主内容区 -->
        <div class="group3">
          <!-- 轮播图组件 -->
          <Carousel />
          
          <!-- 商品列表组件 -->
          <ProductList :commodities="commodities" />
        </div>
      </div>
      
      <!-- 页脚组件 -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue'
  import Sidebar from '../components/Sidebar.vue'
  import Carousel from '../components/Carousel.vue'
  import ProductList from '../components/ProductList.vue'
  import Footer from '../components/Footer.vue'
  
  export default {
    components: {
      Header,
      Sidebar,
      Carousel,
      ProductList,
      Footer
    },
    data() {
      return {
        // 模拟商品数据，实际项目中从API获取
        commodities: [
          { comId: 1, comName: '示例花卉1', price: 29.9, comPicture: '../assets/img/flower1.jpg' },
          { comId: 2, comName: '示例花卉2', price: 39.9 },
          { comId: 3, comName: '示例植物1', price: 59.9 },
          { comId: 4, comName: '示例植物2', price: 45 },
          { comId: 5, comName: '园艺工具套装', price: 89 },
          { comId: 6, comName: '花种组合', price: 19.9 }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  /* 主容器样式继承原CSS */
  .main2 {
    display: flex;
    height: calc(100vh - 200px);
    background: #FCFCE3;
  }
  .group3 {
    flex: 1;
    margin: 20px;
    background: #D9EBEE;
    border-radius: 15px;
    padding: 20px;
    overflow-y: auto;
  }
  </style>