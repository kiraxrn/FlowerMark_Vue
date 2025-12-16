<template>
  <div class="page-container">
    <!-- Header 组件 -->
    <AppHeader 
      :user-picture="userpicture"
      :user-name="username"
    />
 
    <div class="navigationmain2">
      <!-- 侧边栏 -->
      <AppSidebar />
      
      <!-- 主内容区 - 秒杀内容 -->
      <div class="navigationgroup3">
        <div class="miaosha-content">
          <!-- 秒杀时间轴 -->
          <el-card class="miaosha-header" shadow="never">
            <div class="header-content">
              <h1>特惠秒杀</h1>
              <div class="time-line-container">
                <el-card shadow="never" class="time-line-card">
                  <div class="time-line">
                    <el-button
                      v-for="(time, index) in seckillTimes" 
                      :key="index"
                      class="time-item"
                      :class="{ 'active-time': time.active }"
                      :type="time.active ? 'danger' : time.coming ? 'info' : ''"
                      :disabled="!time.coming"
                      @click="switchTime(index)"
                      size="large"
                    >
                      <div class="time-content">
                        <div class="time-label">{{ time.label }}</div>
                        <div class="time-status">
                          {{ time.active ? '正在进行' : time.coming ? '即将开始' : '已结束' }}
                        </div>
                      </div>
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </el-card>

          <!-- 秒杀倒计时 -->
          <el-card v-if="currentSeckill.endTime" class="countdown-card" shadow="never">
            <div class="countdown-content">
              <div class="countdown-text">
                本场结束倒计时: 
              </div>
              <div class="countdown-display">
                <div class="countdown-statistic">
                  {{ formattedCountdown }}
                </div>
              </div>
              <div class="seckill-status">
                <el-tag :type="currentSeckill.active ? 'danger' : 'info'" size="large">
                  {{ currentSeckill.active ? '秒杀进行中' : '秒杀已结束' }}
                </el-tag>
              </div>
            </div>
          </el-card>

          <!-- 秒杀商品列表 -->
          <el-row :gutter="20" class="products-grid">
            <el-col 
              v-for="(item, index) in seckillProducts" 
              :key="index"
              :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
              class="product-col"
            >
              <el-card 
                class="seckill-product" 
                shadow="hover"
                :body-style="{ padding: '0' }"
              >
                <div class="seckill-card">
                  <el-tag class="seckill-tag" type="danger" effect="dark">
                    秒杀
                  </el-tag>
                  
                  <div @click="handleProductClick(item)" class="product-link cursor-pointer">
                    <el-image 
                      :src="item.comPicture || defaultImg" 
                      :alt="item.comName"
                      class="product-img"
                      fit="cover"
                      lazy
                    >
                      <div slot="error" class="image-error">
                        <i class="el-icon-picture"></i>
                        <span>图片加载失败</span>
                      </div>
                    </el-image>
                    
                    <div class="product-info">
                      <div class="product-name">{{ item.comName }}</div>
                      
                      <div class="price-container">
                        <span class="seckill-price">¥{{ formatPrice(item.seckillPrice) }}</span>
                        <span class="original-price">¥{{ formatPrice(item.comPrice) }}</span>
                      </div>
                      
                      <div class="stock-info">
                        <div class="progress-info">
                          <div class="progress-label">库存进度</div>
                          <div class="progress-value">已售{{ item.total - item.stock }}/{{ item.total }}</div>
                        </div>
                        <el-progress 
                          :percentage="Math.max(0, Math.min(100, ((item.total - item.stock) / item.total * 100) || 0))"
                          :stroke-width="8"
                          :show-text="false"
                          :stroke-color="progressColor(item.stock, item.total)"
                          class="progress-bar"
                        ></el-progress>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card-footer">
                    <el-button
                      class="seckill-btn"
                      type="danger"
                      :disabled="!item.stock || !currentSeckill.active"
                      @click.stop="seckill(item)"
                      size="large"
                      :loading="item.loading"
                    >
                      <template v-if="item.stock && currentSeckill.active">
                        <i class="el-icon-flash"></i>
                        立即抢购
                      </template>
                      <template v-else>
                        <i class="el-icon-sold-out"></i>
                        已抢完
                      </template>
                    </el-button>
                    
                    <div class="extra-actions">
                      <el-button
                        type="text"
                        size="small"
                        @click.stop="addToWishlist(item)"
                      >
                        <i class="el-icon-star-on"></i>
                        收藏
                      </el-button>
                      
                      <el-button
                        type="text"
                        size="small"
                        @click.stop="shareProduct(item)"
                      >
                        <i class="el-icon-share"></i>
                        分享
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 空状态 -->
          <el-empty
            v-if="seckillProducts.length === 0"
            description="暂无秒杀商品"
            :image-size="200"
            class="empty-state"
          >
            <div slot="image">
              <i class="el-icon-clock" style="font-size: 60px; color: #e74c3c;"></i>
            </div>
            <el-button type="primary" @click="fetchSeckillProducts">
              重新加载
            </el-button>
          </el-empty>

          <!-- 分页 -->
          <el-pagination
            v-if="seckillProducts.length > 0"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalCount"
            :page-sizes="[8, 12, 16, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            class="pagination"
          ></el-pagination>
        </div>
      </div>
    </div>
    
    <!-- Footer 组件 -->
    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getSeckillCommodities } from '../../api/commodity'
