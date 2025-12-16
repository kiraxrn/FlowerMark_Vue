// src/mock/modules/commodityMock.js
import { mockCommodities, mockCategories } from '../data/commodityModel';

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @returns {Object} 商品列表数据
 */
export function mockGetCommodities(params = {}) {
  let result = [...mockCommodities];
  
  // 随机筛选逻辑
  if (params.random === 'true' || params.random) {
    result = result.sort(() => 0.5 - Math.random());
  }
  
  // 分页处理
  const pageSize = parseInt(params.pageSize || 12);
  const pageNum = parseInt(params.pageNum || 1);
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const paginatedResult = result.slice(startIndex, endIndex);
  
  return {
    code: 200,
    data: {
      list: paginatedResult,
      total: result.length,
      pageNum,
      pageSize
    },
    message: 'success'
  };
}

/**
 * 获取商品详情
 * @param {string|number} comId - 商品ID
 * @returns {Object} 商品详情数据
 */
export function mockGetCommodityDetail(comId) {
  const commodity = mockCommodities.find(item => item.id == comId);
  
  if (commodity) {
    return {
      code: 200,
      data: commodity,
      message: 'success'
    };
  } else {
    return {
      code: 404,
      data: null,
      message: '商品不存在'
    };
  }
}

/**
 * 搜索商品包装函数
 * @param {string} keyword - 搜索关键词
 * @returns {Object} 搜索结果
 */
export function mockSearchCommoditiesWrapper(keyword) {
  const results = mockCommodities.filter(item => 
    item.name.includes(keyword) || 
    item.description.includes(keyword) ||
    item.category.includes(keyword)
  );
  
  return {
    code: 200,
    data: results,
    message: 'success'
  };
}

/**
 * 获取分类列表
 * @returns {Object} 分类列表数据
 */
export function mockGetCategories() {
  return {
    code: 200,
    data: mockCategories,
    message: 'success'
  };
}

/**
 * 根据分类获取商品
 * @param {string|number} categoryId - 分类ID
 * @returns {Object} 分类商品数据
 */
export function mockGetCommoditiesByCategory(categoryId) {
  const results = mockCommodities.filter(item => item.categoryId == categoryId);
  
  return {
    code: 200,
    data: {
      list: results,
      total: results.length
    },
    message: 'success'
  };
}

/**
 * 获取秒杀商品包装函数
 * @returns {Object} 秒杀商品数据
 */
export function mockGetSeckillCommoditiesWrapper() {
  const seckillCommodities = mockCommodities
    .filter(item => item.isSeckill === true)
    .map(item => ({
      // 确保返回正确的字段名和值，与前端期望的字段名一致
      comId: item.id || 0,                    // 商品ID
      comName: item.name || '未命名商品',       // 商品名称
      comPrice: item.price || 0,              // 原价
      seckillPrice: item.seckillPrice || item.price * 0.8, // 秒杀价
      comPicture: item.image || 'https://img.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664', // 商品图片
      stock: item.seckillStock || Math.floor(item.stock * 0.3), // 剩余库存
      total: (item.seckillStock || Math.floor(item.stock * 0.3)) + Math.floor(Math.random() * 20) + 10 // 总库存
    }));
  
  return {
    code: 200,
    data: {
      list: seckillCommodities // 按照情况2.2的格式返回data.list数组
    },
    message: 'success'
  };
}
