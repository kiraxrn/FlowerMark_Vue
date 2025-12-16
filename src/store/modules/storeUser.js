import { getUserInfo } from '@/api/user'
// 本地存储键名常量
const STORAGE_KEYS = {
  USER_INFO: 'vuex_user_info',
  USER_AVATAR: 'user_avatar_',
  SESSION_AVATAR: 'session_user_avatar'
}

const state = {
  userInfo: null,
  avatar: '',
  username: '',
  email: '',
  // 添加 avatarCache
  avatarCache: new Map()
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    
    // 将头像信息单独缓存
    if (userInfo && userInfo.avatar) {
      // 确保 avatarCache 存在
      if (state.avatarCache) {
        state.avatarCache.set(userInfo.userId, userInfo.avatar)
      }
      
      // 保存到localStorage以便页面刷新后恢复
      if (typeof localStorage !== 'undefined') {
        // 保存完整的用户信息
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
        
        // 单独保存头像（作为备份）
        localStorage.setItem(
          `${STORAGE_KEYS.USER_AVATAR}${userInfo.userId}`, 
          userInfo.avatar
        )
      }
      
      // 保存到sessionStorage，用于当前会话
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(
          STORAGE_KEYS.SESSION_AVATAR, 
          userInfo.avatar
        )
      }
    }
  },
  
  // 专门更新头像的mutation
  SET_USER_AVATAR(state, { userId, avatar }) {
    if (state.userInfo && state.userInfo.userId === userId) {
      state.userInfo.avatar = avatar
      // 确保 avatarCache 存在
      if (state.avatarCache) {
        state.avatarCache.set(userId, avatar)
      }
      
      // 同步到所有存储
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          `${STORAGE_KEYS.USER_AVATAR}${userId}`, 
          avatar
        )
        
        // 更新完整的用户信息
        const savedInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)
        if (savedInfo) {
          try {
            const userInfo = JSON.parse(savedInfo)
            userInfo.avatar = avatar
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
          } catch (e) {
            console.error('更新localStorage用户信息失败:', e)
          }
        }
      }
      
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.SESSION_AVATAR, avatar)
      }
    }
  },
  
  CLEAR_USER_INFO(state) {
    const userId = state.userInfo?.userId
    state.userInfo = null
    
    if (userId) {
      // 确保 avatarCache 存在
      if (state.avatarCache) {
        state.avatarCache.delete(userId)
      }
      
      // 清除sessionStorage中的头像
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEYS.SESSION_AVATAR)
      }
      
      // 清除localStorage中的头像缓存
      localStorage.removeItem(`${STORAGE_KEYS.USER_AVATAR}${userId}`)
    }
  }
}

