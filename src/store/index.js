import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/storeUser'
import cart from './modules/storeCart'
import product from './modules/storeProduct'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart,
    product
  }
})