// 购物车模拟数据
const mockCartItems = [
  {
    shopcartId: 1,
    userId: 1,
    commodity: {
      comId: 1,
      comName: '红玫瑰花束',
      comPrice: 199.00,
      comPicture: '/images/rose.jpg',
      comDescription: '精美红玫瑰花束，表达爱意的最佳选择'
    },
    quantity: 2,
    Checked: true
  },
  {
    shopcartId: 2,
    userId: 1,
    commodity: {
      comId: 2,
      comName: '百合花束',
      comPrice: 159.00,
      comPicture: '/images/lily.jpg',
      comDescription: '清新百合花束，象征纯洁与高雅'
    },
    quantity: 1,
    Checked: false
  },
  {
    shopcartId: 3,
    userId: 1,
    commodity: {
      comId: 3,
      comName: '康乃馨花篮',
      comPrice: 299.00,
      comPicture: '/images/carnation.jpg',
      comDescription: '温馨康乃馨花篮，适合送给长辈'
    },
    quantity: 1,
    Checked: true
  }
];

// 获取购物车列表
export const getCartItems = (userId) => {
  const userCartItems = mockCartItems.filter(item => item.userId === userId);
  return {
    code: 200,
    data: userCartItems,
    message: 'success'
  };
};

// 添加到购物车
export const addToCart = (cartItem) => {
  const existingItem = mockCartItems.find(
    item => item.userId === cartItem.userId && item.commodity.comId === cartItem.commodityId
  );
  
  if (existingItem) {
    existingItem.quantity += cartItem.quantity;
  } else {
    const newItem = {
      shopcartId: mockCartItems.length + 1,
      userId: cartItem.userId,
      commodity: {
        comId: cartItem.commodityId,
        comName: cartItem.commodityName || `商品${cartItem.commodityId}`,
        comPrice: cartItem.price || 0,
        comPicture: cartItem.image || '',
        comDescription: cartItem.description || ''
      },
      quantity: cartItem.quantity,
      Checked: false
    };
    mockCartItems.push(newItem);
  }
  
  return {
    code: 200,
    data: null,
    message: '添加成功'
  };
};

// 更新购物车商品数量
export const updateCartItem = (cartId, quantity) => {
  const item = mockCartItems.find(item => item.shopcartId === parseInt(cartId));
  if (item) {
    item.quantity = quantity;
    return {
      code: 200,
      data: item,
      message: '更新成功'
    };
  }
  
  return {
    code: 404,
    data: null,
    message: '商品不存在'
  };
};

// 删除购物车商品
export const deleteCartItem = (cartId) => {
  const index = mockCartItems.findIndex(item => item.shopcartId === parseInt(cartId));
  if (index !== -1) {
    mockCartItems.splice(index, 1);
    return {
      code: 200,
      data: null,
      message: '删除成功'
    };
  }
  
  return {
    code: 404,
    data: null,
    message: '商品不存在'
  };
};

// 切换商品选中状态
export const toggleCartItemCheck = (cartId, checked) => {
  const item = mockCartItems.find(item => item.shopcartId === parseInt(cartId));
  if (item) {
    item.Checked = checked;
    return {
      code: 200,
      data: item,
      message: '更新成功'
    };
  }
  
  return {
    code: 404,
    data: null,
    message: '商品不存在'
  };
};

// Mock 函数
export function mockGetCartList() {
  return getCartItems(1); // 默认用户ID为1
}

export function mockAddToCart(data) {
  return addToCart(data);
}

export function mockUpdateCartItem(cartId, quantity) {
  return updateCartItem(cartId, quantity);
}

export function mockRemoveFromCart(cartId) {
  return deleteCartItem(cartId);
}

export function mockToggleCartItemCheck(cartId, checked) {
  return toggleCartItemCheck(cartId, checked);
}

export function mockClearCart() {
  mockCartItems.length = 0;
  return {
    code: 200,
    data: null,
    message: '清空成功'
  };
}

export function mockBatchUpdateCart(items) {
  items.forEach(item => {
    const cartItem = mockCartItems.find(ci => ci.shopcartId === item.shopcartId);
    if (cartItem) {
      cartItem.quantity = item.quantity;
      cartItem.Checked = item.Checked;
    }
  });
  return {
    code: 200,
    data: mockCartItems,
    message: '批量更新成功'
  };
}