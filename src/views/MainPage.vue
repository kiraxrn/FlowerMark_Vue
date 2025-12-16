<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部区域 -->
      <el-header height="230px" class="custom-header">
        <AppHeader 
          :user-picture="userpicture" 
          :user-name="username" 
        />
      </el-header>
      
      <el-container class="main-content">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="custom-aside">
            <AppSidebar />
        </el-aside>
        
        <el-container>
          <!-- 主内容区 -->
          <el-main class="custom-main">
            <div v-if="isHomePage" class="home-content">
              <!-- Element UI 轮播图 -->
              <div class="carousel-section">
                <el-carousel 
                  :interval="3000" 
                  height="300px" 
                  indicator-position="outside"
                  class="el-carousel-container"
                >
                  <el-carousel-item v-for="(img, index) in carouselImages" :key="index">
                    <img :src="img" class="carousel-image" :alt="'轮播图 ' + (index + 1)" />
                  </el-carousel-item>
                </el-carousel>
              </div>
              
              <!-- 商品展示区域 -->
              <div class="products-section">
                <div class="products-title">热门商品</div>
                <el-row :gutter="16" class="products-grid">
                  <el-col 
                    v-for="commodity in displayedCommodities" 
                    :key="commodity.id"
                    :xs="12" :sm="8" :md="6" :lg="6"
                    class="product-col"
                  >
                    <el-card class="product-item" :body-style="{ padding: '0' }" shadow="hover">
                      <div @click="handleProductClick(commodity)" class="product-link cursor-pointer">
                        <div class="product-image-container">
                          <img
                            :src="commodity.image || defaultImage"
                            :alt="commodity.name"
                            class="product-image"
                            @error="handleProductImageError(commodity)"
                          />
                        </div>
                        <div class="product-info">
                          <p class="product-name">{{ commodity.name }}</p>
                          <p class="product-price">¥{{ commodity.price.toFixed(2) }}</p>
                          <p class="product-sales">销量: {{ commodity.sales }}</p>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                
                <!-- 加载更多按钮 -->
                <div class="load-more-section" v-if="commodities.length > 6 && !showAll">
                  <el-button type="primary" ghost long @click="showAllProducts">
                    查看全部商品
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 分类页面内容 -->
            <router-view v-else></router-view>
          </el-main>
          
         
        </el-container>
      </el-container>
       <!-- 页脚 -->
      <el-footer height="60px" class="custom-footer">
        <AppFooter />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { commodityAPI, userAPI } from '../api/ApiIndex';
import AppHeader from '../components/Header.vue';
import AppSidebar from '../components/Sidebar.vue';
import AppFooter from '../components/Footer.vue';
import { 
  Container, Header, Aside, Main, Footer,
  Carousel, CarouselItem, Row, Col, Card, Button
} from 'element-ui';

