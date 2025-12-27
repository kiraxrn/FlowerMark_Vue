<template>
  <!-- 分类页面内容 -->
  <div class="classify-content">
    <h2>迎宾花卉</h2>
    <div class="breadcrumbs">
      <router-link to="/main">首页</router-link> &gt; 
      <router-link to="/classify">商品分类</router-link> &gt; 迎宾花卉
    </div>
    
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

    <!-- 商品加载状态 -->
    <div v-if="loading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>商品加载中...</p>
    </div>

    <!-- 商品网格 -->
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
              :src="product.imageUrl || product.image || defaultImage" 
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
              :loading="addingCartId === product.id"
            >
              {{ addingCartId === product.id ? '添加中...' : '加入购物车' }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && displayedProducts.length === 0" class="empty-section">
      <div class="empty-icon"></div>
      <p>暂无商品数据</p>
      <el-button type="primary" @click="fetchProducts">重新加载</el-button>
    </div>

    <!-- 分页 -->
    <div v-if="displayedProducts.length > 0" class="pagination-section">
      <el-pagination
        :total="totalProducts"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
        background
      />
    </div>
  </div>
</template>

<script>
// 使用模块分组方式导入
import { commodityAPI } from '../../api/ApiIndex';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ClassifyYingBin',
  data() {
    return {
      // 商品数据
      products: [],
      filteredProducts: [],
      
      // 筛选和排序
      selectedSort: 'price-asc',
      searchKeyword: '',
      
      // 分页
      currentPage: 1,
      pageSize: 12,
      totalProducts: 0,
      
      // 加载状态
      loading: false,
      addingCartId: null,
      
      // 默认图片
      defaultImage: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop'
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    
    displayedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredProducts.slice(start, end);
    },
    
    // 计算用户信息
    userpicture() {
      return this.userInfo?.avatar || '';
    },
    username() {
      return this.userInfo?.username || '';
    }
  },
  mounted() {
    this.fetchUserInfoIfNeeded();
    this.fetchProducts();
  },
  watch: {
    selectedSort() {
      this.applySorting();
    },
    searchKeyword() {
      this.applyFiltering();
    }
  },
  methods: {
    ...mapActions('user', ['fetchUserInfo']),
    ...mapActions('product', ['setCurrentProduct']),
    
    // 获取用户信息
    async fetchUserInfoIfNeeded() {
      const userId = sessionStorage.getItem('userId');
      if (userId && !this.userInfo) {
        await this.fetchUserInfo();
      }
    },
    
    // 获取商品数据
    async fetchProducts() {
      this.loading = true;
      try {
        console.log('=== YingBin.vue 迎宾植物商品数据请求开始 ===');
        console.log('YingBin.vue 调用 commodityAPI.getCommodities()');
        
        // 方法1：获取所有商品然后按分类筛选
        const response = await commodityAPI.getCommodities();
        
        console.log('YingBin.vue API响应数据:', response);
        console.log('YingBin.vue 响应状态码:', response.code);
        console.log('YingBin.vue 响应消息:', response.message);
        console.log('YingBin.vue 响应数据结构:', response.data);
        
        let allProducts = [];
        
        // 响应拦截器已经处理了响应，直接返回了 response.data
        if (response.list) {
          allProducts = response.list;
        } else if (Array.isArray(response)) {
          allProducts = response;
        } else if (response.code === 200) {
          // 如果响应没有被拦截器处理，仍然是完整格式
          if (response.data && response.data.list) {
            allProducts = response.data.list;
          } else if (Array.isArray(response.data)) {
            allProducts = response.data;
          }
        } else {
          // 如果是错误响应，使用备用数据
          throw new Error(response.message || '商品数据加载失败');
        }
        
        console.log('YingBin.vue 所有商品数据:', allProducts);
        
        // 按"迎宾花卉"分类筛选
        this.products = allProducts.filter(item => 
          item.category === '迎宾花卉' || 
          item.category === '迎宾' ||
          item.categoryId === 1  
        );
        
        console.log('YingBin.vue 迎宾植物商品数据加载成功，商品数量:', this.products.length);
        console.log('YingBin.vue 筛选后的商品列表详情:', this.products);
        console.log('YingBin.vue 商品数据结构:', {
          数量: this.products.length,
          第一个商品: this.products[0] || null,
          商品字段: this.products[0] ? Object.keys(this.products[0]) : []
        });
        
        // 如果没有数据，使用备用数据
        if (this.products.length === 0) {
          console.log('YingBin.vue 使用模拟数据');
          this.products = this.useFallbackData();
          console.log('YingBin.vue 模拟商品数据:', this.products);
        }
        
        this.applyFiltering();
        this.applySorting();
        this.totalProducts = this.filteredProducts.length;
      } catch (error) {
        console.error('YingBin.vue 获取迎宾植物商品数据失败:', error);
        console.error('YingBin.vue 错误详情:', {
          消息: error.message,
          响应: error.response,
          状态码: error.response?.status
        });
        
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '商品数据加载失败');
        } else {
          this.$message.error('网络错误，请检查连接');
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('YingBin.vue 使用模拟数据');
          this.products = this.useFallbackData();
          console.log('YingBin.vue 模拟商品数据:', this.products);
          this.$message.info('已使用模拟数据');
        }
      } finally {
        console.log('=== YingBin.vue 迎宾植物商品数据请求结束 ===');
        this.loading = false;
      }
    },
    
    // 应用筛选
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
    
    // 应用排序
    applySorting() {
      const sorted = [...this.filteredProducts];
      
      switch (this.selectedSort) {
        case 'price-asc':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'sales-desc':
          sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0));
          break;
        default:
          break;
      }
      
      this.filteredProducts = sorted;
    },
    
    // 排序商品
    sortProducts(sortType) {
      this.selectedSort = sortType;
    },
    
    // 搜索处理
    handleSearch() {
      this.applyFiltering();
    },
    
    // 分页处理
    handlePageChange(page) {
      this.currentPage = page;
    },
    
    // 商品点击跳转到详情页
    handleProductClick(product) {
      console.log('点击商品:', product);
      // 跳转到商品详情页
      this.$router.push({
        name: 'ProductDetail',
        params: { productId: product.id }
      });
    },
    
    // 添加到购物车
    async addToCart(product) {
      // 检查登录
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        this.$message.warning('请先登录');
        this.$router.push('/login2');
        return;
      }
      
      // 显示添加中状态
      this.addingCartId = product.id;
      
      try {
        // 构建商品数据
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image || product.imageUrl || '',
          quantity: 1,
          category: this.$route.name.replace('Classify', ''), // 自动获取分类
          description: product.description || ''
        };
        
        // 调用 Vuex action
        await this.$store.dispatch('cart/addToCart', cartItem);
        
        this.$message.success(`已将 ${product.name} 加入购物车！`);
      } catch (error) {
        console.error('添加到购物车失败:', error);
        this.$message.error('添加到购物车失败');
      } finally {
        this.addingCartId = null;
      }
    },
    
    // 备用模拟数据
    useFallbackData() {
      return [
        {
          id: 101,
          name: '富贵竹 (5支)',
          price: 29.9,
          image: 'https://images.unsplash.com/photo-1594736797933-d0c64a0d9d43?w=500&h=664&fit=crop',
          description: '象征富贵吉祥，适合迎宾摆放',
          sales: 156,
          categoryId: 1
        },
        {
          id: 102,
          name: '百合花束 (白色, 2头)',
          price: 45.0,
          image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=664&fit=crop',
          description: '纯洁高雅，迎宾首选',
          sales: 89,
          categoryId: 1
        },
        {
          id: 103,
          name: '康乃馨花束 (19支)',
          price: 59.9,
          image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=664&fit=crop',
          description: '温馨祝福，适合各种场合',
          sales: 234,
          categoryId: 1
        },
        {
          id: 104,
          name: '向日葵花束 (3支)',
          price: 35.8,
          image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop',
          description: '阳光热情，给人温暖感觉',
          sales: 178,
          categoryId: 1
        },
        {
          id: 105,
          name: '开业花篮 (一对)',
          price: 198.0,
          image: 'https://images.unsplash.com/photo-1578321272177-44a4a8e5c0d5?w=500&h=664&fit=crop',
          description: '大气豪华，开业庆典专用',
          sales: 67,
          categoryId: 1
        },
        {
          id: 106,
          name: '蝴蝶兰盆栽 (单株)',
          price: 88.0,
          image: 'https://images.unsplash.com/photo-1578321272177-44a4a8e5c0d5?w=500&h=664&fit=crop',
          description: '高贵典雅，长期摆放',
          sales: 92,
          categoryId: 1
        },
        {
          id: 107,
          name: '红掌盆栽',
          price: 65.0,
          image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop',
          description: '热情似火，迎宾佳品',
          sales: 145,
          categoryId: 1
        },
        {
          id: 108,
          name: '发财树盆栽',
          price: 128.0,
          image: 'https://images.unsplash.com/photo-1578326457397-2a7b4c1a5c5b?w=500&h=664&fit=crop',
          description: '招财进宝，寓意美好',
          sales: 203,
          categoryId: 1
        }
      ];
    }
  }
};
</script>

