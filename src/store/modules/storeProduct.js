// src/store/modules/storeProduct.js

// 商品状态管理模块
const product = {
  namespaced: true,
  state: {
    // 当前选中的商品信息
    currentProduct: null,
    // 商品详情加载状态
    loading: false,
    // 商品详情错误信息
    error: null
  },
  getters: {
    // 获取当前商品
    getCurrentProduct: (state) => state.currentProduct,
    // 获取加载状态
    isLoading: (state) => state.loading,
    // 获取错误信息
    getError: (state) => state.error
  },
  mutations: {
    // 设置当前商品
    setCurrentProduct(state, product) {
      state.currentProduct = product;
    },
    // 设置加载状态
    setLoading(state, status) {
      state.loading = status;
    },
    // 设置错误信息
    setError(state, error) {
      state.error = error;
    },
    // 清除当前商品
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
    }
  },
  actions: {
    // 设置当前商品
    setCurrentProduct({ commit }, product) {
      commit('setCurrentProduct', product);
    },
    // 清除当前商品
    clearCurrentProduct({ commit }) {
      commit('clearCurrentProduct');
    },
    // 设置加载状态
    setLoading({ commit }, status) {
      commit('setLoading', status);
    },
    // 设置错误信息
    setError({ commit }, error) {
      commit('setError', error);
    }
  }
};

export default product;
