<template>
  <div class="classify-content">
    <h2>画眉</h2>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-custom">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/classify' }">商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>画眉</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 筛选和排序 -->
    <div class="filters-section">
      <div class="filters">
        <span>排序：</span>
        <el-radio-group v-model="selectedSort" size="small" @change="applySorting">
          <el-radio-button label="price-asc">价格从低到高</el-radio-button>
          <el-radio-button label="price-desc">价格从高到低</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 加载状态 -->
    <el-skeleton :loading="loading" animated :count="8" :throttle="500">
      <template slot="template">
        <div class="skeleton-grid">
          <el-skeleton-item variant="image" style="width: 100%; height: 200px;" />
          <div style="padding: 14px;">
            <el-skeleton-item variant="h3" style="width: 80%; margin-bottom: 8px;" />
            <el-skeleton-item variant="text" style="width: 60%;" />
            <el-skeleton-item variant="button" style="width: 100%; margin-top: 10px; height: 32px;" />
          </div>
        </div>
      </template>
      
      <!-- 商品网格 -->
      <template>
        <div v-if="displayedProducts.length === 0" class="empty-state">
          <el-empty description="暂无商品数据">
            <el-button type="primary" @click="fetchProducts">重新加载</el-button>
          </el-empty>
        </div>
        
        <div v-else class="products-grid">
          <el-card 
            v-for="product in displayedProducts" 
            :key="product.id"
            class="product-card"
            :body-style="{ padding: '15px' }"
            shadow="hover"
          >
            <div class="product-link" @click="handleProductClick(product)">
              <div class="product-image">
                <el-image 
                  :src="product.imageUrl" 
                  :alt="product.name"
                  fit="cover"
                  class="product-img"
                  lazy
                >
                  <div slot="error" class="image-error">
                    <i class="el-icon-picture-outline"></i>
                    <span>加载失败</span>
                  </div>
                  <div slot="placeholder" class="image-loading">
                    <i class="el-icon-loading"></i>
                  </div>
                </el-image>
                
                <!-- 商品标签 -->
                <div v-if="product.isSeckill || product.isNew" class="product-tags">
                  <el-tag v-if="product.isSeckill" type="danger" size="mini">秒杀</el-tag>
                  <el-tag v-if="product.isNew" type="success" size="mini">新品</el-tag>
                </div>
              </div>
              
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                
                <div class="product-description" v-if="product.description">
                  <p>{{ product.description }}</p>
                </div>
                
                <div class="product-meta">
                  <div class="price-section">
                    <p class="price">
                      <template v-if="product.isSeckill">
                        <span class="original-price">¥{{ (product.price || 0).toFixed(2) }}</span>
                        <span class="seckill-price">¥{{ (product.seckillPrice || 0).toFixed(2) }}</span>
                      </template>
                      <template v-else>
                        <span>¥{{ (product.price || 0).toFixed(2) }}</span>
                      </template>
                    </p>
                    <p v-if="product.sales" class="sales">已售{{ product.sales }}件</p>
                  </div>
                </div>
                
                <el-button 
                  type="success" 
                  class="cart-btn"
                  @click.stop="addToCart(product)"
                  icon="el-icon-shopping-cart-1"
                  size="small"
                >
                  加入购物车
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </template>
    </el-skeleton>
    
    <!-- 分页 -->
    <div v-if="!loading && displayedProducts.length > 0 && totalProducts > pageSize" class="pagination-section">
      <el-pagination
        :total="totalProducts"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        :page-sizes="[12, 24, 36, 48]"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { commodityAPI } from '../../api/ApiIndex';

