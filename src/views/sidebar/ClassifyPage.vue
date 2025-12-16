<!-- src/views/sidebar/ClassifyPage.vue -->
<template>
  <div class="classify-container">
    <AppHeader :user-picture="userpicture" :user-name="username" />
    <div class="classifymain2">
      <!-- 侧边栏组件 -->
      <AppSidebar />
      
      <!-- 主内容区 -->
      <div class="classifygroup3">
        <!-- 显示具体的分类页面内容 -->
        <router-view></router-view>
        
        <!-- 当没有选择具体分类时显示默认内容 -->
        <div v-if="!$route.params.category" class="default-content">
          <h2>请选择分类</h2>
          <p>从左侧选择您感兴趣的商品分类</p>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import AppHeader from '../../components/Header.vue';
import AppFooter from '../../components/Footer.vue';

export default {
  name: 'ClassifyPage',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  data() {
    return {
      userpicture: '',  
      username: '', 
    }
  },
  mounted() {
    console.log('ClassifyPage mounted, current route:', this.$route.path);
  }
}
</script>

<style scoped>
.classify-container {
  min-height: 100vh;
  background: #FCFCE3;
}
.classifymain2 {
    display: flex;
    flex: 1;
    background: #FCFCE3;
    min-height: calc(100vh - 120px);
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  /* 主内容区 */
  .classifygroup3 {
    background: #FFDCDC;
    border-radius: 15px;
    flex: 1;
    margin: 20px 20px 20px 0px;
    padding: 20px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    width: calc(100% - 40px);
  }
.default-content {
  text-align: center;
  padding: 50px;
  color: #666;
}

.default-content h2 {
  margin-bottom: 20px;
}
@import '../../assets/css/classify.css';
</style>