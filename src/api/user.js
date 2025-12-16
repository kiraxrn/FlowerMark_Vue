import api, { isMockEnabled } from './config'
// 获取用户信息
export const getUserInfo = (userId) => {
  const url = isMockEnabled() ? `/user/info?userId=${userId}` : `/user/info?userId=${userId}`
  return api.get(url)
}
// 用户登录
export const login = (username, password) => {
  const url = isMockEnabled() ? '/login' : '/login' 
  return api.post(url, {
    username,
    password
  })
}

// 用户注册
export const register = (userData) => {
  const url = isMockEnabled() ? '/register' : '/register'  
  return api.post(url, {
    userid: userData.userId,
    username: userData.username,
    email: userData.email,
    pasw: userData.password,
    confirmPasw: userData.confirmPassword
  })
}

// 用户退出登录
export const logout = () => {
  const url = isMockEnabled() ? '/logout' : '/logout'  
  return api.post(url)
}

// 更新用户信息
export const updateUserInfo = (userData) => {
  const url = isMockEnabled() ? '/user/update' : '/user/update'  
  return api.put(url, userData)
}

// 修改密码 
export const changePassword = (oldPassword, newPassword) => {
  const url = isMockEnabled() ? '/user/password' : '/user/change-password'
  const userId = sessionStorage.getItem('userId') || '1001'
  return api.put(url, {
    userId,
    oldPassword,
    newPassword
  })
}

// 上传头像 - 修改为支持多种参数格式
export const uploadAvatar = (avatarData) => {
  const url = isMockEnabled() ? '/user/avatar' : '/user/avatar'
  const userId = sessionStorage.getItem('userId') || '1001'
  
  // 情况1：传递的是FormData对象（向后兼容）
  if (avatarData instanceof FormData) {
    // 如果 formData 没有 userId，则添加
    if (!avatarData.get('userId')) {
      avatarData.append('userId', userId)
    }
    return api.post(url, avatarData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  
  // 情况2：传递的是普通对象（新的头像选择方式）
  if (avatarData && typeof avatarData === 'object') {
    const requestData = {
      userId: avatarData.userId || userId,
      avatar: avatarData.avatar || avatarData.avatarUrl
    };
    return api.post(url, requestData)
  }
  
  // 情况3：传递的是字符串（直接的头像URL/base64）
  return api.post(url, {
    userId,
    avatar: avatarData
  })
}