import AppHeader from '../../components/Header.vue'
import AppSidebar from '../../components/Sidebar.vue'
import AppFooter from '../../components/Footer.vue'

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  data() {
    return {
      // 秒杀相关数据
      seckillTimes: [
        { label: '00:00', active: false, coming: true },
        { label: '08:00', active: true, coming: true },
        { label: '12:00', active: false, coming: true },
        { label: '16:00', active: false, coming: true },
        { label: '20:00', active: false, coming: true }
      ],
      currentSeckill: {
        endTime: new Date(Date.now() + 3600000),
        active: true
      },
      seckillProducts: [],
      defaultImg: 'https://img.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
      currentPage: 1,
      pageSize: 8,
      totalCount: 0,
      countdownTimer: null,
      countdownValue: Date.now() + 3600000,
      // 响应式当前时间，用于触发倒计时更新
      now: Date.now()
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    userpicture() {
      return this.userInfo?.avatar || ''
    },
    username() {
      return this.userInfo?.username || ''
    },
    // 自定义倒计时格式化
    formattedCountdown() {
      const diff = this.countdownValue - this.now
      
      if (diff <= 0) {
        return '00:00:00'
      }
      
      const hours = this.formatNumber(Math.floor(diff / 3600000))
      const minutes = this.formatNumber(Math.floor((diff % 3600000) / 60000))
      const seconds = this.formatNumber(Math.floor((diff % 60000) / 1000))
      return `${hours}:${minutes}:${seconds}`
    }
  },
  methods: {
    // 从Vuex获取actions
    ...mapActions('product', [
      'setCurrentProduct'
    ]),
    
    // 商品卡片点击事件处理函数
    handleProductClick(item) {
      // 将商品信息转换为与商品详情页兼容的格式
      const productData = {
        id: item.comId,
        name: item.comName,
        price: item.seckillPrice,
        originalPrice: item.comPrice,
        image: item.comPicture,
        stock: item.stock,
        sales: item.total - item.stock
      };
      
      // 保存到Vuex
      this.setCurrentProduct(productData);
      
      // 手动跳转到商品详情页
      this.$router.push(`/product/${item.comId}`);
    },
    // 进度条颜色
    progressColor(stock, total) {
      const percentage = (stock / total) * 100
      if (percentage < 30) return '#f56c6c'
      if (percentage < 60) return '#e6a23c'
      return '#67c23a'
    },
    
    // 数字格式化补零
    formatNumber(num) {
      return num.toString().padStart(2, '0')
    },
    
    // 格式化价格
    formatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    
    // 获取秒杀商品
    async fetchSeckillProducts() {
      console.log('====================================')
      console.log('🔍 开始获取秒杀商品 - 测试信息检查')
      console.log('当前时间:', new Date().toLocaleString())
      console.log('当前页面:', this.currentPage)
      console.log('每页数量:', this.pageSize)
      console.log('====================================')
      
      // 备用数据
      const fallbackData = [
        {
          comId: 1,
          comName: '红玫瑰花束',
          comPrice: 199.00,
          seckillPrice: 149.00,
          comPicture: 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
          stock: 5,
          total: 20,
          loading: false
        },
        {
          comId: 3,
          comName: '康乃馨花束',
          comPrice: 89.00,
          seckillPrice: 69.00,
          comPicture: 'https://img2.baidu.com/it/u=234567890,876543210&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
          stock: 3,
          total: 15,
          loading: false
        },
        {
          comId: 4,
          comName: '富贵竹 (5支)',
          comPrice: 29.90,
          seckillPrice: 19.90,
          comPicture: 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
          stock: 8,
          total: 25,
          loading: false
        },
        {
          comId: 5,
          comName: '蝴蝶兰盆栽',
          comPrice: 88.00,
          seckillPrice: 68.00,
          comPicture: 'https://img6.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664',
          stock: 2,
          total: 10,
          loading: false
        }
      ]
      
      try {
        // 尝试调用 API
        console.log('📞 调用 API: getSeckillCommodities')
        const response = await getSeckillCommodities()
        console.log('📥 API 响应类型:', typeof response)
        console.log('📋 API 响应完整内容:', JSON.stringify(response, null, 2))
        
        // 直接从响应中获取商品信息，不做复杂的二次处理
        let seckillData = []
        
        // 简化响应处理，直接获取商品数据
        if (response) {
          console.log('🔄 开始解析响应数据...')
          // 检查axios响应格式，获取实际数据
          const resData = response.data || response
          
          // 检查是否为标准API响应格式 {code, data, message}
          if (resData.code !== undefined) {
            // 从标准格式中提取商品数据
            if (Array.isArray(resData.data)) {
              // data直接是数组
              seckillData = resData.data
              console.log('✅ 从响应data数组获取商品:', seckillData.length)
            } else if (resData.data && Array.isArray(resData.data.list)) {
              // data包含list数组
              seckillData = resData.data.list
              console.log('✅ 从响应data.list获取商品:', seckillData.length)
            }
          } else if (Array.isArray(resData)) {
            // 直接是数组
            seckillData = resData
            console.log('✅ 从直接数组获取商品:', seckillData.length)
          } else if (resData && Array.isArray(resData.list)) {
            // 直接包含list数组
            seckillData = resData.list
            console.log('✅ 从直接list获取商品:', seckillData.length)
          }
        }
        
        // 确保seckillData是数组
        if (!Array.isArray(seckillData)) {
          console.error('❌ 数据格式错误，seckillData不是数组:', seckillData)
          seckillData = []
        }
        
        // 输出每个商品的详细信息
        seckillData.forEach((item, index) => {
          console.log(`📦 商品 ${index + 1} 详情:`)
          console.log(`   ID: ${item.id || 'NaN'}`)
          console.log(`   名称: ${item.name || '未命名'}`)
          console.log(`   原价: ${item.price || 'NaN'}`)
          console.log(`   秒杀价: ${item.seckillPrice || 'NaN'}`)
          console.log(`   库存: ${item.seckillStock || item.stock || 'NaN'}`)
          console.log(`   总量: ${item.stock || 'NaN'}`)
          console.log(`   图片: ${item.image || item.images?.[0] ? '有' : '无'}`)
        })
        
        // 将API返回的字段名映射为组件期望的格式
        this.seckillProducts = seckillData.map(item => ({
          comId: item.id,
          comName: item.name,
          comPrice: item.price,
          seckillPrice: item.seckillPrice,
          comPicture: item.image || item.images?.[0] || this.defaultImg,
          stock: item.seckillStock || item.stock,
          total: item.stock,
          loading: false
        }))
        this.totalCount = seckillData.length
        
        console.log('====================================')
        console.log('🎉 秒杀商品获取成功！')
        console.log('最终商品数量:', this.seckillProducts.length)
        console.log('总商品数量:', this.totalCount)
        console.log('====================================')
        
        this.$message.success(`加载了 ${seckillData.length} 个秒杀商品`)
      } catch (error) {
        console.error('====================================')
        console.error('💥 获取秒杀商品失败:', error)
        console.error('错误详情:', error.message)
        console.error('错误堆栈:', error.stack)
        console.error('====================================')
        // 使用硬编码的备用数据
        this.seckillProducts = fallbackData
        this.totalCount = fallbackData.length
        this.$message.info(`使用备用数据，加载了 ${fallbackData.length} 个秒杀商品`)
      }
    },
    
    // 切换时间段
    switchTime(index) {
      this.seckillTimes.forEach((t, i) => t.active = i === index)
      this.currentPage = 1
      this.fetchSeckillProducts()
    },
    
    // 分页处理
    handlePageChange(page) {
      this.currentPage = page
      this.fetchSeckillProducts()
    },
    
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchSeckillProducts()
    },
    
    // 更新倒计时
    updateCountdown() {
      // 每秒更新响应式的当前时间，触发计算属性重新计算
      this.now = Date.now()
      
      const end = this.countdownValue
      const diff = end - this.now

      if (diff <= 0) {
        this.currentSeckill.active = false
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer)
        }
      }
    },
    
    // 秒杀商品
    async seckill(item) {
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        this.$message.warning('请先登录')
        this.$router.push('/login2')
        return
      }

      // 设置加载状态
      item.loading = true

      try {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络请求
        
        // 秒杀成功后添加到购物车
        const cartItem = {
          id: item.comId,
          name: item.comName,
          price: item.seckillPrice,
          imageUrl: item.comPicture || this.defaultImg,
          quantity: 1,
          description: `秒杀商品: ${item.comName}`
        }
        
        // 添加到购物车
        this.$store.dispatch('cart/addToCart', cartItem)
        
        // 更新库存
        item.stock -= 1
        
        this.$message.success({
          message: `秒杀成功！已将 ${item.comName} 加入购物车`,
          duration: 2000,
          showClose: true
        })
        
      } catch (error) {
        this.$message.error('秒杀失败，请重试')
      } finally {
        item.loading = false
      }
    },
    
    // 添加到收藏
    addToWishlist(item) {
      this.$message.info(`已将 ${item.comName} 添加到收藏夹`)
    },
    
    // 分享商品
    shareProduct(item) {
      this.$confirm(
        `分享商品: ${item.comName}`,
        '分享到',
        {
          confirmButtonText: '复制链接',
          cancelButtonText: '取消',
          type: 'info'
        }
      ).then(() => {
        // 这里可以实现复制链接功能
        const link = `${window.location.origin}/product/${item.comId}`
        navigator.clipboard.writeText(link)
        this.$message.success('链接已复制到剪贴板')
      }).catch(() => {
        // 取消操作
      })
    }
  },
  mounted() {
    this.fetchSeckillProducts()
    // 更新倒计时
    this.countdownTimer = setInterval(this.updateCountdown, 1000)
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  }
}
</script>

