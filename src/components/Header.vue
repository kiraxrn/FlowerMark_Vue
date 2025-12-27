<template>
  <div class="group0">
    <!-- 顶部区域（包含背景图片） -->
    <div class="top-section">
      <!-- 左上角头像和用户名 -->
      <div class="profile-section">
        <router-link to="/login2">
          <img 
            class="profile_picture"
            :src="userPicture" 
            alt="Profile Picture"
          >
        </router-link>
        <div class="username">{{ userName || '用户名' }}</div>
      </div>

      <!-- 右上角图标 -->
      <div class="icons">
        <router-link to="/main">
          <i class="el-icon-s-home"></i>
        </router-link>
        <router-link to="/cart">
          <i class="el-icon-shopping-cart-full"></i>
        </router-link>
        <router-link to="/settings">
          <i class="el-icon-setting services-icon"></i>
        </router-link>
      </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-container">
      <form @submit.prevent="handleSearch" class="search-form">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索商品..."
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <i class="el-icon-search"></i>
              搜索
            </el-button>
          </template>
        </el-input>
      </form>
    </div>
    
    <!-- 主导航栏 -->
    <div class="group1">
      <ul class="nav-list">
        <li>
          <router-link 
            to="/main" 
            :class="{ 'nav-active': isActiveNav('/main') }"
          >
            <i class="el-icon-s-home"></i> 首页
          </router-link>
        </li>
        <li>
          <router-link 
            to="/tongcheng" 
            :class="{ 'nav-active': isActiveNav('/tongcheng') }"
          >
            <i class="el-icon-location"></i> 同城好物
          </router-link>
        </li>
        <li>
          <router-link 
            to="/miaosha" 
            :class="{ 'nav-active': isActiveNav('/miaosha') }"
          >
            <i class="el-icon-alarm-clock"></i> 特惠秒杀
          </router-link>
        </li>
        <li>
          <router-link 
            to="/help" 
            :class="{ 'nav-active': isActiveNav('/help') }"
          >
            <i class="el-icon-question"></i> 帮助|反馈
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  data() {
    return {
      searchQuery: '',
      navRoutes: {
        '/main': ['/', '/main'],
        '/tongcheng': ['/tongcheng'],
        '/miaosha': ['/miaosha'],
        '/help': ['/help']
      },
      localAvatar: null // 新增：本地头像缓存
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    
    userPicture() {
      // 如果本地有头像，使用本地
      if (this.localAvatar) return this.localAvatar;
      
      // 如果Vuex有头像，使用Vuex
      if (this.userInfo?.avatar) return this.userInfo.avatar;
      
      // 否则返回默认头像路径
      return require('@/assets/img/Avatar.png');
    },
    
    userName() {
      return this.userInfo?.username || '用户名';
    }
  },
  mounted() {
    this.fetchUserInfoIfNeeded();
    
    // 监听头像更新事件
    this.setupAvatarListeners();
  },
  beforeDestroy() {
    // 清理事件监听器
    if (typeof window !== 'undefined') {
      window.removeEventListener('userAvatarChanged', this.handleAvatarChange);
    }
  },
  methods: {
    ...mapActions('user', ['fetchUserInfo', 'updateUserAvatar']),
    
    // 设置头像监听器
    setupAvatarListeners() {
      // 监听自定义事件
      if (typeof window !== 'undefined') {
        window.addEventListener('userAvatarChanged', (event) => {
          this.localAvatar = event.detail.avatar;
          this.$forceUpdate();
        });
      }
      
      // 监听Vuex变化
      this.$store.watch(
        (state) => {
          // 安全地获取 avatar
          return state.user?.userInfo?.avatar || null;
        },
        (newAvatar) => {
          if (newAvatar && newAvatar !== this.localAvatar) {
            this.localAvatar = newAvatar;
          }
        },
      );
      
      // 检查sessionStorage中是否有保存的头像
      const savedAvatar = sessionStorage.getItem('userAvatar');
      if (savedAvatar) {
        this.localAvatar = savedAvatar;
      }
    },
    
    async fetchUserInfoIfNeeded() {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        await this.fetchUserInfo();
        
        // 检查并更新本地头像缓存
        if (this.userInfo?.avatar) {
          this.localAvatar = this.userInfo.avatar;
        }
      }
    },
    
    handleSearch() {
      if (!this.searchQuery.trim()) {
        this.$message.warning('请输入搜索关键词');
        return;
      }
      
      console.log('Header搜索关键词:', this.searchQuery);
      
      // 跳转到同城页面并传递搜索参数
      if (this.$route.path !== '/tongcheng') {
        // 如果不在同城页面，跳转到同城页面并传递搜索参数
        this.$router.push({
          path: '/tongcheng',
          query: { search: this.searchQuery }
        });
      } else {
        // 如果已经在同城页面，触发搜索事件
        this.$emit('search', this.searchQuery);
        
        // 或者使用事件总线触发搜索
        if (this.$bus) {
          this.$bus.$emit('header-search', this.searchQuery);
        }
      }
      
      this.$message.success(`正在搜索: ${this.searchQuery}`);
    },
    
    isActiveNav(route) {
      // 导航激活状态判断
      return this.$route.path.includes(route);
    }
  }
}
</script>

