<template>
  <div class="register-container">     
      <!-- 表单内容 -->
      <el-form ref="registerForm" :model="formData" :rules="formRules" class="register-form">
          <h2>用户注册</h2>
          <div class="form-section">
              <div class="form-container">
                  <el-form-item prop="userId" label="用户ID：">
                      <el-input 
                          type="text"
                          v-model="formData.userId"
                          placeholder="请输入用户ID"
                          size="large"
                          clearable
                          prefix-icon="el-icon-user"
                      >
                      </el-input>
                  </el-form-item>
                  
                  <el-form-item prop="username" label="用户名：">
                      <el-input 
                          type="text"
                          v-model="formData.username"
                          placeholder="请输入用户名"
                          size="large"
                          clearable
                          prefix-icon="el-icon-user-solid"
                      >
                      </el-input>
                  </el-form-item>
                  
                  <el-form-item prop="email" label="邮箱：">
                      <el-input 
                          type="email"
                          v-model="formData.email"
                          placeholder="请输入邮箱"
                          size="large"
                          clearable
                          prefix-icon="el-icon-message"
                      >
                      </el-input>
                  </el-form-item>
                  
                  <el-form-item prop="password" label="密码：">
                      <el-input 
                          type="password"
                          v-model="formData.password"
                          placeholder="请输入密码"
                          size="large"
                          show-password
                          clearable
                          prefix-icon="el-icon-lock"
                      >
                      </el-input>
                  </el-form-item>
                  
                  <el-form-item prop="confirmPassword" label="确认密码：">
                      <el-input 
                          type="password"
                          v-model="formData.confirmPassword"
                          placeholder="请再次输入密码"
                          size="large"
                          show-password
                          clearable
                          prefix-icon="el-icon-lock"
                      >
                      </el-input>
                  </el-form-item>  
              </div>
              
              <div class="form-actions">
                  <el-form-item class="button-item">
                      <el-button 
                          type="primary" 
                          size="large" 
                          @click="handleRegister" 
                          :loading="loading"
                          style="width: 100%;"
                      >
                          {{ loading ? '注册中...' : '注册' }}
                      </el-button>
                  </el-form-item>
                  
                  <div class="info-section">
                      <div class="test-info">
                          <p><strong>测试提示：</strong></p>
                          <p>• 用户名不能重复（admin、user01 已存在）</p>
                          <p>• 邮箱不能重复</p>
                          <p>• 密码需要6位以上</p>
                      </div>
                      
                      <div class="login-link">
                          <p>已有账号？<router-link to="/login2">立即登录</router-link></p>
                      </div>
                  </div>
              </div>
          </div>
      </el-form>      
  </div>
</template>

<script>
import { userAPI } from '../api/ApiIndex';
import { Message } from 'element-ui';

export default {
  name: 'LoginRegister',
  data() {
      return {
          loading: false,
          formData: {
              userId: '',
              username: '',
              email: '',
              password: '',
              confirmPassword: ''
          },
          formRules: {
              userId: [
                  { required: true, message: '请输入用户ID', trigger: 'blur' },
                  { min: 3, message: '用户ID长度不能少于3位', trigger: 'blur' }
              ],
              username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 2, message: '用户名长度不能少于2位', trigger: 'blur' }
              ],
              email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
              ],
              password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
              ],
              confirmPassword: [
                  { required: true, message: '请确认密码', trigger: 'blur' },
                  { validator: this.validateConfirmPassword, trigger: 'blur' }
              ]
          }
      };
  },
  methods: {
      validateConfirmPassword(rule, value, callback) {
          if (value !== this.formData.password) {
              callback(new Error('两次密码输入不一致'));
          } else {
              callback();
          }
      },

      async handleRegister() {
          // 验证表单
          try {
              await this.$refs.registerForm.validate();
          } catch (error) {
              Message.error('请完善注册信息');
              return;
          }

          this.loading = true;
          try {
              // 准备注册数据 - 适配 Mock 接口的数据结构
              const registerData = {
                  userId: this.formData.userId,
                  username: this.formData.username,
                  email: this.formData.email,
                  password: this.formData.password,
                  confirmPassword: this.formData.confirmPassword
              };

              // 调用注册接口
              const response = await userAPI.register(registerData);
              
              if (response.code === 200) {
                  Message.success(response.message || '注册成功，即将跳转到登录页面');
                  
                  setTimeout(() => {
                      this.$router.push('/login2');
                  }, 1500);
              } else {
                  Message.error(response.message || '注册失败，请重试');
              }
          } catch (error) {
              console.error('注册失败:', error);
              
              if (error.response && error.response.data) {
                  Message.error(error.response.data.message || '注册失败');
              } else if (error.message) {
                  Message.error(error.message);
              } else {
                  Message.error('网络请求失败，请检查连接');
              }
          } finally {
              this.loading = false;
          }
      }
  }
};
</script>