<style scoped>
@import '../../assets/css/navigation.css';

/* 页面容器 */
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主内容区域 */
.navigationmain2 {
  display: flex;
  flex: 1;
  background: #FCFCE3;
  min-height: calc(100vh - 120px);
  /* 确保子元素不会换行 */
  flex-wrap: nowrap;
}

.navigationgroup3 {
  background: #F6BE8C;
  border-radius: 15px;
  flex: 1;
  margin: 0px 20px 20px 20px;
  padding: 20px;
  overflow: auto;
  /* 确保内容区能自适应剩余空间 */
  min-width: 0;
}

.miaosha-content {
  padding: 20px;
}

/* 秒杀头部 */
.miaosha-header {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffeaea 0%, #fff5f5 100%);
}

.header-content {
  text-align: center;
}

.header-content h1 {
  color: #e74c3c;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: bold;
}

.time-line-container {
  margin: 20px auto;
  max-width: 900px;
}

.time-line-card {
  background: transparent;
  border: none;
}

.time-line {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.time-item {
  min-width: 100px;
  height: 60px;
  padding: 10px;
  transition: all 0.3s ease;
}

.time-item.active-time {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.time-status {
  font-size: 12px;
}

/* 倒计时卡片 */
.countdown-card {
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ffeded 0%, #fff0f0 100%);
}

.countdown-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
}

.countdown-text {
  font-size: 18px;
  color: #e74c3c;
  font-weight: bold;
}

.countdown-display {
  font-size: 24px;
}

.countdown-statistic {
  font-size: 32px;
  font-weight: bold;
  color: #e74c3c;
  font-family: 'Courier New', monospace;
}

.seckill-status {
  margin-left: 20px;
}

/* 商品网格 - 使用Element UI的响应式布局 */
.products-grid {
  margin: 20px 0;
}

.product-col {
  margin-bottom: 20px;
}

/* 秒杀商品卡片 */
.seckill-product {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #ebeef5;
}

.seckill-product:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  border-color: #f56c6c;
}

