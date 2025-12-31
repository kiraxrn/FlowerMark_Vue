<template>
  <div class="container">
    <h1 class="page-title">账户设置</h1>
    
    <!-- 头像选择 -->
    <el-card class="form-section">
      <div slot="header" class="clearfix">
        <h2 class="section-title">个人头像</h2>
      </div>
      <div class="avatar-section">
        <div class="avatar-display">
          <img :src="displayAvatar"
               alt="Profile Picture"
               class="avatar-preview"
               id="avatarPreview">
          <div class="avatar-username">{{ user.username }}</div>
        </div>
        <div class="avatar-selection">
          <el-alert
            title="点击下方头像选择新头像，然后点击保存"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 20px;"
          />
          
          <div class="avatar-library">
            <div 
              v-for="(avatar, index) in avatarOptions" 
              :key="index"
              class="avatar-option"
              :class="{ 'avatar-selected': selectedAvatar === avatar.url }"
              @click="selectAvatar(avatar)">
              <img 
                :src="avatar.url" 
                :alt="avatar.name"
                class="avatar-thumbnail">
              <div class="avatar-name">{{ avatar.name }}</div>
            </div>
          </div>
          
          <div class="avatar-actions">
            <el-button 
              type="primary" 
              :icon="uploading ? 'el-icon-loading' : 'el-icon-check'"
              :loading="uploading"
              @click="updateAvatar"
              :disabled="!selectedAvatar">
              保存头像
            </el-button>
            <el-button @click="resetAvatar" style="margin-left: 10px">重置默认</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 基本信息 -->
    <el-card class="form-section">
      <div slot="header" class="clearfix">
        <h2 class="section-title">基本信息</h2>
      </div>
      <el-form 
        ref="basicForm" 
        :model="user" 
        :rules="rules"
        label-width="120px"
        class="custom-form"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="user.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
            autocomplete="username"
            style="max-width: 400px;"
          />
        </el-form-item>
        
        <el-form-item label="电子邮箱：" prop="email">
          <el-input
            v-model="user.email"
            type="email"
            placeholder="请输入电子邮箱"
            prefix-icon="el-icon-message"
            clearable
            autocomplete="email"
            style="max-width: 400px;"
          />
        </el-form-item>
        
        <el-form-item class="form-actions">
          <el-button type="primary" icon="el-icon-check" @click="saveBasicInfo">
            保存修改
          </el-button>
          <el-button @click="resetBasicInfo">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 密码修改 -->
    <el-card class="form-section">
      <div slot="header" class="clearfix">
        <h2 class="section-title">修改密码</h2>
      </div>
      <el-form 
        ref="passwordForm" 
        :model="passwords" 
        :rules="passwordRules"
        label-width="120px"
        class="custom-form"
      >
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-input
            v-model="passwords.oldPassword"
            :type="passwords.showOldPassword ? 'text' : 'password'"
            placeholder="请输入旧密码"
            prefix-icon="el-icon-lock"
            :suffix-icon="passwords.showOldPassword ? 'el-icon-turn-off' : 'el-icon-view'"
            @click:suffix="togglePasswordVisibility('oldPassword')"
            clearable
            autocomplete="current-password"
            style="max-width: 400px;"
          />
        </el-form-item>
        
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            v-model="passwords.newPassword"
            :type="passwords.showNewPassword ? 'text' : 'password'"
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
            :suffix-icon="passwords.showNewPassword ? 'el-icon-turn-off' : 'el-icon-view'"
            @click:suffix="togglePasswordVisibility('newPassword')"
            clearable
            autocomplete="new-password"
            style="max-width: 400px;"
          />
        </el-form-item>
        
        <el-alert
          title="密码长度建议 6-20 位，包含字母和数字"
          type="warning"
          :closable="false"
          show-icon
          style="max-width: 400px; margin: 0 0 20px 120px;"
        />
        
        <el-form-item class="form-actions">
          <el-button type="warning" icon="el-icon-lock" @click="changePassword">
            修改密码
          </el-button>
          <el-button @click="resetPasswordForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮组 -->
    <el-card class="action-section">
      <div class="action-buttons">
        <el-button type="info" icon="el-icon-refresh" @click="fetchUserInfo">刷新数据</el-button>
        <el-button type="success" icon="el-icon-check" @click="saveAllChanges">保存所有更改</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { userAPI } from '../api/ApiIndex';
  
