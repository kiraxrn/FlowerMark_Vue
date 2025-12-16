<template>
  <div id="app">
      <router-view></router-view>
  </div>
  </template>
  <script>
  
  export default {
    name: 'app' ,
    mounted() {
      // 应用启动时检查登录状态并获取用户信息
      const userId = sessionStorage.getItem('userId')
      if (userId && !this.$store.state.user.userInfo) {
        this.$store.dispatch('user/fetchUserInfo')
      }
    } 
  };

  </script>
<style>
/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

#app {
  min-height: 100vh;
}
</style>