const actions = {
  // 获取用户信息优先从本地存储加载
  async fetchUserInfo({ commit }) {
    try {
      const userId = sessionStorage.getItem('userId')
      if (!userId) return null
      
      console.log('获取用户信息，userId:', userId)
      
      // 1. 先尝试从本地存储恢复
      let userInfo = null
      let avatarFromStorage = null
      
      if (typeof localStorage !== 'undefined') {
        // 尝试从localStorage获取完整用户信息
        const savedInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)
        if (savedInfo) {
          try {
            const parsedInfo = JSON.parse(savedInfo)
            if (parsedInfo.userId === userId) {
              userInfo = parsedInfo
              console.log('从localStorage恢复用户信息:', userInfo.username)
            }
          } catch (e) {
            console.error('解析localStorage用户信息失败:', e)
          }
        }
        
        // 尝试从头像缓存获取头像
        const savedAvatar = localStorage.getItem(`${STORAGE_KEYS.USER_AVATAR}${userId}`)
        if (savedAvatar) {
          avatarFromStorage = savedAvatar
          console.log('从localStorage获取到头像缓存')
        }
      }
      
      // 2. 从sessionStorage获取头像
      if (typeof sessionStorage !== 'undefined') {
        const sessionAvatar = sessionStorage.getItem(STORAGE_KEYS.SESSION_AVATAR)
        if (sessionAvatar) {
          avatarFromStorage = sessionAvatar
          console.log('从sessionStorage获取到头像')
        }
      }
      
      // 3. 从API获取最新用户信息
      const response = await getUserInfo(userId)
      
      if (response.code === 200) {
        let finalUserInfo = response.data
        
        // 如果本地有头像缓存，优先使用
        if (avatarFromStorage) {
          finalUserInfo.avatar = avatarFromStorage
          console.log('使用本地存储的头像')
        }
        
        // 如果API返回了头像，使用API的头像（并更新本地缓存）
        if (response.data.avatar && !avatarFromStorage) {
          console.log('使用API返回的头像')
        }
        
        // 提交到store
        commit('SET_USER_INFO', finalUserInfo)
        
        // 触发头像更新事件
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('userAvatarUpdated', {
            detail: { 
              userId, 
              avatar: finalUserInfo.avatar,
              source: avatarFromStorage ? 'local' : 'api'
            }
          }))
        }
        
        return finalUserInfo
      }
      
      // 如果API失败，但有本地缓存，使用本地缓存
      if (userInfo) {
        if (avatarFromStorage) {
          userInfo.avatar = avatarFromStorage
        }
        commit('SET_USER_INFO', userInfo)
        return userInfo
      }
      
      return null
      
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  },

  // 更新用户信息
  updateUserInfo({ commit, dispatch }, userInfo) {
    commit('SET_USER_INFO', userInfo)
    
    // 使用正确的 dispatch 方式
    dispatch('notifyAvatarUpdate', userInfo.avatar)
  },
  
  // 专门更新头像的action
  updateUserAvatar({ commit, dispatch }, { userId, avatar }) {
    commit('SET_USER_AVATAR', { userId, avatar })
    
    // 使用正确的 dispatch 方式
    dispatch('notifyAvatarUpdate', avatar)
  },
  
  // 通知所有组件头像已更新
  notifyAvatarUpdate(avatar) {
    // 触发自定义事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userAvatarChanged', {
        detail: { avatar }
      }))
    }
    
    // 可以在这里添加其他通知机制，如EventBus
    console.log('头像已更新，通知所有组件')
  },

  // 清除用户信息（退出登录时调用）
  clearUserInfo({ commit }) {
    commit('CLEAR_USER_INFO')
    
    // 清除sessionStorage中的用户ID
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('username')
    }
  },
  
  // 获取当前用户的头像（优先从缓存获取）
  getCurrentAvatar({ state }) {
    const userId = sessionStorage.getItem('userId')
    if (!userId) return ''
    
    // 1. 从缓存获取（确保 avatarCache 存在）
    if (state.avatarCache && state.avatarCache.has(userId)) {
      return state.avatarCache.get(userId)
    }
    
    // 2. 从当前state获取
    if (state.userInfo && state.userInfo.userId === userId) {
      return state.userInfo.avatar || ''
    }
    
    // 3. 从sessionStorage获取
    if (typeof sessionStorage !== 'undefined') {
      const sessionAvatar = sessionStorage.getItem(STORAGE_KEYS.SESSION_AVATAR)
      if (sessionAvatar) {
        // 更新缓存（确保 avatarCache 存在）
        if (state.avatarCache) {
          state.avatarCache.set(userId, sessionAvatar)
        }
        return sessionAvatar
      }
    }
    
    // 4. 从localStorage获取
    if (typeof localStorage !== 'undefined') {
      const localAvatar = localStorage.getItem(`${STORAGE_KEYS.USER_AVATAR}${userId}`)
      if (localAvatar) {
        // 更新缓存（确保 avatarCache 存在）
        if (state.avatarCache) {
          state.avatarCache.set(userId, localAvatar)
        }
        return localAvatar
      }
    }
    
    return ''
  }
}

const getters = {
  userInfo: state => state.userInfo,
  username: state => state.userInfo?.username || '',
  
  // 多源获取
  userAvatar: (state) => (userId) => {
    if (!userId) userId = sessionStorage.getItem('userId')
    if (!userId) return ''
    
    // 按优先级获取头像
    const sources = [
      // 1. 内存缓存（确保 avatarCache 存在）
      state.avatarCache && state.avatarCache.get(userId),
      
      // 2. 当前state中的用户信息
      state.userInfo && state.userInfo.userId === userId ? state.userInfo.avatar : '',
      
      // 3. sessionStorage
      typeof sessionStorage !== 'undefined' 
        ? sessionStorage.getItem(STORAGE_KEYS.SESSION_AVATAR) 
        : '',
      
      // 4. localStorage
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(`${STORAGE_KEYS.USER_AVATAR}${userId}`)
        : ''
    ]
    
    // 返回第一个有效的头像
    const avatar = sources.find(src => src && src !== '')
    return avatar || ''
  },
  
  // 获取默认头像（当没有上传头像时使用）
  defaultAvatar: () => {
    return require('@/assets/img/Avatar.png')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}