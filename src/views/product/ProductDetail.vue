<template>
  <div class="product-page">
    <!-- 使用统一的头部组件 -->
    <AppHeader :user-name="username" :user-picture="userpicture" />

    <main class="productmain2">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-section">
        <div style="text-align: center; padding: 50px;">
          <i class="el-icon-loading" style="font-size: 24px; margin-right: 8px;"></i>
          <div>商品详情加载中...</div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-section">
        <el-alert type="error" show-icon>
          商品详情加载失败
          <template #description>{{ error }}</template>
        </el-alert>
        <el-button type="primary" @click="fetchCommodityDetail" icon="el-icon-refresh">
          重新加载
        </el-button>
      </div>

      <!-- 商品详情内容 -->
      <div v-else-if="commodity" class="product-container">
        <!-- 面包屑导航 -->
        <div class="breadcrumbs">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="`/classify/${commodity.categoryId}`">
              {{ commodity.categoryName || '商品分类' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ commodity.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="product-layout">
          <!-- 商品图片 -->
          <div class="product-image-section">
            <div class="product-image">
              <div class="main-image">
                <img 
                  :src="currentImage || commodity.image || defaultImage" 
                  :alt="commodity.name"
                  class="main-product-image"
                >
                <div v-if="commodity.sales > 100" class="hot-badge">热销</div>
                <div v-if="commodity.stock === 0" class="sold-out-badge">已售罄</div>
              </div>
              <div class="thumbnail-images" v-if="commodity.images && commodity.images.length > 0">
                <img 
                  v-for="(img, index) in commodity.images" 
                  :key="index"
                  :src="img" 
                  :alt="`${commodity.name} ${index + 1}`"
                  class="thumbnail" 
                  :class="{ active: currentImage === img }"
                  @click="changeImage(img)"
                >
              </div>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="product-info-section">
            <div class="product-info">
              <h1 class="product-title">{{ commodity.name }}</h1>
              <p class="product-description">{{ commodity.description }}</p>
              
              <div class="price-section">
              <span class="current-price">¥{{ formattedPrice }}</span>
              <span v-if="commodity.originalPrice" class="original-price">
                ¥{{ commodity.originalPrice.toFixed(2) }}
              </span>
              <el-tag v-if="commodity.originalPrice" type="danger" class="discount-tag">
                省¥{{ (commodity.originalPrice - commodity.price).toFixed(2) }}
              </el-tag>
            </div>

              <div class="product-meta">
                <div class="meta-item">
                  <span class="label">商品编号：</span>
                  <span class="value">{{ commodity.id }}</span>
                </div>
                <div class="meta-item">
                  <span class="label">销量：</span>
                  <span class="value">{{ commodity.sales || 0 }}件</span>
                </div>
                <div class="meta-item">
                  <span class="label">库存：</span>
                  <span class="value" :class="{ 'stock-warning': commodity.stock < 10 }">
                    {{ commodity.stock }}件
                  </span>
                </div>
                <div class="meta-item" v-if="commodity.specifications">
                  <span class="label">材质：</span>
                  <span class="value">{{ commodity.specifications.material }}</span>
                </div>
                <div class="meta-item" v-if="commodity.specifications">
                  <span class="label">包装：</span>
                  <span class="value">{{ commodity.specifications.package }}</span>
                </div>
                <div class="meta-item" v-if="commodity.specifications">
                  <span class="label">配送：</span>
                  <span class="value">{{ commodity.specifications.delivery }}</span>
                </div>
                <div class="meta-item" v-if="commodity.specifications">
                  <span class="label">保鲜：</span>
                  <span class="value">{{ commodity.specifications.freshness }}</span>
                </div>
              </div>

              <!-- 购买数量 -->
              <div class="quantity-section">
                <span class="label">数量：</span>
                <el-input-number 
                  v-model="quantity" 
                  :min="1" 
                  :max="commodity.stock"
                  :disabled="commodity.stock === 0"
                  size="large"
                ></el-input-number>
                <span class="stock-info">库存{{ commodity.stock }}件</span>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <el-button 
                  type="danger" 
                  size="large" 
                  icon="el-icon-shopping-cart" 
                  :loading="addingToCart"
                  :disabled="!isAvailable || addingToCart"
                  @click="addToCart"
                  class="cart-btn"
                >
                  {{ addingToCart ? '添加中...' : (isAvailable ? '加入购物车' : '已售罄') }}
                </el-button>
                <el-button 
                  type="primary" 
                  size="large" 
                  icon="el-icon-shopping-bag-1" 
                  :disabled="!isAvailable"
                  @click="buyNow"
                  class="buy-btn"
                >
                  {{ isAvailable ? '立即购买' : '已售罄' }}
                </el-button>
              </div>

              <!-- 服务承诺 -->
              <div class="service-promise">
                <div class="service-item">
                  <i class="el-icon-success" style="color: #19be6b; margin-right: 8px;"></i>
                  <span>正品保证</span>
                </div>
                <div class="service-item">
                  <i class="el-icon-success" style="color: #19be6b; margin-right: 8px;"></i>
                  <span>快速配送</span>
                </div>
                <div class="service-item">
                  <i class="el-icon-success" style="color: #19be6b; margin-right: 8px;"></i>
                  <span>无忧退换</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="product-detail-section">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="商品详情" name="detail">
                <div class="detail-content">
                  <p v-if="commodity.details">{{ commodity.details }}</p>
                  <div v-else class="no-detail">
                    <i class="el-icon-info" style="font-size: 24px; margin-right: 8px;"></i>
                    <p>暂无商品详情信息</p>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="规格参数" name="specs">
                <div class="specs-content">
                  <div v-if="commodity.specifications" class="specs-list">
                    <div class="spec-item" v-for="(value, key) in commodity.specifications" :key="key">
                      <span class="spec-label">{{ getSpecLabel(key) }}：</span>
                      <span class="spec-value">{{ value }}</span>
                    </div>
                  </div>
                  <div v-else class="no-specs">
                    <i class="el-icon-tickets" style="font-size: 24px; margin-right: 8px;"></i>
                    <p>暂无规格参数信息</p>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

        <!-- 相关商品 -->
        <div class="related-products" v-if="relatedProducts.length > 0">
          <h3 class="section-title">相关推荐</h3>
          <div class="related-products-grid">
            <div 
              v-for="product in relatedProducts" 
              :key="product.id"
              class="related-product-item"
            >
              <el-card class="related-product-card" :padding="0" shadow="hover">
                <router-link :to="`/product/${product.id}`" class="related-product-link">
                  <div class="related-product-image">
                    <img :src="product.image || defaultImage" :alt="product.name">
                  </div>
                  <div class="related-product-info">
                    <h4 class="related-product-name">{{ product.name }}</h4>
                    <p class="related-product-price">¥{{ product.price.toFixed(2) }}</p>
                  </div>
                </router-link>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 使用统一的底部组件 -->
    <AppFooter />
  </div>
</template>

<script>
// 使用模块分组方式导入
import { commodityAPI, cartAPI, userAPI } from '../../api/ApiIndex';
import AppHeader from '../../components/Header.vue';
import AppFooter from '../../components/Footer.vue';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductDetail',
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      // 本地状态
      currentImage: '',
      quantity: 1,
      activeTab: 'detail',
      
      // 相关商品
      relatedProducts: [],
      
      // 用户信息
      username: '',
      userpicture: '',
      
      // 加载状态
      addingToCart: false,
      
      // 默认图片
      defaultImage: 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664'
    };
  },
  computed: {
    // 从Vuex获取状态
    ...mapState('product', {
      commodity: 'currentProduct'
    }),
    ...mapGetters('product', {
      loading: 'isLoading',
      error: 'getError'
    }),
    
    formattedPrice() {
      // 双重检查确保安全
      if (!this.commodity || this.commodity.price === undefined || this.commodity.price === null) {
        return '0.00';
      }
      const price = Number(this.commodity.price);
      if (isNaN(price)) {
        return '0.00';
      }
      return price.toFixed(2);
    },
    isAvailable() {
      return this.commodity && this.commodity.stock > 0;
    },
    isDevelopment() {
      return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';
    },
  },
  props: {
  productId: {
    type: [String, Number],
    required: true
  }
  },
  mounted() {
    console.log('ProductDetail mounted, productId:', this.$route.params.productId);
    console.log('当前Vuex中的商品数据:', this.commodity);
    this.fetchUserInfo();
    
    // 优化数据获取逻辑：如果Vuex中已有商品数据，优先使用；否则再调用API
    if (this.commodity && this.commodity.id) {
      console.log('使用Vuex中已有的商品数据:', this.commodity);
      this.currentImage = this.commodity.image;
      this.fetchRelatedProducts();
    } else {
      console.log('Vuex中无商品数据，调用API获取');
      this.fetchCommodityDetail();
    }
  },
  methods: {
    // 从Vuex获取actions
    ...mapActions('product', [
      'setCurrentProduct',
      'clearCurrentProduct',
      'setLoading',
      'setError'
    ]),
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const response = await userAPI.getUserInfo(userId);
          // 检查 response 是否存在
          if (response && response.code === 200) {
            this.username = response.data?.username || '';
            this.userpicture = response.data?.avatar || '';
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },

    // 获取商品详情 
    async fetchCommodityDetail() {
      this.setLoading(true);
      this.setError(null);
      
      // 优先使用 props，其次使用路由参数
      const productId = this.productId || this.$route.params.productId;
      
      if (!productId) {
        this.setError('商品ID未指定');
        this.setLoading(false);
        return;
      }
      
      console.log('正在获取商品ID为:', productId, '的商品详情');
      console.log('路由参数:', this.$route.params);
      console.log('组件props:', this.productId);
      
      try {
        const response = await commodityAPI.getCommodityDetail(productId);
        
        // 检查 response 是否存在
        if (!response) {
          throw new Error('服务器未返回有效响应');
        }
        
        console.log('API返回数据:', response);
        
        if (response.code === 200) {
          // 验证返回的数据结构
          let commodityData;
          if (Array.isArray(response.data)) {
            // 如果返回的是数组，取第一个元素
            commodityData = response.data[0] || this.getMockProductDetail();
            console.log('返回数组数据，取第一个元素:', commodityData);
          } else if (typeof response.data === 'object' && response.data !== null) {
            commodityData = response.data;
            console.log('返回对象数据:', commodityData);
          } else {
            console.error('返回的商品数据格式不正确:', response.data);
            throw new Error('返回的商品数据格式不正确');
          }
          
          // 确保必要属性存在
          commodityData = {
            price: 0,
            stock: 0,
            sales: 0,
            ...commodityData
          };
          
          console.log('处理后的商品数据:', commodityData);
          
          // 保存到Vuex
          this.setCurrentProduct(commodityData);
          this.currentImage = commodityData.image;
          
          // 加载相关商品
          this.fetchRelatedProducts();
          
          console.log('商品详情加载成功，当前商品:', this.commodity);
          this.$message.success('商品详情加载成功');
        } else {
          console.error('API返回错误码:', response.code, '错误信息:', response.message);
          const errorMsg = response.message || '商品详情加载失败';
          this.setError(errorMsg);
          this.$message.error(errorMsg);
          
          // API调用失败时，如果Vuex中已有数据，保持原有数据
          if (!this.commodity) {
            // 如果Vuex中无数据，使用模拟数据
            if (this.isDevelopment) {
              console.log('API失败且Vuex无数据，使用模拟数据');
              const mockData = this.getMockProductDetail();
              this.setCurrentProduct(mockData);
              this.currentImage = mockData.image;
              this.fetchRelatedProducts();
              this.$message.info('已使用模拟数据');
            }
          }
        }
      } catch (error) {
        console.error('获取商品详情失败:', error);
        // 检查 error 是否存在
        const errorMsg = error?.message || '商品详情加载失败';
        this.setError(errorMsg);
        this.$message.error(errorMsg);
        
        // API调用失败时，如果Vuex中已有数据，保持原有数据
        if (!this.commodity) {
          // 开发环境下使用备用数据
          if (this.isDevelopment) {
            console.log('API失败且Vuex无数据，使用模拟数据');
            const mockData = this.getMockProductDetail();
            this.setCurrentProduct(mockData);
            this.currentImage = mockData.image;
            this.fetchRelatedProducts();
            this.$message.info('已使用模拟数据');
          }
        } else {
          console.log('API调用失败，但Vuex中已有商品数据，保持显示');
        }
      } finally {
        this.setLoading(false);
      }
    },

    // 获取相关商品
    async fetchRelatedProducts() {
      try {
        if (this.commodity && this.commodity.relatedProducts) {
          this.relatedProducts = this.commodity.relatedProducts;
        } else {
          // 如果没有相关商品数据，获取同分类商品
          const categoryId = this.commodity?.categoryId || 1;
          const response = await commodityAPI.getCommoditiesByCategory(categoryId);
          if (response.code === 200) {
            this.relatedProducts = (response.data.list || response.data)
              .filter(product => product.id !== this.productId)
              .slice(0, 4);
          }
        }
      } catch (error) {
        console.error('获取相关商品失败:', error);
        // 使用备用相关商品数据
        this.relatedProducts = this.getMockRelatedProducts();
      }
    },

    // 切换图片
    changeImage(imgSrc) {
      this.currentImage = imgSrc;
    },

    // 添加到购物车
    async addToCart() {
      if (!this.commodity) return;
      
      this.addingToCart = true;
      try {
        const cartData = {
          productId: this.commodity.id,
          productName: this.commodity.name,
          price: this.commodity.price,
          quantity: this.quantity,
          image: this.commodity.image,
          description: this.commodity.description || this.commodity.name // 添加描述字段
        };

        const response = await cartAPI.addToCart(cartData);
        
        // 检查 response 是否存在
        if (response && response.code === 200) {
          this.$message.success(response.message || '商品已成功加入购物车');
        } else {
          this.$message.error(response?.message || '加入购物车失败');
        }
      } catch (error) {
        console.error('添加到购物车失败:', error);
        
        if (error?.response && error.response.data) {
          this.$message.error(error.response.data.message || '加入购物车失败');
        } else {
          this.$message.error('网络错误，请检查连接');
        }
      } finally {
        this.addingToCart = false;
      }
    },

    // 立即购买
    buyNow() {
      if (!this.commodity || this.commodity.stock === 0) return;
      
      this.$router.push({
        path: '/checkout',
        query: { 
          productId: this.commodity.id,
          quantity: this.quantity
        }
      });
    },

    // 获取规格标签
    getSpecLabel(key) {
      const labels = {
        material: '材质',
        package: '包装',
        delivery: '配送',
        freshness: '保鲜'
      };
      return labels[key] || key;
    },

    // 备用商品详情数据
    getMockProductDetail() {
      return {
        id: this.productId,
        name: '精美花束',
        price: 99.99,
        originalPrice: 129.99,
        image: this.defaultImage,
        images: [this.defaultImage],
        description: '这是一束精美的鲜花，适合各种场合赠送',
        details: '商品详情描述，包括花材介绍、养护方法、配送说明等详细信息。',
        categoryId: 1,
        categoryName: '鲜花',
        sales: 156,
        stock: 50,
        specifications: {
          material: '新鲜花材',
          package: '精美礼盒包装',
          delivery: '全国包邮',
          freshness: '保证新鲜'
        },
        relatedProducts: this.getMockRelatedProducts()
      };
    },

    // 备用相关商品数据
    getMockRelatedProducts() {
      return [
        { id: 201, name: '红玫瑰花束', price: 88.88, image: this.defaultImage },
        { id: 202, name: '百合花束', price: 128.00, image: this.defaultImage },
        { id: 203, name: '康乃馨花束', price: 66.66, image: this.defaultImage },
        { id: 204, name: '向日葵花束', price: 99.99, image: this.defaultImage }
      ];
    }
  }
};
</script>

