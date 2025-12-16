<template>
  <div class="container0">
    <el-form ref="loginForm" :model="form" :rules="rules" class="container1">
      <div class="container1_1">
        <el-form-item prop="username" label="账号：">
          <el-input 
            v-model="form.username"
            placeholder="请输入账号"
            size="large"
            clearable
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password" label="密码：">
          <el-input 
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          >
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleLogin" 
            :loading="loading"
            style="width: 100%;"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <router-link to="/login3">
            <el-button type="primary" size="large" style="width: 100%;">注册</el-button>
          </router-link>
        </el-form-item>
        
        <!-- 添加测试账号提示 -->
        <el-form-item>
          <div class="test-account">
            <p>测试账号：</p>
            <p>账号: admin, 密码: 123456</p>
            <p>账号: user01, 密码: 123456</p>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { userAPI } from '../api/ApiIndex';
import { Message } from 'element-ui';

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  mounted() {
    // 检查是否已登录，如果已登录则跳转到首页
    const token = sessionStorage.getItem('token');
    if (token) {
      this.$router.push('/main');
    }
  },
  methods: {
    async handleLogin() {
      // 验证表单
      try {
        await this.$refs.loginForm.validate();
      } catch (error) {
        Message.error('请完善登录信息');
        return;
      }

      this.loading = true;
      try {
        console.log('发送登录请求:', this.form);
        const response = await userAPI.login(this.form.username, this.form.password);
        console.log('登录响应:', response);
        
        // 修改这里的判断逻辑
        if (response && (response.code === 200 || (response.data && response.data.token))) {
          // 统一处理响应数据
          const responseData = response.data || response;
          const token = responseData.token;
          const userInfo = responseData.userInfo || responseData;
          
          if (!token) {
            Message.error('登录失败：未获取到token');
            return;
          }
          
          // 存储用户信息到 sessionStorage
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userId', userInfo.userId || userInfo.id);
          sessionStorage.setItem('username', userInfo.username);
          
          console.log('sessionStorage 设置完成:', {
            token: sessionStorage.getItem('token'),
            userId: sessionStorage.getItem('userId'),
            username: sessionStorage.getItem('username')
          });
          
          // 确保 store 存在再调用
          if (this.$store && this.$store.dispatch) {
            try {
              await this.$store.dispatch('user/updateUserInfo', userInfo);
              console.log('Vuex store 更新成功');
            } catch (storeError) {
              console.warn('Vuex store 更新失败，但不影响登录:', storeError);
            }
          }
          
          Message.success(response.message || '登录成功');
          
          // 直接跳转，确保 router 存在
          if (this.$router) {
            console.log('跳转到 /main');
            this.$router.push('/main').catch(err => {
              console.error('路由跳转失败:', err);
              // 如果跳转失败，重载页面到首页
              window.location.href = '/main';
            });
          } else {
            window.location.href = '/main';
          }
        } else {
          console.error('登录失败，响应码:', response.code);
          Message.error(response.message || '登录失败');
        }
      } catch (error) {
        console.error('登录请求失败:', error);
        // 更详细的错误信息
        if (error.response) {
          console.error('响应数据:', error.response.data);
          console.error('响应状态:', error.response.status);
          Message.error(error.response.data?.message || `登录失败 (${error.response.status})`);
        } else if (error.request) {
          console.error('请求已发送但无响应:', error.request);
          Message.error('网络请求失败，请检查连接');
        } else {
          console.error('请求配置错误:', error.message);
          Message.error('登录失败: ' + error.message);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.container0 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #D9EBEE 0%, #C2F1D1 100%);
}

.container1 {
  width: 400px;
  padding: 40px;
  background: #FCFCE3;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.container1_1 {
  width: 100%;
}

.test-account {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #19be6b;
  font-size: 12px;
  color: #666;
}

.test-account p {
  margin: 5px 0;
}

.test-account p:first-child {
  font-weight: bold;
  color: #19be6b;
  margin-bottom: 8px;
}
</style>