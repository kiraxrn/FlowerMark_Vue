// src/store/modules/cart.js
const state = {
    cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]'),
    cartTotal: 0,
    cartCount: 0
  };
  
  const mutations = {
    ADD_TO_CART(state, product) {
      const existingItem = state.cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || product.image,
          quantity: product.quantity || 1,
          checked: true,
          category: product.category,
          description: product.description
        });
      }
      
      // 保存到本地存储
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      updateCartTotals(state);
    },
    
    UPDATE_QUANTITY(state, { id, quantity }) {
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      updateCartTotals(state);
    },
    
    REMOVE_FROM_CART(state, id) {
      state.cartItems = state.cartItems.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      updateCartTotals(state);
    },
    
    TOGGLE_CHECK(state, id) {
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.checked = !item.checked;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      updateCartTotals(state);
    },
    
    CLEAR_CART(state) {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
      updateCartTotals(state);
    }
  };
  
  const actions = {
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product);
    },
    
    updateQuantity({ commit }, { id, quantity }) {
      commit('UPDATE_QUANTITY', { id, quantity });
    },
    
    removeFromCart({ commit }, id) {
      commit('REMOVE_FROM_CART', id);
    },
    
    toggleCheck({ commit }, id) {
      commit('TOGGLE_CHECK', id);
    },
    
    clearCart({ commit }) {
      commit('CLEAR_CART');
    }
  };
  
  const getters = {
    cartItems: state => state.cartItems,
    cartTotal: state => state.cartTotal,
    cartCount: state => state.cartCount,
    checkedItems: state => state.cartItems.filter(item => item.checked),
    checkedTotal: state => {
      return state.cartItems
        .filter(item => item.checked)
        .reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  };
  
  // 辅助函数
  function updateCartTotals(state) {
    state.cartCount = state.cartItems.length;
    state.cartTotal = state.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };