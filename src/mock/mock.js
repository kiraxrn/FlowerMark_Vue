// src/mock/mock.js
import Mock from 'mockjs'

// 导入工具函数
import { getUrlParams } from './utils/mockUtils'
import { mockUsers } from './data/userModel' 

// 导入各个模块的 Mock 函数
import { 
  mockGetUserInfo, 
  mockLogin, 
  mockUpdateUserInfo,
} from './modules/userMock'

import {
  mockGetCommodities,           
  mockGetCommodityDetail,
  mockSearchCommoditiesWrapper,
  mockGetCategories,
  mockGetCommoditiesByCategory,  
  mockGetSeckillCommoditiesWrapper
} from './modules/commodityMock'

import {
  mockGetCartList,
  mockAddToCart,
  mockUpdateCartItem,
  mockRemoveFromCart,
  mockClearCart,
  mockBatchUpdateCart,
  mockToggleCartItemCheck
} from './modules/cartMock'

import {
  mockGetSettingData,
  mockUpdateUserSettings,
  mockUploadAvatar,
  mockGetSecuritySettings,
  mockUpdateNotificationSettings
} from './modules/settingMock'

// 用户相关接口
Mock.mock(/\/api\/user\/info/, 'get', (options) => {
  const params = getUrlParams(options.url)
  return mockGetUserInfo(params.userId)
})

// 在 mock.js 的登录拦截部分添加调试
Mock.mock('/api/login', 'post', function(options) {
  console.log('Mock 登录请求 body:', options.body);
  
  try {
    const loginData = JSON.parse(options.body);
    console.log('解析后的登录数据:', loginData);
    console.log('模拟用户数据库:', mockUsers);
    
    const result = mockLogin(loginData);
    console.log('Mock 登录响应:', result);
    return result;
  } catch (error) {
    console.error('解析登录数据失败:', error);
    return {
      code: 500,
      data: null,
      message: '服务器错误'
    };
  }
});

Mock.mock('/api/user/update', 'put', (options) => {
  const userData = JSON.parse(options.body)
  return mockUpdateUserInfo(userData)
})
// 头像上传
Mock.mock('/api/user/avatar', 'post', (options) => {
  try {
    console.log('头像更新请求:', options);
    
    // 解析请求体
    let userId = '1001';
    let avatarData = null;
    
    if (options.body) {
      try {
        const requestData = JSON.parse(options.body);
        userId = requestData.userId || userId;
        avatarData = requestData.avatar || requestData.avatarUrl;
        
        console.log('解析的头像数据:', { userId, hasAvatar: !!avatarData });
      } catch (parseError) {
        console.log('非JSON格式请求，可能是FormData');
        // 如果是FormData，尝试从sessionStorage获取用户ID
        if (typeof sessionStorage !== 'undefined') {
          userId = sessionStorage.getItem('userId') || userId;
        }
        // 对于FormData，使用默认的头像
        avatarData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEAAQADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABtX/9k=';
      }
    }
    
    // 从 sessionStorage 获取用户ID（优先）
    const mockUserId = sessionStorage ? sessionStorage.getItem('userId') || userId : userId;
    
    console.log('使用的用户ID:', mockUserId, '头像数据长度:', avatarData ? avatarData.length : 0);
    
    // 调用头像更新函数
    const result = mockUploadAvatar(mockUserId, avatarData);
    console.log('头像更新结果:', result);
    return result;
  } catch (error) {
    console.error('Mock 头像更新错误:', error);
    return {
      code: 500,
      data: null,
      message: '头像更新处理失败'
    };
  }
});
// 商品相关接口 
Mock.mock(/\/api\/commodities(\?.*)?/, 'get', (options) => {
  const params = getUrlParams(options.url)
  return mockGetCommodities(params)  
})
Mock.mock(/\/api\/commodities\/\d+/, 'get', (options) => {
  const match = options.url.match(/\/api\/commodities\/(\d+)/)
  const comId = match ? match[1] : null
  return mockGetCommodityDetail(comId)
})
Mock.mock('/api/commodities/search', 'get', (options) => {
  const params = getUrlParams(options.url)
  return mockSearchCommoditiesWrapper(params.keyword)
})
Mock.mock('/api/categories', 'get', () => {
  return mockGetCategories()
})

// 添加分类商品接口
Mock.mock(/\/api\/categories\/\d+\/commodities/, 'get', (options) => {
  const match = options.url.match(/\/api\/categories\/(\d+)\/commodities/)
  const categoryId = match ? match[1] : null
  console.log('分类商品请求:', categoryId);
  return mockGetCommoditiesByCategory(categoryId)
})

// 购物车相关接口
Mock.mock('/api/cart', 'get', () => {
  return mockGetCartList()
})
Mock.mock('/api/cart/add', 'post', (options) => {
  const data = JSON.parse(options.body)
  return mockAddToCart(data)
})
Mock.mock('/api/cart/update', 'put', (options) => {
  const { cartId, quantity } = JSON.parse(options.body)
  return mockUpdateCartItem(cartId, quantity)
})
Mock.mock('/api/cart/delete', 'delete', (options) => {
  const { cartId } = JSON.parse(options.body)
  return mockRemoveFromCart(cartId)
})
Mock.mock('/api/cart/clear', 'delete', () => {
  return mockClearCart()
})
Mock.mock('/api/cart/batch', 'put', (options) => {
  const { items } = JSON.parse(options.body)
  return mockBatchUpdateCart(items)
})
Mock.mock('/api/cart/toggleCheck', 'post', (options) => {
  const { cartId, checked } = JSON.parse(options.body)
  return mockToggleCartItemCheck(cartId, checked)
})

// 设置相关接口
Mock.mock('/api/settings', 'get', () => {
  return mockGetSettingData()
})

Mock.mock('/api/user/settings', 'put', (options) => {
  const { userId, updates } = JSON.parse(options.body)
  return mockUpdateUserSettings(userId, updates)
})



Mock.mock('/api/settings/security', 'get', () => {
  return mockGetSecuritySettings()
})

Mock.mock('/api/settings/notifications', 'put', (options) => {
  const settings = JSON.parse(options.body)
  return mockUpdateNotificationSettings(settings)
})
// 秒杀商品接口
Mock.mock('/api/seckill/commodities', 'get', () => {
  return mockGetSeckillCommoditiesWrapper();
});

// 随机商品接口（用于同城）
Mock.mock(/\/api\/commodities\/random/, 'get', (options) => {
  const params = getUrlParams(options.url);
  console.log('随机商品请求参数:', params);
  
  // 调用随机商品函数，传入正确的参数
  return mockGetCommodities({ 
    random: 'true',
    pageSize: params.pageSize || 12 
  });
});
console.log('Mock 服务已启动 - 所有模块加载完成')