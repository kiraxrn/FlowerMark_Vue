<template>
  <div class="classify-content">
    <h2>景观植物</h2>
    <div class="breadcrumbs">
      <router-link to="/main">首页</router-link> &gt; 
      <router-link to="/classify">商品分类</router-link> &gt; 景观植物
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

    <!-- 商品网格 -->
    <div class="products-grid">
      <div class="product-item" v-for="product in displayedProducts" :key="product.id">
        <el-card class="product-card" :padding="0" shadow="hover">
          <div class="product-link" @click="handleProductClick(product)">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-meta">
                <p class="price">¥{{ product.price.toFixed(2) }}</p>
              </div>
              <el-button 
                type="success" 
                long 
                icon="el-icon-shopping-cart-1" 
                @click.stop="addToCart(product)"
              >
                加入购物车
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
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
import { mapState, mapActions } from 'vuex';
import { commodityAPI } from '../../api/ApiIndex'; 
  
export default {
  name: 'ClassifyJingguan',
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
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
  
      sortedProducts() {
      
        return this.filteredProducts.length > 0 ? this.filteredProducts : this.products;
      },
      
      // 分页显示的商品
      displayedProducts() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        // 使用 sortedProducts 
        return this.sortedProducts.slice(start, end);
      },
      
      userpicture() {
        return this.userInfo?.avatar || ''
      },
      username() {
        return this.userInfo?.username || ''
      }
  },
  mounted() {
    this.fetchUserInfo();
    this.fetchProducts();
  },
  methods: {
    ...mapActions('user', ['fetchUserInfo']),
    ...mapActions('product', ['setCurrentProduct']),
    async fetchUserInfoIfNeeded() {
        const userId = sessionStorage.getItem('userId')
        if (userId && !this.userInfo) {
          await this.fetchUserInfo()
        }
      },
      
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
      
      // 获取商品数据
      async fetchProducts() {
        this.loading = true;
        try {
          console.log('=== JingGuan.vue 景观商品数据请求开始 ===');
          console.log('JingGuan.vue 调用 commodityAPI.getCommoditiesByCategory(2)');
          
          const response = await commodityAPI.getCommoditiesByCategory(2);
          
          console.log('JingGuan.vue API响应数据:', response);
          console.log('JingGuan.vue 响应状态码:', response.code);
          console.log('JingGuan.vue 响应消息:', response.message);
          console.log('JingGuan.vue 响应数据结构:', response.data);
          
          let products = [];
          
          // 响应拦截器已经处理了响应，直接返回了 response.data
          if (response.list) {
            products = response.list;
          } else if (Array.isArray(response)) {
            products = response;
          } else if (response.code === 200) {
            // 如果响应没有被拦截器处理，仍然是完整格式
            products = response.data.list || response.data;
          } else {
            // 如果是错误响应，使用备用数据
            throw new Error(response.message || '商品数据加载失败');
          }
          
          // 同时设置 products 和 filteredProducts
          this.products = products;
          this.filteredProducts = [...this.products]; // 初始化 filteredProducts
          
          console.log('JingGuan.vue 景观商品数据加载成功，商品数量:', this.products.length);
          console.log('JingGuan.vue 商品列表详情:', this.products);
          console.log('JingGuan.vue 商品数据结构:', {
            数量: this.products.length,
            第一个商品: this.products[0] || null,
            商品字段: this.products[0] ? Object.keys(this.products[0]) : []
          });
          
          // 应用排序
          this.applySorting();
          
          // 更新总数
          this.totalProducts = this.filteredProducts.length;
        } catch (error) {
          console.error('JingGuan.vue 获取景观商品数据失败:', error);
          console.error('JingGuan.vue 错误详情:', {
            消息: error.message,
            响应: error.response,
            状态码: error.response?.status
          });
          
          this.$message.error('商品数据加载失败');
          // 使用模拟数据
          this.products = this.useFallbackData();
          this.filteredProducts = [...this.products]; // 初始化 filteredProducts
          this.applySorting();
          this.totalProducts = this.filteredProducts.length;
        } finally {
          console.log('=== JingGuan.vue 景观商品数据请求结束 ===');
          this.loading = false;
        }
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
        this.totalProducts = sorted.length; // 更新总数
        this.currentPage = 1; // 排序后回到第一页
      },
      
      // 排序商品 - 修复：调用 applySorting
      sortProducts(sortType) {
        this.selectedSort = sortType;
        this.applySorting(); // 应用排序
      },
      
      // 搜索处理
      handleSearch() {
        this.applyFiltering();
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
        this.applySorting(); // 应用排序
      },
      
      // 分页处理
      handlePageChange(page) {
        this.currentPage = page;
      },
      
      addToCart(product) {
        // 检查登录
        const userId = sessionStorage.getItem('userId')
        if (!userId) {
          this.$Message.warning('请先登录')
          this.$router.push('/login2')
          return
        }
        
        // 构建商品数据
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image || '',
          quantity: 1,
          category: this.$route.name.replace('Classify', ''),
          description: product.description || ''
        }
        
        // 使用 Vuex action
        this.$store.dispatch('cart/addToCart', cartItem)
        
        this.$Message.success(`已将 ${product.name} 加入购物车！`)
      },
      
      // 备用数据
      useFallbackData() {
        return[
          { id: 201, name: '罗汉松盆栽', price: 128.0, imageUrl: 'https://img1.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664' },
          { id: 202, name: '五针松景观树', price: 298.0, imageUrl: 'https://img2.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664' },
          { id: 203, name: '红叶石楠球', price: 88.0, imageUrl: 'https://img3.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664' },
          { id: 204, name: '金叶女贞绿篱', price: 45.0, imageUrl: 'https://img4.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664' },
          { id: 205, name: '紫薇树', price: 188.0, imageUrl: 'https://img5.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664' },
          { id: 206, name: '桂花树苗', price: 68.0, imageUrl: 'https://img6.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664' },
        ]
       
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

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-item {
  transition: transform 0.3s;
}

.product-item:hover {
  transform: translateY(-5px);
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
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
  height: 44px;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price {
  color: #e4393c;
  font-weight: bold;
  font-size: 18px;
  margin: 0;
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