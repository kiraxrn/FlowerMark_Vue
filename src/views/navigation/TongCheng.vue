<template>
  <div class="page-container">
    <AppHeader 
      :user-picture="userpicture" 
      :user-name="username" 
    />
 
    <div class="navigationmain2">
      <AppSidebar />
      
      <!-- 主内容区 -->
      <div id='group3' class='navigationgroup3'>
        <!-- 搜索和筛选区域 -->
        <div class="filter-section">
          <div class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="搜索商品..."
              class="search-input"
              clearable
              @keyup.enter.native="handleSearch"
            >
              <el-button 
                slot="append" 
                icon="el-icon-search" 
                @click="handleSearch"
                type="primary"
              >
                搜索
              </el-button>
            </el-input>
          </div>
          <div class="filter-options">
            <el-select 
              v-model="sortBy" 
              placeholder="排序方式" 
              style="width: 150px" 
              @change="handleSortChange"
              clearable
            >
              <el-option value="default" label="默认排序"></el-option>
              <el-option value="price_asc" label="价格从低到高"></el-option>
              <el-option value="price_desc" label="价格从高到低"></el-option>
              <el-option value="sales_desc" label="销量最高"></el-option>
            </el-select>
            
            <el-select 
              v-model="categoryFilter" 
              placeholder="商品分类" 
              style="width: 150px" 
              @change="handleCategoryChange"
              clearable
            >
              <el-option value="all" label="全部分类"></el-option>
              <el-option 
                v-for="category in categories" 
                :key="category" 
                :value="category"
                :label="category"
              ></el-option>
            </el-select>
            
            <el-button 
              @click="resetFilters" 
              class="sort-btn"
              icon="el-icon-refresh"
            >
              重置筛选
            </el-button>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="commodities-grid">
          <el-card 
            class="commodity-card" 
            v-for="commodity in paginatedCommodities" 
            :key="commodity.id"
            :body-style="{ padding: 0 }"
            shadow="hover"
          >
            <div class="commodity-image-container">
              <img 
                :src="commodity.image || 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664'"
                :alt="commodity.name"
                class="commodity-image"
              >
              <div class="commodity-overlay">
                <el-button 
                  type="primary" 
                  class="quick-view-btn" 
                  @click="handleQuickView(commodity)"
                  icon="el-icon-view"
                  size="small"
                >
                  快速查看
                </el-button>
              </div>
              <el-tag v-if="commodity.isNew" type="danger" class="new-tag">新品</el-tag>
              <el-tag v-if="commodity.discount" type="warning" class="discount-tag">{{ commodity.discount }}折</el-tag>
            </div>
            <div class="commodity-info">
              <router-link :to="`/product/${commodity.id}`" class="commodity-link">
                <h3 class="commodity-title">{{ commodity.name }}</h3>
              </router-link>
              <p class="commodity-description">{{ commodity.description }}</p>
              
              <div class="commodity-price-section">
                <span class="commodity-price">{{ '￥' + formatPrice(commodity.price) }}</span>
                <span v-if="commodity.originalPrice" class="commodity-original-price">
                  {{ '￥' + formatPrice(commodity.originalPrice) }}
                </span>
              </div>
              
              <div class="commodity-meta">
                <div class="commodity-stats">
                  <el-tag class="category-tag">{{ commodity.category }}</el-tag>
                  <div class="sales-info">
                    <i class="el-icon-shopping-cart-1"></i>
                    <span>销量: {{ commodity.sales }}</span>
                  </div>
                </div>
                <div class="commodity-actions">
                  <el-button 
                    type="danger" 
                    size="small" 
                    icon="el-icon-shopping-cart-2"
                    class="add-to-cart-btn"
                    @click="handleAddToCart(commodity)"
                    :loading="addingCartId === commodity.id"
                  >
                    加入购物车
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        
        <!-- 空状态 -->
        <el-empty
          v-if="commodities.length === 0 && !loading"
          description="暂无商品"
          class="empty-container"
        >
          <el-button type="primary" @click="fetchCommodities">重新加载</el-button>
        </el-empty>
        
        <!-- 分页 -->
        <div class="pagination-container" v-if="commodities.length > 0">
          <el-pagination
            :current-page="currentPage"
            :total="commodities.length"
            :page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
            background
          />
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-content">
            <i class="el-icon-loading loading-icon"></i>
            <p>正在加载商品...</p>
          </div>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import AppHeader from '../../components/Header.vue';