.seckill-card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.seckill-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  font-weight: bold;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.seckill-product:hover .product-img {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
  color: #999;
}

.image-error .el-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.product-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.seckill-price {
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
}

.stock-info {
  margin-top: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.progress-label {
  font-weight: 500;
}

.progress-value {
  color: #e74c3c;
}

.progress-bar {
  margin-bottom: 15px;
}

.card-footer {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.seckill-btn {
  width: 100%;
  margin-bottom: 10px;
}

.seckill-btn .el-icon {
  margin-right: 5px;
}

.extra-actions {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.extra-actions .el-button {
  padding: 5px 10px;
}

.extra-actions .el-icon {
  margin-right: 3px;
}

/* 空状态 */
.empty-state {
  margin: 40px 0;
}

/* 分页 */
.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .navigationgroup3 {
    margin: 15px;
    padding: 15px;
  }
}

@media (max-width: 992px) {
  .time-line {
    gap: 10px;
  }
  
  .time-item {
    min-width: 90px;
  }
  
  .product-img {
    height: 200px;
  }
}

@media (max-width: 768px) {
  /* 保持水平布局，不改为垂直排列 */
  .navigationmain2 {
    flex-direction: row;
  }
  
  .navigationgroup3 {
    margin: 10px;
    padding: 10px;
  }
  
  .countdown-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .time-line {
    justify-content: space-between;
  }
  
  .time-item {
    flex: 1;
    min-width: auto;
  }
  
  .product-img {
    height: 180px;
  }
}

@media (max-width: 576px) {
  .header-content h1 {
    font-size: 24px;
  }
  
  .time-content {
    font-size: 14px;
  }
  
  .countdown-statistic {
    font-size: 24px;
  }
  
  .product-img {
    height: 150px;
  }
  
  .product-info {
    padding: 10px;
  }
  
  .product-name {
    font-size: 13px;
    height: 36px;
  }
  
  .seckill-price {
    font-size: 18px;
  }
}
</style>