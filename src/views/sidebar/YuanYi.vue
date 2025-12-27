<template>
  <div class="classify-content">
    <h2>园艺工具</h2>
    <div class="breadcrumbs">
      <router-link to="/main">首页</router-link> &gt; 
      <router-link to="/classify">商品分类</router-link> &gt; 园艺工具
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
    <!-- 分页 -->
    <div v-if="displayedProducts.length > 0" class="pagination-section">
    <Page 
      :total="totalProducts" 
      :page-size="pageSize"
      :current="currentPage"
      @on-change="handlePageChange"
      show-total
      show-elevator
    />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { commodityAPI } from '../../api/ApiIndex'; 

export default {
  name: 'ClassifyYuanyi',
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
        defaultImage: 'https://via.placeholder.com/300x300?text=商品图片'
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
          const response = await commodityAPI.getCommoditiesByCategory(6);
          
          if (response.code === 200) {
            // 同时设置 products 和 filteredProducts
            this.products = response.data.list || response.data;
            this.filteredProducts = [...this.products]; // 初始化 filteredProducts
            
            console.log('花种商品数据:', this.products);
            
            // 应用排序
            this.applySorting();
            
            // 更新总数
            this.totalProducts = this.filteredProducts.length;
          } else {
            this.$Message.error(response.message || '商品数据加载失败');
          }
        } catch (error) {
          console.error('获取商品数据失败:', error);
          this.$Message.error('商品数据加载失败');
          // 使用模拟数据
          this.products = this.useFallbackData();
          this.filteredProducts = [...this.products]; // 初始化 filteredProducts
          this.applySorting();
          this.totalProducts = this.filteredProducts.length;
        } finally {
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
          imageUrl: product.imageUrl || '',
          quantity: 1,
          category: this.$route.name.replace('Classify', ''),
          description: product.description || ''
        }
        
        // 使用 Vuex action
        this.$store.dispatch('cart/addToCart', cartItem)
        
        this.$Message.success(`已将 ${product.name} 加入购物车！`)
      },
      
      // 备用数据
      useFallbackData(){
        return[ 
          { id: 701, name: '园艺剪刀套装', price: 45.0, imageUrl: 'https://img1.baidu.com/it/u=1709512703,905139419&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667' },
          { id: 702, name: '不锈钢小铲子', price: 28.0, imageUrl: 'https://t13.baidu.com/it/u=1613253233,607855048&fm=224&app=112&f=JPEG?w=500&h=500' },
          { id: 703, name: '浇水壶 (2L)', price: 35.0, imageUrl: 'https://img1.baidu.com/it/u=3795178662,1030497591&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
          { id: 704, name: '园艺手套 (加厚)', price: 15.0, imageUrl: 'https://t15.baidu.com/it/u=2785683822,415327082&fm=224&app=112&f=JPEG?w=500&h=500' },
          { id: 705, name: '植物修剪锯', price: 58.0, imageUrl: 'https://img0.baidu.com/it/u=3229667949,3535090277&fm=253&fmt=auto&app=138&f=JPEG?w=514&h=500' },
          { id: 706, name: '园艺工具套装 (8件套)', price: 128.0, imageUrl: 'https://t14.baidu.com/it/u=93636103,1687264570&fm=224&app=112&f=JPEG?w=500&h=500' },]
      },
    },
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