export default {
  name: 'MainPage',
  components: { 
    AppHeader, 
    AppSidebar, 
    AppFooter,
    [Container.name]: Container,
    [Header.name]: Header,
    [Aside.name]: Aside,
    [Main.name]: Main,
    [Footer.name]: Footer,
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem,
    [Row.name]: Row,
    [Col.name]: Col,
    [Card.name]: Card,
    [Button.name]: Button
  },
  data() {
    return {
      userpicture: null,
      username: null,
      searchQuery: '',
      carouselImages: [
        'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
        require('../assets/img/pexels-aditya-aiyar-615049-1407325.jpg'),
        require('../assets/img/pexels-billelmoula-542517.jpg'),
        require('../assets/img/pexels-hieu-641561.jpg'),
        require('../assets/img/pexels-pixabay-46166.jpg'),
        require('../assets/img/pexels-roshan-kamath-793618-1661179.jpg'),
        require('../assets/img/pexels-suzyhazelwood-1578105.jpg'),
      ],
      currentSlide: 0,
      commodities: [],
      defaultImage: 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
      showAll: false,
      loading: false
    };
  },
  computed: {
    isHomePage() {
      return (
        this.$route.path === '/' ||
        this.$route.path === '/main' ||
        !this.$route.path.startsWith('/classify')
      );
    },
    displayedCommodities() {
      return this.showAll ? this.commodities : this.commodities.slice(0, 6);
    },
  },
  mounted() {
    console.log('Carousel 组件:', this.$options.components.Carousel);
    console.log('CarouselItem 组件:', this.$options.components.CarouselItem);
    
    // 检查轮播图图片
    this.carouselImages.forEach((img, index) => {
      const testImage = new Image();
      testImage.onload = () => console.log(`图片 ${index} 加载成功:`, img);
      testImage.onerror = () => console.error(`图片 ${index} 加载失败:`, img);
      testImage.src = img;
    });
    
    this.fetchCommodities();
    this.fetchUserInfo();
  },
  methods: {
    // 从Vuex获取actions
    ...mapActions('product', [
      'setCurrentProduct'
    ]),
    
    // 商品卡片点击事件处理函数
    handleProductClick(commodity) {
      // 保存到Vuex
      this.setCurrentProduct(commodity);
      
      // 手动跳转到商品详情页
      this.$router.push({
        name: 'ProductDetail',
        params: { productId: commodity.id.toString() }
      });
    },
    
    async fetchCommodities() {
      this.loading = true;
      try {
        console.log('=== MainPage.vue 商品数据请求开始 ===');
        const response = await commodityAPI.getCommodities();
        
        console.log('MainPage.vue API响应数据:', response);
        console.log('MainPage.vue 响应状态码:', response.code);
        console.log('MainPage.vue 响应消息:', response.message);
        console.log('MainPage.vue 响应数据结构:', response.data);
        
        if (response.code === 200) {
          this.commodities = response.data.list || response.data;
          console.log('MainPage.vue 商品数据加载成功，商品数量:', this.commodities.length);
          console.log('MainPage.vue 商品列表详情:', this.commodities);
          this.$message.success(response.message || '商品数据加载成功');
        } else {
          console.warn('MainPage.vue 商品数据加载失败，状态码:', response.code);
          this.$message.error(response.message || '商品数据加载失败');
        }
      } catch (error) {
        console.error('MainPage.vue 获取商品数据失败:', error);
        console.error('MainPage.vue 错误详情:', {
          message: error.message,
          response: error.response,
          status: error.response?.status
        });
        
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '商品数据加载失败');
        } else {
          this.$message.error('网络错误，请检查连接');
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('MainPage.vue 使用模拟数据');
          this.commodities = this.getMockCommodities();
          console.log('MainPage.vue 模拟商品数据:', this.commodities);
          this.$message.info('已使用模拟数据');
        }
      } finally {
        console.log('=== MainPage.vue 商品数据请求结束 ===');
        this.loading = false;
      }
    },
    
    async fetchUserInfo() {
      try {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const response = await userAPI.getUserInfo(userId);
          
          if (response.code === 200) {
            this.userpicture = response.data.avatar;
            this.username = response.data.username;
          } else {
            this.$message.error(response.message || '用户信息加载失败');
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '用户信息加载失败');
        } else {
          this.$message.error('网络错误，请检查连接');
        }
        
        if (process.env.NODE_ENV === 'development') {
          this.username = '测试用户';
          this.userpicture = 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664';
        }
      }
    },
    
    getMockCommodities() {
      return [
        {
          id: 1,
          name: '红玫瑰花束',
          price: 99.99,
          image: 'https://img2.baidu.com/it/u=123456789,987654321&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
          sales: 156
        },
        {
          id: 2,
          name: '白百合花束',
          price: 149.99,
          image: 'https://img2.baidu.com/it/u=123456789,987654321&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
          sales: 89
        },
        { 
          id: 3, 
          name: '康乃馨花束', 
          image: '', 
          price: 79.9,
          sales: 120 
        },
        { 
          id: 4, 
          name: '向日葵花束', 
          image: '', 
          price: 199,
          sales: 67 
        },
        { 
          id: 5, 
          name: '多肉植物组合', 
          image: '', 
          price: 259,
          sales: 234 
        },
        { 
          id: 6, 
          name: '满天星干花', 
          image: '', 
          price: 89,
          sales: 178 
        },
        { 
          id: 7, 
          name: '蓝色妖姬', 
          image: '', 
          price: 299,
          sales: 45 
        },
        { 
          id: 8, 
          name: '郁金香花束', 
          image: '', 
          price: 169,
          sales: 92 
        }
      ];
    },
    
    showAllProducts() {
      this.showAll = true;
      this.$message.info('已显示全部商品');
    },
    
    handleCarouselImageError(event) {
      console.error('轮播图图片加载失败:', event.target.src);
      event.target.src = 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=300&fit=crop';
    },
    
    handleProductImageError(commodity) {
      console.error('商品图片加载失败:', commodity.name);
      commodity.image = this.defaultImage;
    },
  }
};
</script>

