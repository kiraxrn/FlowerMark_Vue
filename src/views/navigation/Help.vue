<template>
  <div class="help-container">
    <el-container class="container">
      <el-main>
        <h1>帮助中心</h1>
        
        <!-- 导航栏 -->
        <el-row justify="end" class="nav-row">
          <el-col :span="12">
            <el-menu mode="horizontal" :ellipsis="false" class="nav-menu">
              <el-menu-item index="1">
                <router-link to="/main">首页</router-link>
              </el-menu-item>
              <el-menu-item index="2">
                <router-link to="/cart">购物车</router-link>
              </el-menu-item>
              <el-menu-item index="3">
                <router-link to="/help">帮助中心</router-link>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        
        <!-- 搜索框 -->
        <el-card class="搜索框" shadow="never">
          <div class="搜索内容">
            <el-input
              v-model="搜索查询"
              placeholder="请输入您的问题关键词..."
              clearable
              class="搜索输入框"
              @keyup.enter.native="处理搜索"
            >
              <template #append>
                <el-button type="primary" @click="处理搜索" icon="el-icon-search">搜索</el-button>
              </template>
            </el-input>
          </div>
        </el-card>

        <!-- 导航分类 -->
        <el-card class="分类导航" shadow="never">
          <div class="分类链接">
            <el-link 
              v-for="分类 in 分类列表" 
              :key="分类.id"
              :href="'#' + 分类.id"
              @click.prevent="滚动到区域(分类.id)"
              class="分类链接项"
            >
              {{ 分类.name }}
            </el-link>
          </div>
        </el-card>

        <!-- FAQ内容 -->
        <div class="faq内容">
          <!-- 账户问题 -->
          <el-card class="faq区域" id="account" shadow="never">
            <template #header>
              <h2>账户管理</h2>
            </template>
            
            <el-collapse v-model="活动折叠项">
              <el-collapse-item title="如何注册新账户？" name="1">
                <div class="答案内容">
                  <p>1. 点击首页右上角"注册"按钮</p>
                  <p>2. 输入手机号码/邮箱</p>
                  <p>3. 获取并填写验证码</p>
                  <p>4. 设置登录密码</p>
                  <p>5. 完成实名认证（可选）</p>
                </div>
              </el-collapse-item>
              
              <el-collapse-item title="忘记密码怎么办？" name="2">
                <div class="答案内容">
                  <p>1. 在登录页面点击"忘记密码"</p>
                  <p>2. 输入注册时使用的手机号/邮箱</p>
                  <p>3. 获取并验证验证码</p>
                  <p>4. 设置新密码</p>
                  <p>5. 重新登录</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 订单问题 -->
          <el-card class="faq区域" id="order" shadow="never">
            <template #header>
              <h2>订单管理</h2>
            </template>
            
            <el-collapse v-model="活动折叠项">
              <el-collapse-item title="如何查询订单状态？" name="3">
                <div class="答案内容">
                  <p>登录账户 → 进入"我的订单" → 选择对应订单查看详细状态</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 支付问题 -->
          <el-card class="faq区域" id="payment" shadow="never">
            <template #header>
              <h2>支付方式</h2>
            </template>
            
            <el-collapse v-model="活动折叠项">
              <el-collapse-item title="支持哪些支付方式？" name="4">
                <div class="答案内容">
                  <p>• 支付宝支付</p>
                  <p>• 微信支付</p>
                  <p>• 银联在线支付</p>
                  <p>• 信用卡支付（支持Visa/MasterCard）</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 物流问题 -->
          <el-card class="faq区域" id="shipping" shadow="never">
            <template #header>
              <h2>物流问题</h2>
            </template>
            
            <el-collapse v-model="活动折叠项">
              <el-collapse-item title="如何查询物流信息？" name="5">
                <div class="答案内容">
                  <p>在"我的订单"页面找到对应订单，点击"查看物流"即可查询实时物流信息</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 退换货 -->
          <el-card class="faq区域" id="return" shadow="never">
            <template #header>
              <h2>退换货</h2>
            </template>
            
            <el-collapse v-model="活动折叠项">
              <el-collapse-item title="如何申请退换货？" name="6">
                <div class="答案内容">
                  <p>1. 进入"我的订单"页面</p>
                  <p>2. 选择需要退换货的订单</p>
                  <p>3. 点击"申请售后"按钮</p>
                  <p>4. 选择退换货类型并填写原因</p>
                  <p>5. 提交申请等待审核</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 联系方式 -->
          <el-card class="联系区域" shadow="never">
            <template #header>
              <h3>需要更多帮助？</h3>
            </template>
            
            <div class="联系内容">
              <p><strong>客服热线：</strong>400-123-4567（每日9:00-21:00）</p>
              <p><strong>在线客服：</strong>
                <el-button type="primary" @click="联系客服" size="small" class="联系按钮" icon="el-icon-service">
                  立即咨询
                </el-button>
              </p>
              <p><strong>服务邮箱：</strong>service@tiantian.com</p>
              <p><strong>在线留言：</strong>
                <el-button type="info" @click="显示留言对话框" size="small" class="留言按钮">
                  我要留言
                </el-button>
              </p>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>

    <!-- 留言对话框 -->
    <el-dialog
      :visible.sync="留言对话框可见"
      title="在线留言"
      width="500px"
    >
      <el-form :model="留言表单" label-width="80px">
        <el-form-item label="问题类型">
          <el-select v-model="留言表单.type" placeholder="请选择问题类型">
            <el-option label="账户问题" value="account"></el-option>
            <el-option label="订单问题" value="order"></el-option>
            <el-option label="支付问题" value="payment"></el-option>
            <el-option label="物流问题" value="shipping"></el-option>
            <el-option label="退换货" value="return"></el-option>
            <el-option label="其他问题" value="other"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="联系方式">
          <el-input v-model="留言表单.contact" placeholder="请输入手机号或邮箱"></el-input>
        </el-form-item>
        
        <el-form-item label="问题描述">
          <el-input
            v-model="留言表单.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的问题"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="对话框底部">
          <el-button @click="留言对话框可见 = false">取消</el-button>
          <el-button type="primary" @click="提交留言">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Help',
  data() {
    return {
      // 搜索查询
      搜索查询: '',
      
      // 分类导航
      分类列表: [
        { id: 'account', name: '账户问题' },
        { id: 'order', name: '订单问题' },
        { id: 'payment', name: '支付问题' },
        { id: 'shipping', name: '物流问题' },
        { id: 'return', name: '退换货' }
      ],
      
      // 折叠面板活动项
      活动折叠项: [],
      
      // 留言对话框
      留言对话框可见: false,
      留言表单: {
        type: '',
        contact: '',
        content: ''
      }
    }
  },
  methods: {
    // 搜索处理
    处理搜索() {
      if (this.搜索查询.trim()) {
        this.$message.info(`搜索关键词: ${this.搜索查询}`)
        // 在实际应用中，这里可以添加搜索逻辑
      } else {
        this.$message.warning('请输入搜索关键词')
      }
    },
    
    // 滚动到指定区域
    滚动到区域(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    
    // 联系客服
    联系客服() {
      this.$confirm('正在为您转接在线客服，是否继续？', '联系客服', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$message.success('正在为您连接在线客服...')
      })
    },
    
    // 显示留言对话框
    显示留言对话框() {
      this.留言对话框可见 = true
    },
    
    // 提交留言
    提交留言() {
      if (!this.留言表单.type || !this.留言表单.contact || !this.留言表单.content) {
        this.$message.warning('请填写完整信息')
        return
      }
      
      // 模拟提交
      console.log('提交留言:', this.留言表单)
      this.$message.success('留言提交成功，我们将在24小时内回复您')
      this.留言对话框可见 = false
      
      // 重置表单
      this.留言表单 = {
        type: '',
        contact: '',
        content: ''
      }
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.help-container {
  font-family: "Microsoft Yahei", Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  background-color: #C2F1D1;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: #D9EBEE;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.el-main {
  padding: 30px;
}

h1 {
  color: #000000;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

/* 导航栏样式 */
.nav-row {
  margin-bottom: 20px;
}

.nav-menu {
  background: #f8f9fa;
  border-radius: 4px;
  justify-content: flex-end;
}

.nav-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.nav-menu .el-menu-item a {
  text-decoration: none;
  color: #333;
  display: block;
  width: 100%;
}

.nav-menu .el-menu-item:hover {
  background-color: transparent;
}

.nav-menu .el-menu-item:hover a {
  color: #007bff;
}

/* 搜索框样式 */
.搜索框 {
  background: #FCFCE3 !important;
  margin: 20px 0;
  border: none !important;
}

.搜索内容 {
  display: flex;
}

.搜索输入框 {
  width: 100%;
}

/* 分类导航 */
.分类导航 {
  background: #FCFCE3 !important;
  margin: 20px 0;
  border: none !important;
}

.分类链接 {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.分类链接项 {
  font-size: 16px;
  color: #666 !important;
  text-decoration: none;
}

.分类链接项:hover {
  color: #007bff !important;
}

/* FAQ区域 */
.faq区域 {
  background: #FCFCE3 !important;
  margin: 30px 0;
  border: none !important;
}

.faq区域 .el-card__header {
  background: #FCFCE3;
  border-bottom: 1px solid #ddd;
}

.faq区域 h2 {
  color: #000;
  margin: 0;
  font-size: 20px;
}

.el-collapse {
  border: none;
}

.el-collapse-item__header {
  color: #e4393c;
  background: #FCFCE3;
  border: none;
  font-weight: bold;
  padding: 12px;
  margin: 10px 0;
  border-radius: 4px;
}

.el-collapse-item__header:hover {
  background-color: #f8f8d8;
}

.el-collapse-item__wrap {
  background: #FCFCE3;
  border: none;
}

.el-collapse-item__content {
  padding: 15px;
  background: #FCFCE3;
  border-left: 3px solid #e4393c;
  margin: 10px 0;
}

.答案内容 p {
  margin: 8px 0;
  line-height: 1.8;
}

/* 联系方式 */
.联系区域 {
  background: #FCFCE3 !important;
  margin-top: 30px;
  border: none !important;
}

.联系区域 .el-card__header {
  background: #FCFCE3;
  border-bottom: 1px solid #ddd;
}

.联系区域 h3 {
  margin: 0;
  color: #000;
}

.联系内容 {
  line-height: 2;
}

.联系内容 p {
  margin: 10px 0;
}

.联系按钮, .留言按钮 {
  margin-left: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .nav-row {
    margin-bottom: 15px;
  }
  
  .分类链接 {
    justify-content: center;
  }
  
  .分类链接项 {
    margin: 5px 10px;
  }
}
</style>