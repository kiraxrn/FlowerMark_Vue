<template>
    <div class="group2">
      <el-card>
        <div slot="header" class="classify-title">分类</div>
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <el-link :href="'/classify1'">迎宾花卉</el-link>
          </el-menu-item>
          <el-menu-item index="2">景观植物</el-menu-item>
          <el-menu-item index="3">客厅装饰植物</el-menu-item>
          <el-menu-item index="4">花种</el-menu-item>
          <el-menu-item index="5">画眉</el-menu-item>
          <el-menu-item index="6">鸟类用品</el-menu-item>
          <el-menu-item index="7">园艺工具</el-menu-item>
        </el-menu>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar'
  }
  </script>
  
  <style scoped>
  .classify-title {
    font-size: 24px;
    font-weight: bold;
    font-family: "黑体";
  }
  .el-menu-vertical-demo {
    border-right: none;
  }
  </style>