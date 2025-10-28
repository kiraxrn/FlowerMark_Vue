<template>
    <el-carousel height="70%" indicator-position="outside">
      <el-carousel-item v-for="(item, index) in images" :key="index">
        <el-image :src="item" fit="cover" style="width: 100%; height: 100%;"></el-image>
      </el-carousel-item>
    </el-carousel>
  </template>
  
  <script>
  export default {
    data() {
      return {
        images: [
          "../assets/img/pexels-aditya-aiyar-615049-1407325.jpg",
          "../assets/img/pexels-billelmoula-542517.jpg",
          "../assets/img/pexels-hieu-641561.jpg",
          "../assets/img/pexels-pixabay-46166.jpg",
          "../assets/img/pexels-roshan-kamath-793618-1661179.jpg",
          "../assets/img/pexels-suzyhazelwood-1578105.jpg"
        ]
      }
    }
  }
  </script>