import AppFooter from '../../components/Footer.vue';
import AppSidebar from '../../components/Sidebar.vue';
import { commodityAPI } from '../../api/ApiIndex';

export default {
  name: 'TongCheng',
  components: {
    AppHeader,
    AppFooter,
    AppSidebar
  },
  data() {
    return {
      searchQuery: '',
      commodities: [],
      loading: false,
      error: null,
      sortBy: '',
      categoryFilter: '',
      categories: [],
      currentPage: 1,
      addingCartId: null,
      pageSize: 12
    };
  },
  computed: {
    paginatedCommodities() {
      let filtered = [...this.commodities];
      
      if (this.categoryFilter && this.categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === this.categoryFilter);
      }
      
      switch (this.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'sales_desc':
          filtered.sort((a, b) => b.sales - a.sales);
          break;
        default:
          break;
      }
      
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return filtered.slice(start, end);
    },
    userpicture() {
      return this.$store.state.user.userInfo?.avatar || ''
    },
    username() {
      return this.$store.state.user.userInfo?.username || ''
    },
    ...mapState('cart', ['cartItems', 'cartTotal']),
    ...mapGetters('cart', ['checkedItems', 'checkedTotal']),
  },
  mounted() {
    this.fetchCommodities();
    this.fetchUserInfoIfNeeded();
  },
  methods: {
    ...mapActions('user', ['fetchUserInfo']),
    ...mapActions('product', ['setCurrentProduct']),
    ...mapActions('cart', [
      'addToCart', 
      'updateQuantity', 
      'removeFromCart',
      'toggleCheck',
      'clearCart'
    ]),
    
    // 获取用户信息
    async fetchUserInfoIfNeeded() {
      const userId = sessionStorage.getItem('userId')
      if (userId && !this.$store.state.user.userInfo) {
        await this.fetchUserInfo()
      }
    },
    
    formatPrice(price) {
      return Number(price).toFixed(2);
    },
    
    async fetchCommodities() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('=== TongCheng.vue 商品数据请求开始 ===');
        console.log('TongCheng.vue 调用 commodityAPI.getRandomCommodities(12)');
        
        // 使用随机商品API
        const response = await commodityAPI.getRandomCommodities(12);
        
        console.log('TongCheng.vue API完整响应:', response); 
        console.log('TongCheng.vue 响应类型:', typeof response);
        console.log('TongCheng.vue 响应是否为对象:', response && typeof response === 'object');
        
        // 检查响应结构
        if (!response) {
          console.error('TongCheng.vue API响应为空');
          throw new Error('API响应为空');
        }
        
        // 根据实际的 API 响应结构调整
        let commoditiesData = [];
        
        // 情况1: Mock API 直接返回 {list, pagination}
        if (response.list && Array.isArray(response.list)) {
          commoditiesData = response.list;
          console.log('TongCheng.vue 使用 response.list, 数量:', commoditiesData.length);
        } 
        // 情况2: 包含 data 属性且 data 有 list
        else if (response.data && response.data.list) {
          commoditiesData = response.data.list;
          console.log('TongCheng.vue 使用 data.list, 数量:', commoditiesData.length);
        }
        // 情况3: data 直接是数组
        else if (Array.isArray(response.data)) {
          commoditiesData = response.data;
          console.log('TongCheng.vue 使用 data 数组, 数量:', commoditiesData.length);
        }
        // 情况4: 标准 API 格式
        else if (response.code === 200 && response.data) {
          console.log('TongCheng.vue 使用标准 API 格式，状态码:', response.code);
          // 如果 data 是数组
          if (Array.isArray(response.data)) {
            commoditiesData = response.data;
          }
          // 如果 data 是对象且包含 list
          else if (response.data.list) {
            commoditiesData = response.data.list;
          }
          console.log('TongCheng.vue 使用标准 API 格式, 数量:', commoditiesData.length);
        }
        // 情况5: 响应本身就是数组
        else if (Array.isArray(response)) {
          commoditiesData = response;
          console.log('TongCheng.vue 使用 response 数组, 数量:', commoditiesData.length);
        }
        else {
          console.warn('TongCheng.vue 无法识别的响应结构:', response);
          // 尝试提取任何可能的数据
          commoditiesData = response.data || response.list || [];
          console.log('TongCheng.vue 尝试提取数据, 数量:', commoditiesData.length);
        }
        
        this.commodities = commoditiesData;
        console.log('TongCheng.vue 最终商品数据:', this.commodities);
        console.log('TongCheng.vue 商品数据结构:', {
          数量: this.commodities.length,
          第一个商品: this.commodities[0] || null,
          商品字段: this.commodities[0] ? Object.keys(this.commodities[0]) : []
        });
        
        // 从商品数据中提取分类
        if (this.commodities.length > 0) {
          const uniqueCategories = [...new Set(this.commodities.map(item => item.category))].filter(Boolean);
          this.categories = uniqueCategories;
          console.log('TongCheng.vue 提取的分类:', this.categories);
        } else {
          console.warn('TongCheng.vue 商品列表为空');
          this.$message.warning('暂无商品数据');
        }
      } catch (err) {
        console.error('TongCheng.vue 获取商品数据失败:', err);
        console.error('TongCheng.vue 错误详情:', {
          消息: err.message,
          堆栈: err.stack,
          响应: err.response
        });
        this.error = '获取商品数据失败，请稍后重试';
        
        // 使用本地 Mock 数据
        console.log('TongCheng.vue 使用本地 Mock 数据作为回退');
        this.useLocalMockData();
        this.$message.error('网络错误，使用本地数据');
      } finally {
        console.log('=== TongCheng.vue 商品数据请求结束 ===');
        this.loading = false;
        console.log('TongCheng.vue 商品加载完成，loading状态:', this.loading);
      }
    },
    
    async fetchUserInfo() {
      try {
        const userId = sessionStorage.getItem('userId');
        if (userId && this.$store.state.user.userInfo) {
          await this.fetchUserInfo();
        }
      } catch (err) {
        console.error('获取用户信息失败:', err);
      }
    },
    
    async handleSearch() {
      if (!this.searchQuery.trim()) {
        await this.fetchCommodities();
        return;
      }

      this.loading = true;
      try {
        const response = await commodityAPI.searchCommodities(this.searchQuery);
        
        if (response.code === 200) {
          this.commodities = response.data || [];
          this.$message.success(`找到 ${response.data.length} 个相关商品`);
        } else {
          this.error = response.message || '搜索失败';
          this.$message.error('搜索失败');
        }
      } catch (err) {
        console.error('搜索失败:', err);
        this.error = '搜索失败，请稍后重试';
        this.$message.error('搜索失败');
      } finally {
        this.loading = false;
      }
    },
    
    handleQuickView(commodity) {
      // 保存到Vuex
      this.setCurrentProduct(commodity);
      
      // 手动跳转到商品详情页
      this.$router.push({
        name: 'ProductDetail',
        params: { productId: commodity.id.toString() }
      });
    },
    
    async handleAddToCart(product) {
      try {
        // 先检查用户是否登录
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          this.$message.warning('请先登录');
          this.$router.push('/login2');
          return;
        }
        
        // 设置加载状态
        this.addingCartId = product.id;
        
        // 构建商品数据
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image || product.imageUrl,
          quantity: 1,
          category: product.category,
          description: product.description || ''
        };
        
        // 使用 Vuex action
        await this.$store.dispatch('cart/addToCart', cartItem);
        
        this.$message.success('商品已添加到购物车');
      } catch (error) {
        console.error('添加到购物车失败:', error);
        this.$message.error('添加到购物车失败');
      } finally {
        this.addingCartId = null;
      }
    },
    
    handlePageChange(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    
    handleSortChange() {
      this.currentPage = 1;
    },
    
    handleCategoryChange() {
      this.currentPage = 1;
    },
    
    resetFilters() {
      this.sortBy = '';
      this.categoryFilter = '';
      this.searchQuery = '';
      this.currentPage = 1;
      this.fetchCommodities();
    },
    
    // 添加本地 Mock 数据 fallback
    useLocalMockData() {
      const localMockCommodities = [
        {
          id: 1,
          name: '红玫瑰花束',
          price: 199,
          category: '鲜花',
          categoryId: 1,
          image: 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
          description: '新鲜红玫瑰花束，寓意爱情',
          sales: 100,
          stock: 50
        },
        {
          id: 2,
          name: '百合花',
          price: 159,
          category: '鲜花',
          categoryId: 1,
          image: 'https://img2.baidu.com/it/u=123456789,987654321&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
          description: '清新百合花，象征纯洁',
          sales: 80,
          stock: 30
        },
        {
          id: 3,
          name: '康乃馨',
          price: 89,
          category: '鲜花',
          categoryId: 1,
          image: 'https://img2.baidu.com/it/u=234567890,876543210&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
          description: '温馨康乃馨，适合送母亲',
          sales: 60,
          stock: 40
        }
      ];
      
      this.commodities = localMockCommodities;
      const uniqueCategories = [...new Set(localMockCommodities.map(item => item.category))].filter(Boolean);
      this.categories = uniqueCategories;
    }
  }
};
</script>

