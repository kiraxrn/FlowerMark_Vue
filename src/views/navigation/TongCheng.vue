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
                :src="commodity.image || 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop'"
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
          <el-button type="primary" @click="fetchAllCommodities">重新加载</el-button>
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
      commodities: [],           // 当前显示的商品
      allCommodities: [],        //所有商品数据
      loading: false,
      error: null,
      sortBy: '',
      categoryFilter: '',
      categories: [],
      currentPage: 1,
      addingCartId: null,
      pageSize: 12,
      isSearching: false         // 标记是否正在搜索
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
    this.fetchAllCommodities();  // 获取所有商品
    this.fetchUserInfoIfNeeded();
    
    // 检查URL中的搜索参数
    this.handleUrlSearchParams();
  },
  
  watch: {
    '$route.query': {
      handler(newQuery) {
        if (newQuery.search) {
          this.searchQuery = newQuery.search;
          this.handleSearch();
        }
      },
      immediate: true
    }
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
    
    // 获取所有商品数据
    async fetchAllCommodities() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('=== 开始获取所有商品数据 ===');
        
        // 获取更多商品
        const response = await commodityAPI.getCommodities();
        
        console.log('API完整响应:', response);
        
        // 处理响应数据
        let allCommoditiesData = [];
        
        // 根据不同的API响应结构处理
        if (response && response.code === 200) {
          // 标准API格式
          if (Array.isArray(response.data)) {
            allCommoditiesData = response.data;
          } else if (response.data && response.data.list && Array.isArray(response.data.list)) {
            allCommoditiesData = response.data.list;
          } else if (response.data && typeof response.data === 'object') {
            // 如果是分页数据，提取列表
            allCommoditiesData = response.data.records || response.data.items || [];
          }
        } else if (Array.isArray(response)) {
          // 直接返回数组
          allCommoditiesData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          allCommoditiesData = response.data;
        } else if (response && response.list && Array.isArray(response.list)) {
          allCommoditiesData = response.list;
        } else {
          // 尝试提取数据
          allCommoditiesData = response?.data || response?.list || [];
          if (!Array.isArray(allCommoditiesData)) {
            allCommoditiesData = [];
          }
        }
        
        // 保存所有商品数据
        this.allCommodities = allCommoditiesData;
        console.log('获取到的所有商品数量:', this.allCommodities.length);
        
        // 初始显示随机商品
        if (this.allCommodities.length > 0) {
          // 随机选择商品显示
          this.commodities = this.getRandomItems(this.allCommodities, 12);
          
          // 提取分类
          const uniqueCategories = [...new Set(this.allCommodities.map(item => item.category))].filter(Boolean);
          this.categories = uniqueCategories;
          console.log('提取的分类:', this.categories);
        } else {
          console.warn('商品列表为空');
          this.$message.warning('暂无商品数据');
          // 使用本地Mock数据
          this.useLocalMockData();
        }
        
      } catch (err) {
        console.error('获取商品数据失败:', err);
        this.error = '获取商品数据失败，请稍后重试';
        
        // 使用本地 Mock 数据
        console.log('使用本地 Mock 数据作为回退');
        this.useLocalMockData();
        this.$message.error('网络错误，使用本地数据');
      } finally {
        this.loading = false;
        console.log('=== 商品数据请求结束 ===');
      }
    },
    
    // 从数组中随机获取指定数量的项目
    getRandomItems(array, count) {
      if (array.length <= count) {
        return [...array];
      }
      
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    
    async handleSearch() {
      if (!this.searchQuery.trim()) {
        // 清空搜索，显示随机商品
        this.isSearching = false;
        if (this.allCommodities.length > 0) {
          this.commodities = this.getRandomItems(this.allCommodities, 12);
          this.$message.success('已显示随机商品');
        }
        this.currentPage = 1;
        return;
      }

      this.loading = true;
      this.isSearching = true;
      
      try {
        console.log('=== 开始搜索 ===');
        console.log('搜索关键词:', this.searchQuery);
        
        let searchResults = [];
        
        // 首先尝试调用API搜索
        try {
          const response = await commodityAPI.searchCommodities(this.searchQuery);
          console.log('API搜索响应完整结构:', JSON.stringify(response, null, 2));
          
          // 简化响应处理逻辑
          let rawResults = [];
          if (response && response.code === 200) {
            // 处理mock数据格式（commodityMock.js返回的格式）
            if (Array.isArray(response.data)) {
              rawResults = response.data;  // 直接使用data数组
            } else if (response.data && Array.isArray(response.data.list)) {
              rawResults = response.data.list;  // 使用data.list数组
            } else if (response.data && typeof response.data === 'object') {
              // 如果是分页数据，尝试提取
              const possibleList = response.data.list || response.data.records || response.data.items;
              if (Array.isArray(possibleList)) {
                rawResults = possibleList;
              }
            }
          } else {
            // 如果没有code字段，直接检查数据
            if (Array.isArray(response)) {
              rawResults = response;
            } else if (response && Array.isArray(response.list)) {
              rawResults = response.list;
            } else if (response && Array.isArray(response.data)) {
              rawResults = response.data;
            }
          }
          
          console.log('从API提取的原始结果数量:', rawResults.length);
          
          // 关键修改：验证搜索结果是否真的包含搜索关键词
          if (rawResults.length > 0) {
            searchResults = this.filterBySearchTerm(rawResults, this.searchQuery);
            console.log('过滤后的有效结果数量:', searchResults.length);
            
            // 如果API结果不包含关键词，使用本地搜索
            if (searchResults.length === 0 && this.allCommodities.length > 0) {
              console.log('API结果不包含关键词，使用本地搜索');
              searchResults = this.performAccurateLocalSearch(this.searchQuery);
            }
          } else {
            // API返回空结果，使用本地搜索
            console.log('API返回空结果，使用本地搜索');
            if (this.allCommodities.length > 0) {
              searchResults = this.performAccurateLocalSearch(this.searchQuery);
            }
          }
          
        } catch (apiError) {
          console.warn('API搜索失败，使用本地搜索:', apiError);
          // API搜索失败，使用本地搜索
          if (this.allCommodities.length > 0) {
            searchResults = this.performAccurateLocalSearch(this.searchQuery);
          }
        }
        
        // 确保是数组
        this.commodities = Array.isArray(searchResults) ? searchResults : [];
        
        // 调试：检查第一个结果的字段
        if (this.commodities.length > 0) {
          console.log('第一个搜索结果的字段:', Object.keys(this.commodities[0]));
          console.log('第一个搜索结果内容:', this.commodities[0]);
        }
        
        if (this.commodities.length > 0) {
          this.$message.success(`找到 ${this.commodities.length} 个相关商品`);
          
          // 调试信息 - 检查匹配原因
          console.log('搜索结果详情 (检查匹配项):');
          this.commodities.forEach((item, index) => {
            const name = item.name || '';
            const desc = item.description || '';
            const category = item.category || '';
            
            // 检查是否包含搜索词
            const hasMatch = name.includes(this.searchQuery) || 
                            desc.includes(this.searchQuery) || 
                            category.includes(this.searchQuery);
            
            console.log(`${index + 1}. ${name} (分类: ${category}) - 匹配: ${hasMatch}`);
          });
        } else {
          this.$message.info('未找到相关商品');
        }
        
        // 重置分页到第一页
        this.currentPage = 1;
        
      } catch (err) {
        console.error('搜索失败:', err);
        this.error = '搜索失败，请稍后重试';
        this.$message.error('搜索失败，请检查网络连接');
      } finally {
        this.loading = false;
        console.log('=== 搜索结束 ===');
      }
    },
    
    // 新增：验证搜索结果是否包含关键词
    filterBySearchTerm(items, searchTerm) {
      if (!searchTerm || !searchTerm.trim()) return items;
      
      const term = searchTerm.trim().toLowerCase();
      return items.filter(item => {
        const name = item.name ? item.name.toLowerCase() : '';
        const description = item.description ? item.description.toLowerCase() : '';
        const category = item.category ? item.category.toLowerCase() : '';
        
        return name.includes(term) || 
               description.includes(term) || 
               category.includes(term);
      });
    },
    
    // 精确的本地搜索
    performAccurateLocalSearch(searchQuery) {
      if (!searchQuery || !searchQuery.trim()) {
        return [];
      }
      
      const searchTerm = searchQuery.trim().toLowerCase();
      
      // 使用所有商品数据进行搜索
      const allCommodities = this.allCommodities;
      
      if (allCommodities.length === 0) {
        console.warn('没有可用于搜索的商品数据');
        return [];
      }
      
      // 创建匹配项数组
      const matchesWithScores = [];
      
      allCommodities.forEach(item => {
        let matchScore = 0;
        let matchType = '';
        
        const name = item.name ? item.name.toLowerCase() : '';
        const description = item.description ? item.description.toLowerCase() : '';
        const category = item.category ? item.category.toLowerCase() : '';
        
        // 1. 精确匹配名称（最高优先级）
        if (name === searchTerm) {
          matchScore = 100;
          matchType = 'exactName';
        }
        // 2. 名称包含搜索词
        else if (name.includes(searchTerm)) {
          const matchIndex = name.indexOf(searchTerm);
          const positionScore = Math.max(0, 50 - matchIndex);
          matchScore = 50 + positionScore;
          matchType = 'nameContains';
        }
        // 3. 描述包含搜索词
        else if (description && description.includes(searchTerm)) {
          matchScore = 20;
          matchType = 'descriptionContains';
        }
        // 4. 分类包含搜索词
        else if (category && category.includes(searchTerm)) {
          matchScore = 10;
          matchType = 'categoryContains';
        }
        
        // 如果有匹配，添加到结果中
        if (matchScore > 0) {
          matchesWithScores.push({
            item,
            matchScore,
            matchType
          });
        }
      });
      
      // 按分数降序排序
      matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      console.log(`本地搜索 "${searchTerm}" 结果:`, {
        搜索总商品数: allCommodities.length,
        匹配数量: matchesWithScores.length,
        前几个匹配项: matchesWithScores.slice(0, 3).map(m => ({
          商品名: m.item.name,
          分数: m.matchScore,
          类型: m.matchType
        }))
      });
      
      // 提取商品对象
      const finalResults = matchesWithScores.map(match => match.item);
      
      return finalResults;
    },
    
    handleQuickView(commodity) {
      this.setCurrentProduct(commodity);
      this.$router.push({
        name: 'ProductDetail',
        params: { productId: commodity.id.toString() }
      });
    },
    
    async handleAddToCart(product) {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          this.$message.warning('请先登录');
          this.$router.push('/login2');
          return;
        }
        
        this.addingCartId = product.id;
        
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image || product.imageUrl,
          quantity: 1,
          category: product.category,
          description: product.description || ''
        };
        
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
      this.isSearching = false;
      
      // 重置为显示随机商品
      if (this.allCommodities.length > 0) {
        this.commodities = this.getRandomItems(this.allCommodities, 12);
        this.$message.success('已重置筛选条件');
      } else {
        this.fetchAllCommodities();
      }
    },
    
    handleUrlSearchParams() {
      const searchParam = this.$route.query.search;
      if (searchParam) {
        this.searchQuery = searchParam;
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    },
    
    useLocalMockData() {
      const localMockCommodities = [
        {
          id: 1,
          name: '红玫瑰花束',
          price: 199,
          category: '鲜花',
          categoryId: 1,
          image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop',
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
          image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=500&fit=crop',
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
          image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=500&fit=crop',
          description: '温馨康乃馨，适合送母亲',
          sales: 60,
          stock: 40
        },
        // 添加更多Mock数据，确保搜索有足够数据
        {
          id: 4,
          name: '蓝色妖姬',
          price: 299,
          category: '鲜花',
          categoryId: 1,
          image: 'https://images.unsplash.com/photo-1578948856697-db91d246b7b1?w=500&h=500&fit=crop',
          description: '特别染色的蓝色玫瑰',
          sales: 45,
          stock: 25
        },
        {
          id: 5,
          name: '向日葵',
          price: 129,
          category: '鲜花',
          categoryId: 1,
          image: 'https://images.unsplash.com/photo-1597848212624-e19d0da7f5b3?w=500&h=500&fit=crop',
          description: '阳光明媚的向日葵',
          sales: 75,
          stock: 35
        }
      ];
      
      this.allCommodities = localMockCommodities;
      this.commodities = this.getRandomItems(localMockCommodities, 12);
      const uniqueCategories = [...new Set(localMockCommodities.map(item => item.category))].filter(Boolean);
      this.categories = uniqueCategories;
    }
  }
}
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