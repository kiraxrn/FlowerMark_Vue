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
  if (!keyword || keyword.trim() === '') {
    return {
      code: 200,
      data: [],
      message: '搜索关键词为空'
    };
  }
  
  const searchTerm = keyword.trim().toLowerCase();
  
  // 关键词分词（简单分词，按空格分割）
  const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0);
  
  // 改进的精确匹配逻辑
  const results = mockCommodities.filter(item => {
    const itemName = item.name.toLowerCase();
    const itemDescription = item.description.toLowerCase();
    const itemCategory = item.category.toLowerCase();
    const itemTags = item.tags && Array.isArray(item.tags) ? 
      item.tags.map(tag => tag.toLowerCase()) : [];
    
    // 如果只有一个关键词，使用精确匹配
    if (searchTerms.length === 1) {
      const term = searchTerms[0];
      
      // 名称精确匹配（最高优先级）
      const nameExactMatch = itemName === term || itemName.split(/\s+/).includes(term);
      const nameContainsMatch = itemName.includes(term);
      
      // 描述匹配（中等优先级）
      const descriptionMatch = itemDescription.includes(term);
      
      // 分类匹配（最低优先级）
      const categoryMatch = itemCategory.includes(term);
      
      // 标签精确匹配
      const tagsExactMatch = itemTags.some(tag => tag === term);
      const tagsContainsMatch = itemTags.some(tag => tag.includes(term));
      
      return nameExactMatch || nameContainsMatch || descriptionMatch || 
             categoryMatch || tagsExactMatch || tagsContainsMatch;
    } else {
      // 多个关键词，需要所有关键词都匹配
      return searchTerms.every(term => {
        const nameExactMatch = itemName === term || itemName.split(/\s+/).includes(term);
        const nameContainsMatch = itemName.includes(term);
        const descriptionMatch = itemDescription.includes(term);
        const categoryMatch = itemCategory.includes(term);
        const tagsExactMatch = itemTags.some(tag => tag === term);
        const tagsContainsMatch = itemTags.some(tag => tag.includes(term));
        
        return nameExactMatch || nameContainsMatch || descriptionMatch || 
               categoryMatch || tagsExactMatch || tagsContainsMatch;
      });
    }
  });
  
  // 对结果进行智能排序
  results.sort((a, b) => {
    // 计算匹配度分数
    const getMatchScore = (item) => {
      let score = 0;
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      
      searchTerms.forEach(term => {
        // 名称精确匹配得分最高
        if (name === term || name.split(/\s+/).includes(term)) score += 20;
        
        // 名称包含匹配得分较高
        if (name.includes(term)) score += 10;
        
        // 描述匹配得分中等
        if (description.includes(term)) score += 5;
        
        // 分类匹配得分较低
        if (item.category.toLowerCase().includes(term)) score += 3;
        
        // 标签精确匹配得分较高
        if (item.tags && Array.isArray(item.tags)) {
          if (item.tags.some(tag => tag.toLowerCase() === term)) score += 15;
          if (item.tags.some(tag => tag.toLowerCase().includes(term))) score += 5;
        }
      });
      
      return score;
    };
    
    const aScore = getMatchScore(a);
    const bScore = getMatchScore(b);
    
    // 按匹配度降序排列
    if (aScore !== bScore) {
      return bScore - aScore;
    }
    
    // 匹配度相同，按销量降序排列
    return b.sales - a.sales;
  });
  
  console.log(`搜索关键词: "${searchTerm}", 分词结果: [${searchTerms.join(', ')}], 匹配结果数量: ${results.length}`);
  
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
      comPicture: item.image || 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=664&fit=crop', // 商品图片
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