<style scoped>
@import '../../assets/css/navigation.css';

/* 主内容区 */
.navigationmain2 {
  display: flex;
  flex: 1;
  background: #FCFCE3; 
  min-height: calc(100vh - 120px);
  width: 100%;
  margin: 0;
  padding: 0;
}

.navigationgroup3 {
  background: #F6BE8C;
  border-radius: 15px;
  flex: 1;
  margin: 0px 20px 20px 20px;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
}

/* 筛选区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #FCFCE3;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  border-radius: 4px;
}

.filter-options {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sort-btn {
  border-color: #67c23a;
  color: #67c23a;
}

.sort-btn:hover {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

/* 商品网格布局 */
.commodities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 0;
}

/* 商品卡片 */
.commodity-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #ebeef5;
}

.commodity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #f56c6c;
}

/* 商品图片容器 */
.commodity-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

/* 商品图片样式 */
.commodity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.commodity-card:hover .commodity-image {
  transform: scale(1.05);
}

/* 图片悬停遮罩 */
.commodity-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.commodity-card:hover .commodity-overlay {
  opacity: 1;
}

/* 快速查看按钮样式 */
.quick-view-btn {
  border-color: #67c23a;
  color: #67c23a;
  background-color: rgba(255, 255, 255, 0.9);
}

