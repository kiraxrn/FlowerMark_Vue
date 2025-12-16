// 导入数据模型
import { mockUsers } from '../data/userModel';
/**
 * 模拟用户登录
 * @param {Object} loginData - 登录数据 { username, password }
 * @returns {Promise<Object>} 登录响应
 */
export function mockLogin(loginData) {
  console.log('🔐 Mock: 用户登录请求', loginData);
  console.log('Mock 用户数据:', mockUsers.map(u => ({ username: u.username, password: u.password })));
  
  const { username, password } = loginData;
  
  // 查找用户
  const user = mockUsers.find(u => {
    // 检查用户是否存在
    const userExists = u.username === username || u.email === username;
    const passwordMatches = u.password === password;
    
    console.log(`检查 ${u.username}: 用户存在=${userExists}, 密码匹配=${passwordMatches}`);
    
    return userExists && passwordMatches;
  });
  
  if (user) {
    console.log('✅ 登录成功，用户:', user.username);
    
    // 生成模拟token
    const token = `mock_token_${user.userId}_${Date.now()}`;
    
    // 保存token到sessionStorage（与实际登录逻辑保持一致）
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', user.userId);
      sessionStorage.setItem('username', user.username);
    }
    
    return {
      code: 200,
      data: {
        token: token,
        userInfo: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          nickname: user.nickname || user.username,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&size=128`,
          phone: user.phone || '',
          roles: user.roles || ['user'],
          permissions: user.permissions || []
        }
      },
      message: '登录成功'
    };
  } else {
    console.log('❌ 登录失败: 用户名或密码错误');
    
    // 检查用户名是否存在
    const userExists = mockUsers.some(u => 
      u.username === username || u.email === username
    );
    
    return {
      code: userExists ? 400 : 404,
      data: null,
      message: userExists ? '密码错误' : '用户不存在'
    };
  }
}
// 用户上传头像 
// 修改 userMock.js 中的 mockUploadAvatar 函数：
export function mockUploadAvatar(userId, avatarData) {
  console.log('模拟头像更新:', { userId });
  
  // 更新用户头像信息
  const userIndex = mockUsers.findIndex(u => u.userId == userId || u.id == userId);
  
  if (userIndex !== -1) {
    // 保存头像数据
    mockUsers[userIndex].avatar = avatarData;
    mockUsers[userIndex].avatarData = avatarData;
    
    console.log('更新用户头像成功:', mockUsers[userIndex].username);
    
    // 同时保存到localStorage以便其他组件使用
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`user_avatar_${userId}`, avatarData);
    }
  }
  
  return {
    code: 200,
    data: {
      avatarUrl: avatarData,
      timestamp: Date.now(),
      userId: userId
    },
    message: '头像更新成功'
  };
}

// 获取用户信息 
export function mockGetUserInfo(userId) {
  console.log('🔍 Mock: 获取用户信息，userId:', userId);
  
  // 查找用户
  const user = mockUsers.find(u => u.userId == userId || u.id == userId);
  
  if (user) {
    console.log('✅ 找到用户:', user.username);
    
    // 优先使用本地保存的头像
    let avatarUrl = user.avatar;
    
    // 检查localStorage是否有保存的头像
    if (typeof localStorage !== 'undefined') {
      const savedAvatar = localStorage.getItem(`user_avatar_${userId}`);
      if (savedAvatar) {
        avatarUrl = savedAvatar;
        // 更新内存中的数据保持同步
        user.avatar = savedAvatar;
        user.avatarData = savedAvatar;
      }
    }
    
    return {
      code: 200,
      data: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&size=128`
      },
      message: 'success'
    };
  } else {
    console.log('❌ 用户不存在，使用默认用户');
    
    // 检查localStorage是否有该用户的头像
    let avatarUrl = `https://ui-avatars.com/api/?name=User${userId || '1001'}&background=random&size=128`;
    
    if (typeof localStorage !== 'undefined' && userId) {
      const savedAvatar = localStorage.getItem(`user_avatar_${userId}`);
      if (savedAvatar) {
        avatarUrl = savedAvatar;
      }
    }
    
    return {
      code: 200,
      data: {
        userId: userId || '1001',
        username: '用户' + (userId || '1001'),
        email: 'user@example.com',
        phone: '13800138000',
        avatar: avatarUrl
      },
      message: 'success'
    };
  }
}

// 更新用户信息 - 同步头像
export function mockUpdateUserInfo(userData) {
  const userIndex = mockUsers.findIndex(u => u.userId == userData.userId || u.id == userData.userId);
  
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    
    // 如果更新了头像，保存到localStorage
    if (userData.avatar && typeof localStorage !== 'undefined') {
      localStorage.setItem(`user_avatar_${userData.userId}`, userData.avatar);
    }
    
    return {
      code: 200,
      data: {
        userId: mockUsers[userIndex].userId,
        username: mockUsers[userIndex].username,
        email: mockUsers[userIndex].email,
        phone: mockUsers[userIndex].phone,
        avatar: mockUsers[userIndex].avatar
      },
      message: '更新成功'
    };
  }
  
  return {
    code: 404,
    data: null,
    message: '用户不存在'
  };
}