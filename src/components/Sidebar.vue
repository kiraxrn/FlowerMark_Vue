<template>
  <el-aside class="group2" :class="{ 'collapsed': isCollapsed && isMobile }">
    <div class="sidebar-header">
      <h3 class="sidebar-title" :title="isCollapsed && isMobile ? '分类' : ''">
        <template v-if="!isCollapsed || !isMobile">分类</template>
        <template v-else>{{ getFirstChar('分类') }}</template>
      </h3>
      <div v-if="isMobile" class="collapse-toggle" @click="toggleCollapse">
        <i :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'" ></i>
      </div>
    </div>
    
    <el-menu
      :default-active="$route.path"
      class="category-menu"
      router
      @select="handleCategorySelect"
      :collapse="isCollapsed && isMobile"
    >
      <el-menu-item 
        v-for="category in categories" 
        :key="category.key"
        :index="category.path"
        :class="{ active: $route.path.includes(category.key) }"
        :title="category.title"
      >
        <div v-if="!isCollapsed || !isMobile" class="menu-item-content">
          <span class="menu-icon">{{ getFirstChar(category.title) }}</span>
          <span class="menu-item-text">{{ category.title }}</span>
        </div>
        <div v-else class="menu-item-content-collapsed">
          <span class="menu-icon">{{ getFirstChar(category.title) }}</span>
        </div>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'AppSidebar',
  data() {
    return {
      categories: [
        { key: 'yingbin', title: '迎宾花卉', path: '/classify/yingbin' },
        { key: 'jingguan', title: '景观植物', path: '/classify/jingguan' },
        { key: 'keting', title: '客厅装饰植物', path: '/classify/keting' },
        { key: 'huazhong', title: '花种', path: '/classify/huazhong' },
        { key: 'huamei', title: '画眉', path: '/classify/huamei' },
        { key: 'yuanyi', title: '园艺工具', path: '/classify/yuanyi' }
      ],
      isCollapsed: false,
      screenWidth: 0,
      isMobile: false
    }
  },
  mounted() {
    this.checkDeviceType();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    currentCategory() {
      // 根据当前路由获取对应的分类
      const currentPath = this.$route.path;
      const category = this.categories.find(cat => currentPath.includes(cat.key));
      return category || { title: '分类', key: 'default' };
    }
  },
  
  methods: {
    getFirstChar(text) {
      return text.charAt(0);
    },
    
    handleCategorySelect(index) {
      const categoryKey = this.categories.find(c => c.path === index)?.key;
      if (categoryKey) {
        console.log('点击分类:', categoryKey);
      }
    },
    
    checkDeviceType() {
      this.screenWidth = window.innerWidth;
      // 768px以下为移动端
      this.isMobile = this.screenWidth < 768;
      // PC端默认展开，移动端默认折叠
      if (this.isMobile) {
        this.isCollapsed = true;
      } else {
        this.isCollapsed = false;
      }
    },
    
    handleResize() {
      this.screenWidth = window.innerWidth;
      const wasMobile = this.isMobile;
      this.isMobile = this.screenWidth < 768;
      
      // 设备类型变化时调整折叠状态
      if (wasMobile !== this.isMobile) {
        if (this.isMobile) {
          this.isCollapsed = true; // 切换到移动端时折叠
        } else {
          this.isCollapsed = false; // 切换到PC端时展开
        }
      }
    },
    
    toggleCollapse() {
      // 只在移动端允许折叠/展开
      if (this.isMobile) {
        this.isCollapsed = !this.isCollapsed;
      }
    }
  },
  watch: {
    isCollapsed(newVal) {
      this.$emit('sidebar-collapse', newVal);
    }
  }
}
</script>

<style scoped>
.group2 {
  min-width: 200px;
  max-width: 250px;
  width: auto;
  height: auto;
  background: #FFDCDC;
  border-radius: 5px;
  padding: 20px 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.group2.collapsed {
  min-width: 80px;
  max-width: 80px;
  padding: 15px 10px;
}

/* 侧边栏头部 */
.sidebar-header {
  position: relative;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.group2.collapsed .sidebar-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  min-height: 30px;
}

.sidebar-title {
  font-size: 22px;
  color: #000000;
  font-family: "黑体", "Microsoft YaHei", sans-serif;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: visible;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
  transition: all 0.3s ease;
  flex: 1;
}

.group2.collapsed .sidebar-title {
  font-size: 0;
  width: 0;
  opacity: 0;
  flex: 0;
}

.collapse-toggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 18px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
  z-index: 10;
}

.group2.collapsed .collapse-toggle {
  position: static;
  transform: none;
  right: auto;
  top: auto;
  margin: 0 auto;
  color: #4CAF50;
  font-size: 20px;
}

