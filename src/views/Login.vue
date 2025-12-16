<!-- src/views/Login.vue -->
<template>
  <div class="container0">
    <div class="container1">
  
      <!-- 按钮 -->
      <button type="button" class="inter" id="seller" 
              :class="{ active: activeButton === 0 }"
              @click="handleButtonClick(0)">注册</button>
      <button type="button" class="inter" id="use" 
              :class="{ active: activeButton === 1 }"
              @click="handleButtonClick(1)">登录</button>
  
      <!-- 使用 SVG 绘制圆形 -->
      <svg id="circle"
        width="162"
        height="151"
        viewBox="0 0 162 151"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="81" cy="75.5" rx="81" ry="75.5" fill="#2C2C2C"></ellipse>
      </svg>
  
      <!-- 用户图标 -->
      <i class="el-icon-user" style="font-size: 115px; color: #70A2F1; position: absolute; top: 208px; left: 50%; transform: translateX(-50%); filter: drop-shadow(0 4px 8px rgba(112,162,241,.25));"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      activeButton: null,
      isNavigating: false
    };
  },
  methods: {
    handleButtonClick(index) {
      // 防止重复点击
      if (this.isNavigating) return;
      
      this.isNavigating = true;
      this.activeButton = index;
      
      // 延迟导航，让用户看到点击效果
      setTimeout(() => {
        const targetPath = index === 0 ? '/login3' : '/login2';
        this.$router.push(targetPath);
        
        // 重置状态
        setTimeout(() => {
          this.activeButton = null;
          this.isNavigating = false;
        }, 1000);
      }, 500);
    }
  }
}
</script>

<style scoped>

/* ========= 基础布局 ========= */
.container0{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #D9EBEE 0%, #C2F1D1 100%);
}
.container1{
  position:relative;
  width:320px;
  height:420px;
  background: #FCFCE3;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}


/* ========= 按钮 ========= */
.inter{
  position:absolute;
  width:130px;
  height:44px;
  border:none;
  border-radius:22px;
  background:#c7d9f1;
 
  font-size:16px;
  cursor:pointer;
  transition:all .25s ease;
  z-index:10;
  top:130px;
}
.inter:focus{outline:3px solid var(--primary-dark);outline-offset:2px}
#seller{left:25px}
#use{right:25px}

.inter:hover{
  background:#dee2e6;
  transform:translateY(-2px);
}
.inter.active{
  background:var(--primary);
  color:#fff;
  box-shadow:0 4px 16px rgba(93,121,246,.35);
}

/* ========= 圆形 & 图标 ========= */
#circle{
  position:absolute;
  top:190px;
  left:50%;
  transform:translateX(-50%);
}
#user{
  position:absolute;
  top:208px;
  left:50%;
  transform:translateX(-50%);
  filter:drop-shadow(0 4px 8px rgba(112,162,241,.25));
}

/* ========= 背景装饰（光斑） ========= */
.container1::before{
  content:"";
  position:absolute;
  width:160%;
  height:160%;
  background:radial-gradient(circle at 30% 30%,rgba(93,121,246,.12) 0%,transparent 40%);
  animation:rotate 24s linear infinite;
}
@keyframes rotate{to{transform:rotate(360deg)}}

/* ========= 响应式 ========= */
@media(max-width:400px){
  .container1{transform:scale(.95)}
}
</style>