export default {
  name: 'ClassifyHuamei',
  data() {
    return {
      selectedSort: 'price-asc',
      searchKeyword: '',
      products: [],
      loading: false,
      filteredProducts: [],
      // 分页
      currentPage: 1,
      pageSize: 12,
      totalProducts: 0,
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    
    displayedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      const source = this.filteredProducts.length > 0 ? this.filteredProducts : this.products;
      return source.slice(start, end);
    },
    
    userpicture() {
      return this.userInfo?.avatar || ''
    },
    username() {
      return this.userInfo?.username || ''
    },
  },
  mounted() {
    this.fetchUserInfoIfNeeded();
    this.fetchProducts();
  },
  watch: {
    selectedSort() {
      this.applySorting();
    },
  },
  methods: {
    ...mapActions('user', ['fetchUserInfo']),
    ...mapActions('product', ['setCurrentProduct']),
    
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
    
    addToCart(product) {
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        this.$message.warning('请先登录')
        this.$router.push('/login2')
        return
      }
      
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.seckillPrice || product.price,
        imageUrl: product.imageUrl || '',
        quantity: 1,
        category: this.$route.name.replace('Classify', ''),
        description: product.description || ''
      }
      
      this.$store.dispatch('cart/addToCart', cartItem)
      this.$message.success(`已将 ${product.name} 加入购物车！`)
    },
    
    async fetchUserInfoIfNeeded() {
      const userId = sessionStorage.getItem('userId')
      if (userId && !this.userInfo) {
        await this.fetchUserInfo()
      }
    },
    
    async fetchProducts() {
      this.loading = true;
      try {
        console.log('=== HuaMei.vue 花美商品数据请求开始 ===');
        console.log('HuaMei.vue 调用 commodityAPI.getCommoditiesByCategory(5)');
        
        const response = await commodityAPI.getCommoditiesByCategory(5);
        
        console.log('HuaMei.vue API响应数据:', response);
        console.log('HuaMei.vue 响应状态码:', response.code);
        console.log('HuaMei.vue 响应消息:', response.message);
        console.log('HuaMei.vue 响应数据结构:', response.data);
        
        let products = [];
        
        // 响应拦截器已经处理了响应，直接返回了 response.data
        if (response.list) {
          products = response.list;
        } else if (Array.isArray(response)) {
          products = response;
        } else if (response.code === 200) {
          // 如果响应没有被拦截器处理，仍然是完整格式
          if (response.data.list) {
            products = response.data.list;
          } else if (Array.isArray(response.data)) {
            products = response.data;
          } else {
            products = [response.data];
          }
        } else {
          // 如果是错误响应，使用备用数据
          throw new Error(response.message || '商品数据加载失败');
        }
        
        this.products = products.map(item => ({
          ...item,
          imageUrl: item.imageUrl || item.image || item.comPicture || item.picture || '',
          price: Number(item.price) || 0
        }));
        
        console.log('HuaMei.vue 花美商品数据加载成功，商品数量:', this.products.length);
        console.log('HuaMei.vue 商品列表详情:', this.products);
        console.log('HuaMei.vue 商品数据结构:', {
          数量: this.products.length,
          第一个商品: this.products[0] || null,
          商品字段: this.products[0] ? Object.keys(this.products[0]) : []
        });
        
        // 应用筛选和排序
        this.applyFiltering();
        this.applySorting();
        this.totalProducts = this.filteredProducts.length;
        this.currentPage = 1;
        
        console.log('HuaMei.vue filteredProducts:', this.filteredProducts);
        console.log('HuaMei.vue displayedProducts:', this.displayedProducts);
      } catch (error) {
        console.error('HuaMei.vue 获取花美商品数据失败:', error);
        console.error('HuaMei.vue 错误详情:', {
          消息: error.message,
          响应: error.response,
          状态码: error.response?.status
        });
        
        this.$message.error('商品数据加载失败');
        this.useFallbackData();
      } finally {
        console.log('=== HuaMei.vue 花美商品数据请求结束 ===');
        this.loading = false;
      }
    },
    
    applySorting() {
      if (!this.filteredProducts.length) return;
      
      const sorted = [...this.filteredProducts];
      
      switch (this.selectedSort) {
        case 'price-asc':
          sorted.sort((a, b) => (a.seckillPrice || a.price) - (b.seckillPrice || b.price));
          break;
        case 'price-desc':
          sorted.sort((a, b) => (b.seckillPrice || b.price) - (a.seckillPrice || a.price));
          break;
        default:
          break;
      }
      
      this.filteredProducts = sorted;
    },
    
    applyFiltering() {
      let filtered = [...this.products];
      
      // 关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(keyword) ||
          (product.description && product.description.toLowerCase().includes(keyword))
        );
      }
      
      this.filteredProducts = filtered;
      this.totalProducts = filtered.length;
      this.currentPage = 1; // 重置到第一页
      this.applySorting();
    },
    
    useFallbackData() {
      this.products = [
        { 
          id: 501, 
          name: '画眉鸟 (成年公鸟)', 
          price: 280.0, 
          seckillPrice: 220.0,
          imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop',
          description: '健康成年公画眉鸟，鸣声洪亮，品相优良',
          sales: 25,
          isSeckill: true,
          isNew: true
        },
        { 
          id: 502, 
          name: '画眉幼鸟', 
          price: 150.0, 
          imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=664&fit=crop',
          description: '健康活泼的画眉幼鸟，易于驯养',
          sales: 18
        },
        { 
          id: 503, 
          name: '精品画眉笼', 
          price: 120.0, 
          imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=664&fit=crop',
          description: '优质竹制画眉笼，透气性好',
          sales: 32
        },
        { 
          id: 504, 
          name: '画眉专用饲料', 
          price: 35.0, 
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0c64a0d9d43?w=500&h=664&fit=crop',
          description: '营养均衡的画眉专用饲料',
          sales: 56
        },
        { 
          id: 505, 
          name: '画眉洗澡笼', 
          price: 65.0, 
          imageUrl: 'https://images.unsplash.com/photo-1578321272177-44a4a8e5c0d5?w=500&h=664&fit=crop',
          description: '专用洗澡笼，方便实用',
          sales: 24
        },
        { 
          id: 506, 
          name: '画眉保健砂', 
          price: 18.0, 
          imageUrl: 'https://images.unsplash.com/photo-1578326457397-2a7b4c1a5c5b?w=500&h=664&fit=crop',
          description: '补充矿物质，促进消化',
          sales: 45
        },
      ];
      this.filteredProducts = [...this.products];
      this.totalProducts = this.filteredProducts.length;
      this.applySorting();
    },
    
    handlePageChange(page) {
      this.currentPage = page;
    },
    
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
  }
}
</script>

