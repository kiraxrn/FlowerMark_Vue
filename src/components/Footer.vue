<template>
  <el-footer height="auto" class="app-footer">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="24" class="footer-content">
          <p>&copy; 花鸟购物网站. 保留所有权利.</p>
          <div class="footer-links">
            <el-link href="#" :underline="false">关于我们</el-link>
            <el-link href="#" :underline="false">帮助中心</el-link>
            <el-link href="#" :underline="false">隐私政策</el-link>
            <el-link href="#" :underline="false">联系我们</el-link>
          </div>
        </el-col>
      </el-row>
  </el-footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background-color: #C2F1D1;
  color: #000000;
  padding: 2rem 0;
  margin-top: auto;
  z-index: 2;
  width: 100%;
  height: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.footer-content p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links .el-link {
  color: #6c757d;
  font-size: 14px;
}

.footer-links .el-link:hover {
  color: #007bff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-links {
    gap: 10px;
  }
  
  .footer-content {
    padding: 0 15px;
  }
}
</style>