.quick-view-btn:hover {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

/* 标签样式 */
.new-tag, .discount-tag {
  position: absolute;
  top: 10px;
  z-index: 2;
}

.new-tag {
  left: 10px;
}

.discount-tag {
  right: 10px;
}

.category-tag {
  margin-right: 8px;
}

/* 商品信息区域 */
.commodity-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 商品标题 */
.commodity-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.commodity-link {
  text-decoration: none;
  color: inherit;
}

.commodity-link:hover .commodity-title {
  color: #f56c6c;
}

/* 商品描述 */
.commodity-description {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-grow: 1;
}

/* 价格区域 */
.commodity-price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

/* 商品价格 */
.commodity-price {
  font-size: 20px;
  font-weight: 700;
  color: #f56c6c;
}

.commodity-original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

/* 商品元信息 */
.commodity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.commodity-stats {
  display: flex;
  align-items: center;
}

.sales-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.sales-info i {
  font-size: 14px;
}

.commodity-actions {
  display: flex;
  align-items: center;
}

.add-to-cart-btn {
  font-weight: 500;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 20px;
}

/* 空状态 */
.empty-container {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
}

/* 加载状态 */
.loading-container {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
  position: relative;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  font-size: 48px;
  color: #f56c6c;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .commodities-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 992px) {
  .commodities-grid {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  }
}

@media (max-width: 768px) {
  /* 筛选区域响应式 */
  .filter-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .filter-options {
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  /* 商品网格减少列数 */
  .commodities-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .commodity-image-container {
    height: 180px;
  }
}

@media (max-width: 576px) {
  /* 小屏幕显示1-2列 */
  .commodities-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .commodity-image-container {
    height: 150px;
  }
  
  .commodity-info {
    padding: 10px;
  }
  
  .commodity-title {
    font-size: 13px;
    height: 36px;
  }
  
  .commodity-price {
    font-size: 16px;
  }
  
  .filter-options {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-options .el-select,
  .filter-options .el-button {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .commodity-meta {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .commodity-stats {
    justify-content: space-between;
  }
  
  .commodity-actions {
    justify-content: center;
  }
}
</style>