<style scoped>
.classify-content {
  padding: 20px;
  background: #ffdcdc;
  border-radius: 8px;
  min-height: 600px;
}
.classify-content h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
  border-left: 4px solid #19be6b;
  padding-left: 10px;
}
/* 页面头部 */
.page-header {
  margin-bottom: 10px;
}

/* 面包屑样式 */
.breadcrumb-custom {
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumb-custom >>> .el-breadcrumb__inner {
  color: #4CAF50;
}

.breadcrumb-custom >>> .el-breadcrumb__inner:hover {
  color: #19be6b;
  cursor: pointer;
}

.breadcrumb-custom >>> .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #666;
  cursor: default;
}

/* 筛选区域 */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fcfce3;
  border-radius: 6px;
  flex-wrap: wrap;
  gap: 15px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filters span {
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

/* 排序按钮样式优化 */
:deep(.el-radio-button__inner) {
  border-radius: 20px !important;
  padding: 8px 16px !important;
}

/* 默认状态按钮样式 */
:deep(.el-radio-button:not(.is-active) .el-radio-button__inner) {
  background-color: #f8fffe;
  border-color: #19be6b;
  color: #19be6b;
  transition: all 0.3s;
}

:deep(.el-radio-button:not(.is-active):hover .el-radio-button__inner) {
  background-color: #e8f8f4;
  border-color: #0fa86b;
  color: #0fa86b;
}

/* 选中状态按钮样式 */
:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background-color: #19be6b;
  border-color: #19be6b;
  color: white;
}

:deep(.el-radio-button.is-active:hover .el-radio-button__inner) {
  background-color: #0fa86b;
  border-color: #0fa86b;
}
/* 骨架屏样式 */
.skeleton-grid {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  height: 100%;
  transition: transform 0.3s;
  border-radius: 8px;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-link {
  display: block;
  text-decoration: none;  
  color: #e4393c;
  height: 100%;
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.image-error,
.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
  color: #999;
}

.image-error i,
.image-loading i {
  font-size: 40px;
  margin-bottom: 10px;
}

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.product-info {
  padding: 15px 0 0;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  height: 44px;
}

.product-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  margin-bottom: 15px;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #e4393c;
  font-weight: bold;
  font-size: 18px;
  margin: 0;
}

.original-price {
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
  margin-right: 8px;
}

.seckill-price {
  color: #e4393c;
}

.sales {
  color: #999;
  font-size: 12px;
  margin: 0;
}

.cart-btn {
  width: 100%;
  background-color: #19be6b !important;
  border-color: #19be6b !important;
  color: white !important;
}

.cart-btn:hover {
  background-color: #0fa86b !important;
  border-color: #0fa86b !important;
}

/* 分页 */
.pagination-section {
  margin-top: 30px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    justify-content: center;
  }

  .filter-actions {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .classify-content {
    padding: 15px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>