<style scoped>
.common-layout {
  min-height: 100vh;
  background-color: #C2F1D1;
  margin: 0;
  padding: 0;
  width: 100%;
}
.custom-aside {
    display: flex;
    height: auto;
}
/* 头部样式 */
.custom-header {
  padding: 0 !important;
  margin: 0;
  height: auto !important;
  background-color: transparent;
}

/* 主要内容区容器 */
.main-content {
  min-height: calc(100vh - 290px); /* 头部230px + 页脚60px */
  background: #FCFCE3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-aside {
    width: 100% !important;
    margin: 10px;
    display: flex;
    height: auto;
  }
  
  .sidebar-scrollbar {
    padding: 15px;
  }
}

/* 主内容区样式 */
.custom-main {
  background: #D9EBEE;
  border-radius: 15px;
  margin: 20px;
  padding: 20px;
  overflow: auto;
}

/* 首页内容容器 */
.home-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

/* Element UI 轮播图样式 */
.carousel-section {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.el-carousel-container {
  width: 100%;
  max-width: 800px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.el-carousel__item {
  border-radius: 10px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* 商品区域 */
.products-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.products-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.products-grid {
  margin: 0 -8px;
}

.product-col {
  margin-bottom: 16px;
}

/* Element UI 卡片样式 */
.el-card.product-item {
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.el-card.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* 图片容器 */
.product-image-container {
  width: 100%;
  height: 180px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  padding: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.el-card.product-item:hover .product-image {
  transform: scale(1.05);
}

/* 商品信息 */
.product-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-price {
  color: #e4393c;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}

.product-sales {
  color: #999;
  font-size: 12px;
}

.load-more-section {
  margin-top: 20px;
  text-align: center;
}

/* 页脚样式 */
:deep .custom-footer {
  padding: 0 !important;
  background-color: transparent;
  height: 60px !important;
  line-height: 60px;
}

/* 响应式设计 */
@media (max-width: 986px) {
   /* 小屏专用折叠按钮（固定在页面角落） */
   .mobile-collapse-btn {
    position: fixed;
    left: 10px;
    top: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #67c23a;
    color: white;
    border: none;
    z-index: 1001; /* 高于侧边栏 */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  /* 半透明遮罩（展开时显示） */
  .sidebar-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    display: none;
  }
}
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .custom-aside {
    width: 100% !important;
    margin: 10px;
    min-width: auto;
    display: flex; 
    height: 100%;
  }
  
  .custom-main {
    margin: 10px;
    width: calc(100% - 20px);
  }
  
  .carousel-image {
    height: 200px;
  }
  
  .el-carousel-container {
    height: 200px;
  }
  
  .el-card.product-item {
    height: 250px;
  }
  
  .product-image-container {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .el-card.product-item {
    height: 220px;
  }
  
  .product-image-container {
    height: 130px;
  }
  
  .carousel-image {
    height: 180px;
  }
  
  .el-carousel-container {
    height: 180px;
  }
}
</style>