.group2.collapsed .collapse-toggle:hover {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

/* 菜单容器 */
.category-menu {
  border: none !important;
  background: transparent !important;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.group2.collapsed .category-menu {
  padding: 0 2px;
}

.category-menu::-webkit-scrollbar {
  width: 4px;
}

.category-menu::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.category-menu::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

/* 菜单项样式 */
.category-menu .el-menu-item {
  font-size: 16px;
  color: #333;
  height: 46px;
  line-height: 46px;
  margin: 4px 0;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 10px !important;
  display: flex;
  align-items: center;
  position: relative;
}

.group2.collapsed .category-menu .el-menu-item {
  padding: 0 5px !important;
  justify-content: center;
}

/* 菜单内容容器 */
.menu-item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

/* 菜单内容容器 - 折叠状态 */
.menu-item-content-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* 菜单图标（使用文字首字母） */
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
  flex-shrink: 0;
  margin-right: 10px;
}

.group2.collapsed .menu-icon {
  margin-right: 0;
  width: 35px;
  height: 35px;
  font-size: 18px;
}

/* 菜单文本 */
.menu-item-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 悬停效果 */
.category-menu .el-menu-item:hover {
  color: #A8143C !important;
  background-color: rgba(255, 230, 230, 0.8) !important;
}

.category-menu .el-menu-item:hover .menu-icon {
  background: rgba(168, 20, 60, 0.1);
  color: #A8143C;
}

/* 激活状态 */
.category-menu .el-menu-item.active,
.category-menu .el-menu-item.is-active {
  color: #4CAF50 !important;
  font-weight: 600;
  background-color: rgba(240, 249, 240, 0.9) !important;
  border-left: 4px solid #4CAF50 !important;
}

.category-menu .el-menu-item.active .menu-icon,
.category-menu .el-menu-item.is-active .menu-icon {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  font-weight: bold;
}

.category-menu .el-menu-item.is-active::before {
  display: none;
}

/* 响应式设计 */

/* 大屏幕：1200px 以上 */
@media (max-width: 1440px) {
  .group2 {
    min-width: 200px;
    max-width: 220px;
  }
}

@media (max-width: 1200px) {
  .group2 {
    min-width: 180px;
    max-width: 200px;
    padding: 18px 12px;
  }
  
  .sidebar-title {
    font-size: 20px;
  }
  
  .category-menu .el-menu-item {
    font-size: 15px;
    height: 44px;
    line-height: 44px;
  }
  
  .menu-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}

@media (max-width: 992px) {
  .group2 {
    min-width: 160px;
    max-width: 180px;
    padding: 15px 10px;
  }
  
  .sidebar-title {
    font-size: 18px;
  }
  
  .category-menu .el-menu-item {
    font-size: 14px;
    height: 42px;
    line-height: 42px;
    margin: 3px 0;
  }
  
  .menu-icon {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }
}

/* 平板设备：768px 以下 */
@media (max-width: 768px) {
  .group2 {
    min-width: 60px !important;
    max-width: 60px !important;
    padding: 12px 6px !important;
    border-radius: 0 8px 8px 0;
  }
  
  .group2:not(.collapsed) {
    min-width: 180px !important;
    max-width: 180px !important;
    padding: 15px 10px !important;
  }
  
  .sidebar-title {
    font-size: 16px;
  }
  
  .group2.collapsed .sidebar-title {
    font-size: 15px;
    margin-bottom: 15px;
  }
  
  .collapse-toggle {
    display: block !important;
    top: 5px;
    right: 5px;
    font-size: 16px;
  }
}
  
  .category-menu .el-menu-item {
    height: 40px;
    line-height: 40px;
    margin: 2px 0;
  }
  
  .menu-icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  .menu-item-text-short {
    font-size: 11px;
  }
  
  /* 移动端悬停效果：显示完整内容 */
  .group2.collapsed:hover {
    min-width: 180px !important;
    max-width: 180px !important;
  }
  


@media (max-width: 576px) {
  .group2 {
    min-width: 160px !important;
    max-width: 160px !important;
    padding: 12px 8px !important;
  }
  
  .sidebar-title {
    font-size: 14px;
  }
  
  .category-menu .el-menu-item {
    font-size: 13px;
    height: 38px;
    line-height: 38px;
  }
  
  .menu-icon {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
}

/* 超小屏幕设备：400px 以下 */
@media (max-width: 400px) {
  .group2 {
    min-width: 140px !important;
    max-width: 140px !important;
    padding: 10px 6px !important;
  }
  
  .sidebar-title {
    font-size: 12px;
  }
  
  .category-menu .el-menu-item {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
  }
  
  .menu-icon {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .menu-icon {
    border: 1px solid #000;
  }
  
  .category-menu .el-menu-item.active {
    border-left: 4px solid #000 !important;
  }
}

/* 工具提示优化 */
.el-menu-item {
  position: relative;
}

.el-menu-item:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #333;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 9999;
  margin-left: 10px;
  display: none; /* 默认隐藏，在需要时显示 */
}

.group2.collapsed .el-menu-item:hover::after {
  display: block;
}

/* 确保内容不会在过渡时闪烁 */
.group2,
.group2 * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 折叠状态下的布局优化 */
.el-menu--collapse .el-menu-item {
  justify-content: center;
  padding: 0 10px !important;
}

@media (prefers-reduced-motion: reduce) {
  .group2,
  .category-menu .el-menu-item,
  .menu-item-text,
  .menu-icon {
    transition: none !important;
  }
}
</style>