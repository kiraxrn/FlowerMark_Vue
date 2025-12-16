// src/api/commodity.js
import api from './config.js'

// 获取商品列表（支持分页、分类筛选、随机获取）
export const getCommodities = (params = {}) => {
  return api.get('/commodities', {  
    params: params
  })
}

// 根据分类获取商品（支持分页）
export const getCommoditiesByCategory = (categoryId, params = {}) => {
  return api.get(`/categories/${categoryId}/commodities`, {  
    params: params
  })
}

// 获取随机商品（用于同城页面）
export const getRandomCommodities = (pageSize = 12) => {
  return api.get('/commodities/random', {  
    params: {
      pageSize: pageSize,
      random: 'true'
    }
  })
}

// 获取秒杀商品
export const getSeckillCommodities = () => {
  return api.get('/commodities/seckill')  
}

// 获取商品详情
export const getCommodityDetail = (comId) => {
  return api.get(`/commodities/${comId}`)  
}

// 搜索商品
export const searchCommodities = (keyword) => {
  return api.get('/commodities/search', {  
    params: { keyword }
  })
}

// 获取分类列表
export const getCategories = () => {
  return api.get('/categories')  
}