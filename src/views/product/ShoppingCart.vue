<template>
  <div class="shopping-cart">
    <AppHeader />
    <div class="container2">
      <!-- 购物车为空时的提示 -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>您的购物车空空如也，快去首页逛逛吧！</p>
        <a href="/main" class="btn-back">返回首页</a>
      </div>

      <!-- 购物车有商品时的展示 -->
      <div v-else class="cart-container">
        <div class="cart-items">
          <!-- 遍历购物车商品 -->
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <!-- 复选框 -->
            <input 
              type="checkbox"
              class="item-checkbox"
              :checked="item.checked"
              @change="toggleCheck(item.id)"
            >
            
            <!-- 商品信息 -->
            <div class="item-info">
              <img :src="item.image || defaultImage" 
                   :alt="item.name" 
                   class="item-img"
                   @error="handleImageError">
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-description">{{ item.description }}</p>
                <span class="item-price">{{ formatPrice(item.price) }}</span>
              </div>
            </div>

            <!-- 数量调整 -->
            <div class="quantity-control">
              <button 
                class="btn-quantity" 
                @click="updateQuantity({ id: item.id, quantity: item.quantity - 1 })"
                :disabled="item.quantity <= 1"
              >-</button>
              <input 
                type="text" 
                class="quantity-input" 
                :value="item.quantity" 
                readonly
              >
              <button 
                class="btn-quantity" 
                @click="updateQuantity({ id: item.id, quantity: item.quantity +1 })"
              >+</button>
            </div>

            <!-- 小计 -->
            <div class="item-subtotal">
              ¥{{ formatPrice(item.price * item.quantity) }}
            </div>

            <!-- 删除按钮 -->
            <button 
              class="btn-delete" 
              @click="removeFromCart(item.id)"
            >删除</button>
          </div>
        </div>

        <!-- 结算栏 -->
        <div class="cart-summary">
          <div class="summary-content">
            <div class="total-info">
              <div class="total-price">
                总计：<span class="amount">¥{{ formatPrice(checkedTotal) }}</span>
              </div>
              <div class="selected-count">
                已选 {{ checkedItems.length }} 件商品
              </div>
            </div>
            <button 
              class="btn-checkout" 
              @click="checkout" 
              :disabled="checkedItems.length === 0"
            >
              去结算 ({{ checkedItems.length }})
            </button>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ShoppingCart',
  data() {
    return {
      defaultImage: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop',
      paying: false // 支付状态
    }
  },
  computed: {
    ...mapState('cart', ['cartItems', 'cartTotal', 'cartCount']),
    ...mapGetters('cart', ['checkedItems', 'checkedTotal'])
  },
  mounted() {
    // 购物车数据已从 localStorage 自动加载
    console.log('购物车商品:', this.cartItems)
  },
  methods: {
    ...mapActions('cart', [
      'updateQuantity',
      'removeFromCart',
      'toggleCheck',
      'clearCart'
    ]),
    
    // 格式价格
    formatPrice(price) {
      if (!price) return '0.00'
      return parseFloat(price).toFixed(2)
    },
    
    // 处理图片错误
    handleImageError(event) {
      event.target.src = this.defaultImage
    },
    
    // 结算
    async checkout() {
      if (this.checkedItems.length === 0) {
        this.$message.warning('请选择要购买的商品')
        return
      }
      
      const selectedItems = this.checkedItems
      const itemNames = selectedItems.map(item => item.name).join(', ')
      const total = this.checkedTotal
      
      try {
        // 显示支付确认对话框
        await this.$confirm(
          `确认购买以下商品吗？\n\n${itemNames}\n\n总计: ¥${total.toFixed(2)}`,
          '确认支付',
          {
            confirmButtonText: '确认支付',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }
        )
        
        // 开始支付
        this.paying = true
        
        // 模拟支付过程
        await this.simulatePayment(total)
        
        // 支付成功
        await this.showPaymentSuccess(total, selectedItems)
        
        // 移除已购买的商品
        selectedItems.forEach(item => {
          this.removeFromCart(item.id)
        })
        
      } catch (error) {
        if (error === 'cancel') {
          this.$message.info('已取消支付')
        } else {
          console.error('支付失败:', error)
          this.$message.error('支付失败，请重试')
        }
      } finally {
        this.paying = false
      }
    },
    
    // 模拟支付过程
    simulatePayment(amount) {
      return new Promise((resolve) => {
        // 显示支付中提示
        const loading = this.$loading({
          lock: true,
          text: `正在支付 ¥${amount.toFixed(2)}...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        
        // 模拟支付处理时间
        setTimeout(() => {
          loading.close()
          resolve()
        }, 2000)
      })
    },
    
    // 显示支付成功弹窗
    showPaymentSuccess(amount, items) {
      return new Promise((resolve) => {
        this.$alert(
          `<div style="text-align: center;">
            <i class="el-icon-success" style="color: #67C23A; font-size: 48px; margin-bottom: 16px;"></i>
            <h3 style="color: #67C23A; margin: 16px 0;">支付成功！</h3>
            <p style="font-size: 18px; margin: 8px 0;">支付金额：<strong>¥${amount.toFixed(2)}</strong></p>
            <p style="color: #666; margin: 8px 0;">购买商品：${items.map(item => item.name).join('、')}</p>
            <p style="color: #999; font-size: 14px; margin-top: 16px;">订单将在24小时内发货，请注意查收</p>
          </div>`,
          '支付成功',
          {
            dangerouslyUseHTMLString: true,
            showConfirmButton: true,
            confirmButtonText: '继续购物',
            showCancelButton: true,
            cancelButtonText: '查看订单',
            type: 'success',
            center: true,
            callback: (action) => {
              if (action === 'confirm') {
                this.$router.push('/main')
              } else if (action === 'cancel') {
                // 这里可以跳转到订单页面
                this.$message.info('订单页面开发中...')
              }
              resolve()
            }
          }
        )
      })
    }
  }
}
</script>
<style scoped>
.shopping-cart {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background: #FCFCE3;
  margin: 0;
  height: 100%;
  width: 100%;
}

/* 头部样式 */
header {
  background-color: #C2F1D1;
  color: black;
  padding: 1rem 0;
  box-shadow: 0 2px 5px #C2F1D1;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo h1 {
  text-align: center;
  margin-bottom: 30px;
  background-color: #C2F1D1;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 1.5rem;
}

nav ul li a {
  color: black;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #3498db;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  background-color: #C2F1D1;
}

.container2 {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: #D9EBEE;
}

.cart-container {
  display: flex;
  gap: 20px;
}

.cart-items {
  flex: 2;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.item-checkbox {
  width: 18px;
  height: 18px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.item-description {
  color: #666;
  font-size: 12px;
  margin: 0 0 8px 0;
}

.item-price {
  color: #e4393c;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-quantity {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: #f8f8f8;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-quantity:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.quantity-input {
  width: 40px;
  text-align: center;
  border: 1px solid #ddd;
  padding: 4px;
  border-radius: 4px;
  background: #fff;
}

.item-subtotal {
  font-weight: bold;
  color: #e4393c;
  min-width: 80px;
  text-align: center;
}

.btn-delete {
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
}

.btn-delete:hover {
  color: #ff4444;
  background: #f5f5f5;
}

.cart-summary {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-content {
  text-align: center;
}

.total-info {
  margin-bottom: 20px;
}

.total-price {
  font-size: 20px;
  color: #e4393c;
  font-weight: bold;
  margin-bottom: 10px;
}

.amount {
  font-size: 24px;
}

.selected-count {
  color: #666;
  font-size: 14px;
}

.btn-checkout {
  width: 100%;
  padding: 12px;
  background: #e4393c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-checkout:hover:not(:disabled) {
  background: #c62f2f;
}

.btn-checkout:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  padding: 60px 0;
}

.empty-cart p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.btn-back {
  display: inline-block;
  padding: 10px 20px;
  background: #e4393c;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #c62f2f;
}
</style>