export default {
  name: 'AccountSettings',
  data() {
    // 密码验证器
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度必须在 6-20 位之间'));
      } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(value)) {
        callback(new Error('密码必须包含字母和数字'));
      } else if (rule.field === 'newPassword' && value === this.passwords.oldPassword) {
        callback(new Error('新密码不能与旧密码相同'));
      } else {
        callback();
      }
    };

    // 邮箱验证器
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱地址'));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        callback(new Error('请输入正确的邮箱格式'));
      } else {
        callback();
      }
    };

    return {
      user: {
        userId: '',
        userpicture: '',
        username: '',
        email: ''
      },
      originalUser: {
        username: '',
        email: ''
      },
      passwords: {
        oldPassword: '',
        newPassword: '',
        showOldPassword: false,
        showNewPassword: false
      },
      selectedAvatar: null,
      uploading: false,
      
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: ['blur', 'change'] }
        ]
      },
      
      passwordRules: {
        oldPassword: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      },
      
      // 预设头像库
      avatarOptions: [
        { 
          name: '默认头像', 
          url: require('@/assets/img/Avatar.png') 
        },
        { 
          name: '头像1', 
          url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop' 
        },
        { 
          name: '头像2', 
          url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=500&fit=crop' 
        },
        { 
          name: '头像3', 
          url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=500&fit=crop' 
        },
        { 
          name: '头像4', 
          url: require('@/assets/img/pexels-aditya-aiyar-615049-1407325.jpg')
        },
        { 
          name: '头像5', 
          url: require('@/assets/img/pexels-billelmoula-542517.jpg')
        },
        { 
          name: '头像6', 
          url: require('@/assets/img/pexels-hieu-641561.jpg')
        },
        { 
          name: '头像7', 
          url: require('@/assets/img/pexels-pixabay-46166.jpg')
        },
        { 
          name: '头像8', 
          url: require('@/assets/img/pexels-roshan-kamath-793618-1661179.jpg')
        },
        { 
          name: '头像9', 
          url: require('@/assets/img/pexels-suzyhazelwood-1578105.jpg')
        }
      ]
    }
  },
  async mounted() {
    await this.fetchUserInfo();
    // 保存原始数据用于重置
    this.originalUser = { ...this.user };
  },
  computed: {
    displayAvatar() {
      return this.user.userpicture || require('@/assets/img/Avatar.png');
    },
    hasBasicChanges() {
      return this.user.username !== this.originalUser.username || 
             this.user.email !== this.originalUser.email;
    },
    hasAvatarChanged() {
      return this.selectedAvatar && this.selectedAvatar !== this.user.userpicture;
    }
  },
  methods: {
    togglePasswordVisibility(field) {
      if (field === 'oldPassword') {
        this.passwords.showOldPassword = !this.passwords.showOldPassword;
      } else if (field === 'newPassword') {
        this.passwords.showNewPassword = !this.passwords.showNewPassword;
      }
    },
    async fetchUserInfo() {
      try {
        const userId = sessionStorage.getItem('userId');
        
        if (userId) {
          // 先检查是否有本地保存的头像
          const savedAvatar = sessionStorage.getItem('userAvatar');
          if (savedAvatar) {
            this.user.userpicture = savedAvatar;
          }
          
          // 再从API获取
          const response = await userAPI.getUserInfo(userId);
          
          if (response.code === 200 && response.data) {
            // 优先使用本地头像，其次用API返回的头像
            this.user.userpicture = savedAvatar || response.data.avatar || '';
            this.user.username = response.data.username || '';
            this.user.email = response.data.email || '';
            
            // 更新Vuex
            this.$store.dispatch('user/updateUserInfo', {
              avatar: this.user.userpicture,
              username: this.user.username,
              email: this.user.email
            });
            
            // 保存到sessionStorage
            if (response.data.avatar && !savedAvatar) {
              sessionStorage.setItem('userAvatar', response.data.avatar);
            }
            
            this.$message({
              message: '用户信息加载成功',
              type: 'success',
              duration: 2000
            });
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.$message.error('获取用户信息失败');
      }
    },
    // 选择头像
    selectAvatar(avatar) {
      this.selectedAvatar = avatar.url;
      // 预览选中的头像
      document.getElementById('avatarPreview').src = avatar.url;
    },
    // 更新头像
    async updateAvatar() {
  if (!this.selectedAvatar) {
    this.$message.warning('请选择要使用的头像');
    return;
  }

  this.uploading = true;
  try {
    const userId = sessionStorage.getItem('userId') || this.user.userId || '1001';
    
    console.log('🌐 头像上传请求:', {
      userId,
      avatar: this.selectedAvatar
    });
    
    // 调用 API
    const response = await userAPI.uploadAvatar({
      avatar: this.selectedAvatar,
      userId: userId
    });
    
    console.log('📥 完整响应:', response);
    
    // 处理不同类型的响应格式
    let resultData = response;
    
    // 情况1：response 已经是业务数据 {code, data, message}
    if (response && typeof response === 'object') {
      // 检查是否是业务数据格式
      if (response.code !== undefined) {
        resultData = response;
      }
      // 情况2：response 是 Axios 响应对象，data 属性是业务数据
      else if (response.data && response.data.code !== undefined) {
        resultData = response.data;
      }
      // 情况3：response.data 就是业务数据
      else if (response.data) {
        resultData = response.data;
      }
    }
    
    console.log('📊 处理后的数据:', resultData);
    
    // 检查是否成功
    if (resultData && (resultData.code === 200 || resultData.status === 200 || resultData.success)) {
      // 获取头像 URL - 尝试多种可能的字段名
      const avatarUrl = resultData.data?.avatarUrl || 
                       resultData.data?.avatar || 
                       resultData.avatarUrl || 
                       resultData.avatar || 
                       resultData.url || 
                       this.selectedAvatar;
      
      console.log('🖼️ 获取到头像:', avatarUrl);
      
      // 更新本地状态
      this.user.userpicture = avatarUrl;
      this.selectedAvatar = null;
      
      // 更新预览
      const preview = document.getElementById('avatarPreview');
      if (preview) preview.src = avatarUrl;
      
      // 更新 Vuex
      this.$store.dispatch('user/updateUserInfo', {
        avatar: avatarUrl,
        userId: userId
      });
      
      // 保存到 sessionStorage
      sessionStorage.setItem('userAvatar', avatarUrl);
      
      // 触发全局事件
      this.$emit('avatar-updated', avatarUrl);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userAvatarChanged', {
          detail: { avatar: avatarUrl }
        }));
      }
      
      this.$message({
        message: resultData.message || '头像更新成功',
        type: 'success',
        duration: 3000
      });
      
    } else {
      // 失败处理
      const errorMsg = resultData?.message || '头像更新失败';
      console.error('❌ 头像更新失败:', errorMsg, resultData);
      this.$message.error(errorMsg);
    }
    
  } catch (error) {
    console.error('❌ 头像更新异常:', error);
    
    // 更详细的错误信息
    let errorMessage = '头像更新失败';
    if (error.response) {
      errorMessage = `服务器错误: ${error.response.data?.message || error.response.statusText}`;
    } else if (error.request) {
      errorMessage = '网络错误，请检查网络连接';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.$message.error(errorMessage);
  } finally {
    this.uploading = false;
  }
},
    resetAvatar() {
      const defaultAvatar = require('@/assets/img/Avatar.png');
      this.user.userpicture = defaultAvatar;
      this.selectedAvatar = null;
      document.getElementById('avatarPreview').src = defaultAvatar;
      this.$message.info('已重置为默认头像');
    },
    async saveBasicInfo() {
      try {
        // 验证表单
        await this.$refs.basicForm.validate();
        
        const updates = {
          userId: this.user.userId,
          username: this.user.username,
          email: this.user.email,
        };

        const response = await userAPI.updateUserInfo(updates);
        
        if (response.code === 200) {
          this.$store.dispatch('user/updateUserInfo', {
            username: this.user.username
          });
          
          sessionStorage.setItem('username', this.user.username);
          this.originalUser = { ...this.user };
          
          this.$message.success('信息更新成功');
        } else {
          this.$message.error(response.message || '更新失败');
        }
      } catch (error) {
        if (error && error.errors) {
          // 表单验证失败
          console.error('表单验证失败:', error);
        } else {
          console.error('更新用户信息失败:', error);
          this.$message.error('更新失败');
        }
      }
    },
    resetBasicInfo() {
      this.user.username = this.originalUser.username;
      this.user.email = this.originalUser.email;
      this.$refs.basicForm.clearValidate();
      this.$message.info('已重置为原始信息');
    },
    async changePassword() {
      try {
        // 验证表单
        await this.$refs.passwordForm.validate();
        
        // 确保两次密码验证通过后再执行
        const response = await userAPI.changePassword(
          this.passwords.oldPassword, 
          this.passwords.newPassword
        );
        
        if (response.code === 200) {
          this.$message.success('密码修改成功');
          this.resetPasswordForm();
        } else {
          this.$message.error(response.message || '密码修改失败');
        }
      } catch (error) {
        if (error && error.errors) {
          // 表单验证失败，不需要显示额外消息
          console.error('表单验证失败:', error);
        } else {
          console.error('修改密码失败:', error);
          this.$message.error('修改密码失败');
        }
      }
    },
    resetPasswordForm() {
      this.passwords.oldPassword = '';
      this.passwords.newPassword = '';
      this.passwords.showOldPassword = false;
      this.passwords.showNewPassword = false;
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.clearValidate();
      }
      this.$message.info('密码表单已清空');
    },
    saveAllChanges() {
      let hasChanges = false;
      
      if (this.hasBasicChanges) {
        this.saveBasicInfo();
        hasChanges = true;
      }
      if (this.hasAvatarChanged) {
        this.updateAvatar();
        hasChanges = true;
      }
      if (this.passwords.oldPassword || this.passwords.newPassword) {
        this.changePassword();
        hasChanges = true;
      }
      
      if (!hasChanges) {
        this.$message.info('没有需要保存的更改');
      } else {
        this.$message.success('已提交所有更改');
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  color: #17233d;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  color: #17233d;
  margin: 0;
  font-weight: 600;
}

/* 头像区域样式 */
.avatar-section {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  padding: 20px;
}

.avatar-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
  text-align: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e8eaec;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-username {
  font-size: 16px;
  font-weight: 500;
  color: #515a6e;
  max-width: 120px;
  word-break: break-all;
}

.avatar-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-library {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.avatar-option:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-selected {
  border-color: #67c23a;
  background-color: #f0f9eb;
}

.avatar-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
  border: 2px solid #e8eaec;
  transition: all 0.3s ease;
}

.avatar-selected .avatar-thumbnail {
  border-color: #67c23a;
}

.avatar-name {
  font-size: 12px;
  color: #515a6e;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  padding: 10px 0;
}

/* 表单样式 */
.custom-form {
  padding: 20px 20px 10px;
}

::v-deep .el-form-item__label {
  font-weight: 500;
  color: #515a6e;
}

::v-deep .el-input__inner {
  transition: all 0.3s;
}

::v-deep .el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.form-actions {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

::v-deep .form-actions .el-form-item__content {
  margin-left: 0 !important;
}

/* 操作按钮区域 */
.action-section {
  margin-top: 30px;
  text-align: center;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .avatar-section {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 10px;
  }
  
  .avatar-library {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .avatar-thumbnail {
    width: 50px;
    height: 50px;
  }
  
  .avatar-actions {
    justify-content: center;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .custom-form {
    padding: 10px 10px 0;
  }
  
  ::v-deep .el-form-item__label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .avatar-library {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .avatar-thumbnail {
    width: 40px;
    height: 40px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .page-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 16px;
  }
}

/* 滚动条样式 */
.avatar-library::-webkit-scrollbar {
  width: 6px;
}

.avatar-library::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.avatar-library::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.avatar-library::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element UI 组件覆盖样式 */
::v-deep .el-card__header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  padding: 15px 20px;
}

::v-deep .el-card__body {
  padding: 0;
}

::v-deep .el-alert {
  border-radius: 6px;
}

::v-deep .el-alert--info {
  background-color: #f4f4f5;
  color: #909399;
  border-color: #e9e9eb;
}

::v-deep .el-alert--warning {
  background-color: #fdf6ec;
  color: #e6a23c;
  border-color: #f5dab1;
}
</style>