<style scoped>
@import '../../assets/css/product.css';

.productmain2 {
  padding: 20px;
  background: #FCFCE3;
  border-radius: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.product-container {
    display: flex;
    border-radius: 8px;
    box-shadow: 0 2px 10px #C2F1D1;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background: #D9EBEE;
    flex-wrap: wrap;
    flex-direction: column
}

.product-layout {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.product-image-section {
  flex: 0 0 40%;
  min-width: 300px;
}

.product-info-section {
  flex: 1;
  min-width: 300px;
}
.loading-section, .error-section {
  text-align: center;
  padding: 50px;
}

.breadcrumbs {
  margin-bottom: 20px;
}

.product-image {
  margin-bottom: 20px;
}

.main-image {
  position: relative;
  margin-bottom: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.main-product-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.hot-badge, .sold-out-badge {
  position: absolute;
  top: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
}

.hot-badge {
  left: 10px;
  background: #ff4d4f;
}

.sold-out-badge {
  right: 10px;
  background: #999;
}

.thumbnail-images {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

.thumbnail.active {
  border-color: #1890ff;
}

.thumbnail:hover {
  border-color: #40a9ff;
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.product-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.price-section {
  margin-bottom: 20px;
}

.current-price {
  font-size: 28px;
  color: #e4393c;
  font-weight: bold;
  margin-right: 10px;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  margin-right: 10px;
}

.discount-tag {
  vertical-align: top;
}

.product-meta {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.meta-item {
  margin-bottom: 8px;
  display: flex;
}

.meta-item .label {
  color: #666;
  min-width: 80px;
}

.meta-item .value {
  color: #333;
}

.stock-warning {
  color: #ff4d4f;
}

.quantity-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.quantity-section .label {
  font-weight: bold;
  color: #333;
}

.stock-info {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.cart-btn, .buy-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

.service-promise {
  display: flex;
  gap: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.product-detail-section {
  margin-top: 40px;
}

.detail-content, .specs-content {
  padding: 20px;
  min-height: 200px;
}

.no-detail, .no-specs {
  text-align: center;
  color: #999;
  padding: 40px;
}

.specs-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.spec-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.spec-label {
  color: #666;
  min-width: 80px;
}

.spec-value {
  color: #333;
}

.related-products {
  margin-top: 40px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.related-product-item {
  margin-bottom: 16px;
}

.related-product-card {
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.related-product-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.related-product-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.related-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.related-product-card:hover .related-product-image img {
  transform: scale(1.05);
}

.related-product-info {
  padding: 12px;
}

.related-product-name {
  font-size: 14px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
  line-height: 1.4;
}

.related-product-price {
  color: #e4393c;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 15px;
    margin: 10px;
  }
  
  .main-product-image {
    height: 300px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .service-promise {
    flex-direction: column;
    gap: 10px;
  }
}
</style>