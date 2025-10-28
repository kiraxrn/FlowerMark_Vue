<template>
    <div class="group0">
      <img id='flower' class='flower' src='../assets/img/Mask_group.png'/>
      
      <!-- 头像区域 -->
      <div class="profile-section">
        <el-link :href="'/login2'">
          <el-avatar :src="userpicture || '../assets/img/Avatar.png'" size="large"></el-avatar>
        </el-link>
        <div class="username">{{ username || '用户名' }}</div>
      </div>
  
      <!-- 右上角图标 -->
      <div class="icons">
        <el-link :href="'/main'">
          <el-image src="../assets/img/Refresh.png" class="icon-img"></el-image>
        </el-link>
        <el-link :href="'/cart'">
          <el-image src="../assets/img/Shopee.png" class="icon-img"></el-image>
        </el-link>
        <el-link :href="'/settings'">
          <el-image src="../assets/img/Services.png" class="icon-img"></el-image>
        </el-link>
      </div>
  
      <!-- 搜索框 -->
      <el-form inline class="search-form">
        <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form>
  
      <!-- 导航栏 -->
      <div class="group1">
        <el-menu mode="horizontal" background-color="#FFF8AC" text-color="#000" active-text-color="#A8143E">
          <el-menu-item index="1"><el-link :href="'/main'">首页</el-link></el-menu-item>
          <el-menu-item index="2"><el-link :href="'/tongcheng'">同城好物</el-link></el-menu-item>
          <el-menu-item index="3"><el-link :href="'/miaosha'">特惠秒杀</el-link></el-menu-item>
          <el-menu-item index="4"><el-link :href="'/help'">帮助|反馈</el-link></el-menu-item>
        </el-menu>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchText: '',
        username: '',
        userpicture: ''
      }
    },
    methods: {
      handleSearch() {
        // 搜索逻辑实现
        console.log('搜索内容:', this.searchText)
      }
    }
  }
  </script>
  
  <style scoped>
  /* 保留原CSS中相关样式 */
  .icon-img {
    width: 30px;
    height: 30px;
    margin: 0 5px;
  }
  .search-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  /* 其他样式继承原CSS */
  </style>