<style scoped>
/* 分类页面特定样式 */
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

.breadcrumbs {
  font-size: 14px;
  color: #666;
  margin: 10px 0 20px;
}

.breadcrumbs a {
  color: #4CAF50;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
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

/* 加载状态 */
.loading-section {
  text-align: center;
  padding: 50px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #19be6b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  color: #999;
  font-size: 14px;
}

.image-error i,
.image-loading i {
  font-size: 24px;
  margin-bottom: 8px;
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
  height: 32px;
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
  margin: 0;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
  margin-right: 5px;
}

.seckill-price {
  color: #e4393c;
  font-weight: bold;
  font-size: 18px;
}

.sales {
  color: #999;
  font-size: 12px;
  margin: 0;
}

.cart-btn {
  width: 100%;
  background-color: #19be6b;
  border-color: #19be6b;
  color: white;
  font-weight: bold;
  transition: all 0.3s;
}

.cart-btn:hover {
  background-color: #0fa86b;
  border-color: #0fa86b;
  transform: translateY(-2px);
}

.cart-btn:active {
  transform: translateY(0);
}

/* 空状态 */
.empty-section {
text-align: center;
padding: 60px 20px;
color: #999;
}

.empty-section .ivu-icon {
margin-bottom: 16px;
color: #ccc;
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

.search-box {
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