<style scoped>
.register-container {
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background: linear-gradient(135deg, #D9EBEE 0%, #C2F1D1 100%);
padding: 20px;
}

.register-form {
background: #FCFCE3;
padding: 30px;
border-radius: 8px;
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
width: 100%;
max-width: 450px;
display: flex;
flex-direction: column;
min-height: auto;
max-height: none;
overflow: visible;
}

.register-form h2 {
text-align: center;
margin: 0 0 20px 0;
color: #333;
font-size: 24px;
}

/* 表单区域 - 重新设计布局 */
.form-section {
display: flex;
flex-direction: column;
gap: 20px;
}

/* 表单输入区域 - 可滚动 */
.form-container {
flex: 1;
display: flex;
flex-direction: column;
gap: 16px;
max-height: 55vh; /* 限制表单区域高度 */
overflow-y: auto; /* 只在表单区域内部滚动 */
padding-right: 5px;
}

/* 表单操作区域 - 固定位置 */
.form-actions {
display: flex;
flex-direction: column;
gap: 20px;
flex-shrink: 0; /* 防止被压缩 */
}

/* 自定义滚动条 */
.form-container::-webkit-scrollbar {
width: 4px;
}

.form-container::-webkit-scrollbar-track {
background: #f1f1f1;
border-radius: 2px;
}

.form-container::-webkit-scrollbar-thumb {
background: #c1c1c1;
border-radius: 2px;
}

.form-container::-webkit-scrollbar-thumb:hover {
background: #a8a8a8;
}

/* ElementUI 表单样式调整 */
:deep(.el-form-item__label) {
text-align: left;
padding: 0 0 8px 0 !important;
font-weight: bold;
color: #555;
line-height: 1.5;
float: none;
display: block;
}

:deep(.el-form-item__content) {
margin-left: 0 !important;
line-height: normal;
}

:deep(.el-form-item) {
display: flex;
flex-direction: column;
margin-bottom: 0;
}

:deep(.el-form-item__error) {
padding-top: 4px;
line-height: 1.2;
font-size: 12px;
color: #ed4014;
white-space: normal;
word-break: break-all;
position: relative;
top: 0;
left: 0;
}

/* 注册按钮样式调整 */
.button-item {
margin: 10px 0;
}

/* 信息区域 */
.info-section {
display: flex;
flex-direction: column;
gap: 15px;
}

.test-info {
padding: 15px;
background: #f8f9fa;
border-radius: 6px;
border-left: 4px solid #ff9900;
font-size: 12px;
color: #666;
}

.test-info p {
margin: 5px 0;
}

.test-info p:first-child {
font-weight: bold;
color: #ff9900;
margin-bottom: 8px;
}

/* 调整 ElementUI 输入框样式 */
:deep(.el-input) {
width: 100%;
}

:deep(.el-input__inner) {
border-radius: 4px;
height: 40px;
line-height: 40px;
}

:deep(.el-button) {
border-radius: 4px;
height: 40px;
font-size: 16px;
margin-top: 8px;
width: 100%;
}

.login-link {
text-align: center;
padding-top: 1rem;
border-top: 1px solid #eee;
}

.login-link a {
color: #007bff;
text-decoration: none;
font-weight: bold;
}

.login-link a:hover {
text-decoration: underline;
}

.login-link p {
margin: 0;
color: #666;
}

/* 响应式调整 */
@media (max-height: 700px) {
.form-container {
  max-height: 45vh;
}
}

@media (max-height: 600px) {
.form-container {
  max-height: 40vh;
  gap: 12px;
}

.form-section {
  gap: 15px;
}
}

@media (max-width: 480px) {
.register-form {
  padding: 20px;
}
}
</style>