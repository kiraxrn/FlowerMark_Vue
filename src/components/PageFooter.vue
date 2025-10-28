<template>
    <footer class="footer">
      <div class="container">
        <p>&copy; 花鸟购物网站. 保留所有权利.</p>
        <div class="footer-links">
          <el-link href="#">关于我们</el-link>
          <el-link href="#">帮助中心</el-link>
          <el-link href="#">隐私政策</el-link>
          <el-link href="#">联系我们</el-link>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: #C2F1D1;
    color: #000000;
    padding: 2rem 0;
    width: 100%;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer-links {
    margin-top: 1rem;
  }
  .footer-links .el-link {
    margin: 0 0.8rem;
    color: #000;
  }
  </style>