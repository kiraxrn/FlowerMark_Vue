// src/api/cart.js
import api, { isMockEnabled } from './config'

// 获取当前用户ID
const getCurrentUserId = () => {
  return sessionStorage.getItem('userId') || 1; // 默认为1用于测试
}

// 获取购物车列表
export const getCartList = () => {
  const userId = getCurrentUserId();
  const url = isMockEnabled() ? `/cart?userId=${userId}` : `/cart?userId=${userId}`
  return api.get(url)
}

// 添加商品到购物车
export const addToCart = (productData) => {
  const userId = getCurrentUserId();
  
  // 构建符合后端期望的数据结构
  const requestData = {
    userId: userId,
    commodityId: productData.productId || productData.id,
    commodityName: productData.productName || productData.name,
    price: productData.price || 0,
    quantity: productData.quantity || 1,
    image: productData.image || productData.imageUrl || productData.comPicture || '',
    description: productData.description || productData.comDescription || ''
  };
  
  const url = isMockEnabled() ? '/cart/add' : '/cart/add'
  console.log('添加到购物车请求数据:', requestData); // 调试用
  return api.post(url, requestData)
}

// 更新购物车商品数量
export const updateCartItem = (cartId, quantity) => {
  const userId = getCurrentUserId();
  const url = isMockEnabled() ? '/cart/update' : '/cart/update'
  return api.put(url, { 
    userId, 
    cartId, 
    quantity 
  })
}

// 删除购物车商品
export const removeFromCart = (cartId) => {
  const userId = getCurrentUserId();
  const url = isMockEnabled() ? '/cart/delete' : '/cart/delete'
  return api.delete(url, { data: { userId, cartId } })
}

// 切换购物车商品选中状态
export const toggleCartItemCheck = (cartId, checked) => {
  const userId = getCurrentUserId();
  const url = isMockEnabled() ? '/cart/toggleCheck' : '/cart/toggleCheck'
  return api.post(url, { 
    userId, 
    cartId, 
    checked 
  })
}

export const clearCart = () => {
  const userId = getCurrentUserId();
  const url = isMockEnabled() ? `/cart/clear?userId=${userId}` : `/cart/clear?userId=${userId}`
  return api.delete(url)
}

export const batchUpdateCart = (items) => {
  const userId = getCurrentUserId();
  const url = isMockEnabled() ? '/cart/batch' : '/cart/batch'
  return api.put(url, { 
    userId, 
    items 
  })
}