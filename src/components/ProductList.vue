<template>
    <div class="product-container">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in commodities" :key="index">
          <el-card class="product-card">
            <el-link :href="`/product/${item.comId}`">
              <el-image 
                :src="item.comPicture || 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664'"
                fit="cover"
                class="product-img"
              ></el-image>
            </el-link>
            <div slot="footer" class="product-info">
              <div>{{ item.comName }}</div>
              <div class="price">¥{{ item.price }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      commodities: {
        type: Array,
        default: () => []
      }
    }
  }
  </script>
  
  <style scoped>
  .product-container {
    margin-top: 20px;
  }
  .product-card {
    height: 100%;
  }
  .product-img {
    width: 100%;
    height: 250px;
  }
  .product-info {
    text-align: center;
  }
  .price {
    color: #f56c6c;
    font-weight: bold;
    margin-top: 5px;
  }
  </style>