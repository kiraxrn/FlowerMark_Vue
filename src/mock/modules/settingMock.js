
import { mockUsers } from '../data/userModel';
// 现有函数
export function updateUserInfo(userData) {
  const { userId, file } = userData;
  console.log('更新用户信息:', { userId, file });
  return {
    code: 200,
    data: { ...userData },
    message: '更新成功'
  };
}

export function updatePassword(passwordData) {
  const { oldPassword } = passwordData;
  if (oldPassword === '123456') {
    return {
      code: 200,
      data: null,
      message: '密码修改成功'
    };
  }
  return {
    code: 400,
    data: null,
    message: '原密码错误'
  };
}
export function mockGetSettingData() {
  return {
    code: 200,
    data: {
      profile: {  // 添加 profile 对象，与 SettingPage.vue 中的数据结构匹配
        userId: '1001',
        username: '测试用户',
        email: 'test@flower.com',
        phone: '13800138000',
        gender: 1,
        birthday: '1990-01-01',
        address: '北京市朝阳区',
        avatar: 'https://img1.baidu.com/it/u=3148947595,1853549332&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=664'
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: true,
        passwordStrength: 'strong'
      },
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    message: 'success'
  };
}

export function mockUpdateUserSettings(userId, updates) {
  // 模拟更新用户信息
  console.log('更新用户设置:', { userId, updates });
  return {
    code: 200,
    data: {
      userId: userId,
      ...updates
    },
    message: '设置更新成功'
  };
}

// 头像上传函数 - 修改为支持头像URL参数
export function mockUploadAvatar(userId, avatarData) {
  console.log('📤 Mock: 更新头像:', { userId, avatarData });
  
  // 更新用户头像信息到 localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(`user_avatar_${userId}`, avatarData);
  }
  
  // 更新 mockUsers 数据库
  const userIndex = mockUsers.findIndex(u => u.userId == userId || u.id == userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].avatar = avatarData;
  }
  
  console.log('✅ 头像更新成功');
  
  // 直接返回 API 响应格式
  return {
    code: 200,
    data: {
      avatarUrl: avatarData,  // 返回头像数据
      userId: userId || '1001',
      uploadTime: new Date().toISOString()
    },
    message: '头像更新成功'
  };
}

export function mockGetSecuritySettings() {
  return {
    code: 200,
    data: {
      twoFactorAuth: false,
      loginAlerts: true,
      passwordStrength: 'strong'
    },
    message: 'success'
  };
}

export function mockUpdateNotificationSettings(settings) {
  return {
    code: 200,
    data: settings,
    message: '通知设置更新成功'
  };
}