<style scoped>
/* 头部容器 */
.group0 {
  width: 100%;
  height: 230px;
  min-height: 180px;
  box-sizing: border-box;
  background-color: #C2F1D1;
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0; 
  padding: 0;
  overflow: hidden; 
}

/* 顶部区域 - 设置为背景图片容器 */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-bottom: 15px;
  height: 200px; /* 设置固定高度以适应背景图片 */
  width: 100%;
  /* 背景图片设置 */
  background-image: url('../assets/img/headerTop.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* 用户信息区域 - 左上角 */
.profile-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 20px;
  flex-shrink: 0;
  min-width: fit-content;
}
.profile_picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  flex-shrink: 0;
}

.username {
  font-size: 16px;
  font-weight: bold;
  color: #fef7f7;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* 右上角图标 */
.icons {
  position: absolute;
  top: 5px;     
  right: 5px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  flex-shrink: 0;
  min-width: fit-content;
}

.icons i {
  font-size: 35px;
  color: #fff;
  transition: all 0.3s;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));
}

.icons i:hover {
  transform: scale(1.1);
  color: #4CAF50;
}

.icons .refresh-icon {
  font-size: 40px;
}

/* 搜索框容器 */
.search-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 ;
  width: 100%;
}

.search-form {
  display: flex;
  width: 500px;
  max-width: 100%;
}
.search-container .el-input {
  width: 500px;
  max-width: 100%;
}

.search-container .el-input__inner {
  height: 40px;
  line-height: 40px;
}

/* 修改搜索按钮样式 */
.search-container .el-button {
  height: 40px;
  background-color: #2c2f2c !important;
  border-color: #2c2f2c !important;
  color: white !important;
  transition: background-color 0.3s;
}

.search-container .el-button:hover {
  background-color: #4CAF50 !important;
  border-color: #4CAF50 !important;
  color: white !important;
}

/* 确保输入框和按钮高度一致 */
.search-container .el-input-group__append,
.search-container .el-input-group__prepend {
  height: 40px;
}
/* 主导航栏 */
.group1 {
  width: 100%;
  background: #FFF8AC;
  box-sizing: border-box;
  margin-top: 10px;
  position: relative;
  z-index: 1;
  border-radius: 8px 8px 0 0;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  justify-content: space-around;
  width: 100%;
}
.nav-list li{
  width: 100%;
}
.nav-list a {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  height: 100%;
  padding: 12px 0;
  transition: all 0.3s ease;
  width: 100%;
}
.nav-list i {
  margin-right: 5px;
  font-size: 16px;
}
/* 悬停效果 */
.nav-list li:hover {
  background-color: rgba(246, 190, 140, 0.3);
}

.nav-list a:hover:not(.nav-active) {
  background-color: #FFE4C9;
  color: #E67E22;
  transform: translateY(-2px);
}

/* 导航激活状态 */
.nav-list a.nav-active {
  background-color: #F6BE8C;
  color: white;
  border-radius: 10px 10px 0 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .group0 {
    min-height: 160px;
    padding: 8px 15px;
  }
  
  .top-section {
    height: 80px;
    padding: 0 10px;
  }
  
  .search-form {
    width: 100%;
    max-width: 300px;
  }
  
  .nav-list a {
    font-size: 14px;
    padding: 10px 5px;
  }
  
  .profile_picture {
    width: 40px;
    height: 40px;
  }
  
  .username {
    font-size: 14px;
  }
  
  .top-section {
    margin-bottom: 12px;
  }
  
  .icons {
    gap: 12px;
  }
  
  .icons i {
    font-size: 22px;
  }
  
  .nav-list i {
    font-size: 14px;
    margin-right: 3px;
  }
}

@media (max-width: 480px) {
  .group0 {
    min-height: 140px;
    padding: 5px 10px;
  }
  
  .top-section {
    height: 70px;
    padding: 0 8px;
  }
  
  .nav-list i {
    font-size: 12px;
    margin-right: 2px;
  }
  
  .profile_picture {
    width: 35px;
    height: 35px;
  }
  
  .username {
    font-size: 12px;
  }
  
  .icons {
    gap: 10px;
  }
  
  .icons i {
    font-size: 20px;
  }
  
  .search-container {
    margin: 6px 0 10px 0;
  }
}
</style>