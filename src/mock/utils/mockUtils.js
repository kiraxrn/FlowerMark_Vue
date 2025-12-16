import Mock from 'mockjs'

// 模拟延迟
export const mockDelay = (min = 200, max = 800) => {
  return new Promise(resolve => {
    setTimeout(resolve, Mock.Random.integer(min, max))
  })
}

// 模拟分页数据
export const mockPagination = (data, page, pageSize) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  
  return {
    list: data.slice(start, end),
    pagination: {
      page,
      pageSize,
      total,
      totalPages
    }
  }
}

// 模拟成功响应
export const mockSuccess = (data, message = '成功') => {
  return {
    code: 200,
    message,
    data
  }
}

// 模拟错误响应
export const mockError = (message = '失败', code = 500) => {
  return {
    code,
    message,
    data: null
  }
}

// 模拟列表数据
export const mockListData = (template, min = 10, max = 50) => {
  return Mock.mock({
    [`list|${min}-${max}`]: [template]
  }).list
}

// 解析 URL 参数
export const getUrlParams = (url) => {
  const params = {}
  const urlObj = new URL(url, 'http://localhost')
  for (const [key, value] of urlObj.searchParams) {
    params[key] = value
  }
  return params
}