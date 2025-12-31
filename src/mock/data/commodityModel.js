// src/mock/data/commodityModel.js
export const commodityModel = {
  id: '',
  name: '',
  price: 0,
  category: '',
  categoryId: 0,
  categoryName: '',
  image: '',
  images: [],
  description: '',
  details: '',
  stock: 0,
  sales: 0,
  isSeckill: false, // 是否为秒杀商品
  seckillPrice: 0,  // 秒杀价格
  seckillStock: 0,  // 秒杀库存
  isNew: false,     // 是否新品
  discount: 0,      // 折扣（如0.8表示8折）
  specifications: {
    material: '',
    package: '',
    delivery: '',
    freshness: '',
    size: '',
    weight: ''
  },
  tags: [] // 商品标签
};

// 完善商品数据，为每个商品添加完整字段
export const mockCommodities = [
  // 迎宾花卉数据 (categoryId: 1)
  {
    id: 1,
    name: '红玫瑰花束',
    price: 199,
    seckillPrice: 149,
    category: '迎宾花卉',
    categoryId: 1,
    categoryName: '迎宾花卉',
    image: 'https://img0.baidu.com/it/u=3103795712,3154073860&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
    images: ['https://img0.baidu.com/it/u=3103795712,3154073860&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'],
    description: '新鲜红玫瑰花束，寓意爱情',
    details: '新鲜红玫瑰花束，包含11朵红玫瑰，搭配满天星和绿叶，精美包装，适合表达爱意。',
    stock: 50,
    sales: 100,
    isSeckill: true,
    seckillStock: 10,
    isNew: true,
    discount: 0.9,
    specifications: {
      material: '新鲜红玫瑰',
      package: '精美礼盒包装',
      delivery: '全国包邮',
      freshness: '保证新鲜送达',
      size: '30×40cm',
      weight: '1.5kg'
    },
    tags: ['热销', '新品', '迎宾']
  },
  {
    id: 2,
    name: '百合花束',
    price: 159,
    seckillPrice: 119,
    category: '迎宾花卉',
    categoryId: 1,
    categoryName: '迎宾花卉',
    image: 'https://img2.baidu.com/it/u=1807830588,458136644&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
    images: ['https://img2.baidu.com/it/u=1807830588,458136644&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'],
    description: '清新百合花，象征纯洁',
    details: '清新百合花束，花朵洁白芬芳，象征纯洁和高雅，适合各种喜庆场合。',
    stock: 30,
    sales: 80,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: '新鲜百合',
      package: '精美包装',
      delivery: '全国包邮',
      freshness: '保证新鲜',
      size: '25×35cm',
      weight: '1.2kg'
    },
    tags: ['纯洁', '高雅']
  },
  {
    id: 3,
    name: '康乃馨花束',
    price: 89,
    seckillPrice: 69,
    category: '迎宾花卉',
    categoryId: 1,
    categoryName: '迎宾花卉',
    image: 'https://img0.baidu.com/it/u=2814382835,290513136&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    images: ['https://img0.baidu.com/it/u=2814382835,290513136&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'],
    description: '温馨康乃馨，适合送母亲',
    details: '温馨康乃馨花束，色彩鲜艳，寓意母爱，是送给母亲的最佳选择。',
    stock: 40,
    sales: 60,
    isSeckill: true,
    seckillStock: 5,
    isNew: true,
    discount: 0.8,
    specifications: {
      material: '新鲜康乃馨',
      package: '精美包装',
      delivery: '全国包邮',
      freshness: '保证新鲜',
      size: '20×30cm',
      weight: '1.0kg'
    },
    tags: ['康乃馨', '母亲节']
  },
  {
    id: 4,
    name: '富贵竹 (5支)',
    price: 29.9,
    seckillPrice: 19.9,
    category: '迎宾花卉',
    categoryId: 1,
    categoryName: '迎宾花卉',
    image: 'https://img0.baidu.com/it/u=3059437216,2371267545&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=889',
    images: ['https://img0.baidu.com/it/u=3059437216,2371267545&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=889'],
    description: '象征富贵吉祥，适合迎宾摆放',
    details: '富贵竹，象征富贵吉祥，适合迎宾摆放，易于养护。',
    stock: 50,
    sales: 156,
    isSeckill: false,
    seckillStock: 15,
    isNew: true,
    discount: 0.7,
    specifications: {
      material: '新鲜富贵竹',
      package: '简单包装',
      delivery: '全国包邮',
      freshness: '保证新鲜',
      size: '5支装',
      weight: '0.5kg'
    },
    tags: ['富贵', '吉祥', '迎宾']
  },
  { 
    id: 5, 
    name: '蝴蝶兰盆栽', 
    price: 88.0, 
    seckillPrice: 68.0, 
    category: '迎宾花卉', 
    categoryId: 1, 
    categoryName: '迎宾花卉', 
    image: 'https://img1.baidu.com/it/u=2930922755,583419796&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667',
    images: ['https://img1.baidu.com/it/u=2930922755,583419796&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667'],
    description: '高贵典雅，长期摆放',
    details: '蝴蝶兰盆栽，花朵美丽，花期长，适合长期摆放装饰。',
    stock: 25,
    sales: 92,
    isSeckill: true,
    seckillStock: 5,
    isNew: false,
    discount: 0.8,
    specifications: {
      material: '蝴蝶兰',
      package: '陶瓷盆',
      delivery: '全国包邮',
      freshness: '鲜活植物',
      size: '30×40cm',
      weight: '2.0kg'
    },
    tags: ['盆栽', '高雅']
  },
  // 景观植物数据 (categoryId: 2)
  { 
    id: 6,
    name: '罗汉松盆栽',
    price: 128.0,
    seckillPrice: 98.0,
    category: '景观植物',
    categoryId: 2,
    categoryName: '景观植物',
    image: 'https://img2.baidu.com/it/u=466433715,3324300223&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=889',
    images: ['https://img2.baidu.com/it/u=466433715,3324300223&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=889'],
    description: '精致罗汉松盆栽，适合庭院装饰',
    details: '精心培育的罗汉松盆栽，造型优美，生长旺盛，适合庭院、阳台装饰。',
    stock: 20,
    sales: 45,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: '罗汉松',
      package: '塑料盆',
      delivery: '全国包邮',
      freshness: '鲜活植物',
      size: '40×60cm',
      weight: '3.5kg'
    },
    tags: ['盆栽', '庭院']
  },
  { 
    id: 7,
    name: '五针松景观树',
    price: 298.0,
    seckillPrice: 248.0,
    category: '景观植物',
    categoryId: 2,
    categoryName: '景观植物',
    image: 'https://img1.baidu.com/it/u=1867004800,1202268084&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1068',
    images: ['https://img1.baidu.com/it/u=1867004800,1202268084&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1068'],
    description: '五针松景观树，适合园林绿化',
    details: '高品质五针松，树形优美，生长健康，适合园林绿化、景观装饰。',
    stock: 15,
    sales: 28,
    isSeckill: true,
    seckillStock: 3,
    isNew: true,
    discount: 0.85,
    specifications: {
      material: '五针松',
      package: '带土球',
      delivery: '专业物流',
      freshness: '鲜活植物',
      size: '80×120cm',
      weight: '15kg'
    },
    tags: ['景观树', '园林']
  },
  { 
    id: 8,
    name: '红叶石楠球',
    price: 88.0,
    seckillPrice: 68.0,
    category: '景观植物',
    categoryId: 2,
    categoryName: '景观植物',
    image: 'https://img1.baidu.com/it/u=2619919996,781036932&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    images: ['https://img1.baidu.com/it/u=2619919996,781036932&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'],
    description: '红叶石楠球，色彩鲜艳',
    details: '球形红叶石楠，色彩鲜艳，造型规整，适合道路绿化、庭院装饰。',
    stock: 35,
    sales: 62,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: '红叶石楠',
      package: '带土球',
      delivery: '专业物流',
      freshness: '鲜活植物',
      size: '50×50cm',
      weight: '8kg'
    },
    tags: ['石楠', '绿化']
  },
  { 
    id: 9,
    name: '玉兰树',
    price: 188.0,
    seckillPrice: 148.0,
    category: '景观植物',
    categoryId: 2,
    categoryName: '景观植物',
    image: 'https://img2.baidu.com/it/u=3923627386,3755191059&fm=253&app=138&f=JPEG?w=800&h=1422',
    images: ['https://img2.baidu.com/it/u=3923627386,3755191059&fm=253&app=138&f=JPEG?w=800&h=1422'],
    description: '玉兰树，春季开花，花香浓郁',
    details: '玉兰树，春季开花，花朵洁白芬芳，树形优美，适合庭院、公园景观种植。',
    stock: 25,
    sales: 38,
    isSeckill: true,
    seckillStock: 5,
    isNew: true,
    discount: 0.8,
    specifications: {
      material: '玉兰树',
      package: '带土球',
      delivery: '专业物流',
      freshness: '鲜活植物',
      size: '100×150cm',
      weight: '20kg'
    },
    tags: ['开花树', '庭院']
  },
  // 客厅装饰植物数据 (categoryId: 3)
  {
    id: 10,
    name: '发财树盆栽',
    price: 78.0,
    seckillPrice: 58.0,
    category: '客厅装饰植物',
    categoryId: 3,
    categoryName: '客厅装饰植物',
    image: 'https://img0.baidu.com/it/u=2475812251,2748525682&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1423',
    images: ['https://img0.baidu.com/it/u=2475812251,2748525682&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1423'],
    description: '发财树盆栽，寓意吉祥',
    details: '发财树盆栽，叶片翠绿茂盛，寓意招财进宝，适合客厅、办公室摆放。',
    stock: 40,
    sales: 95,
    isSeckill: true,
    seckillStock: 8,
    isNew: true,
    discount: 0.75,
    specifications: {
      material: '发财树',
      package: '陶瓷盆',
      delivery: '全国包邮',
      freshness: '鲜活植物',
      size: '35×50cm',
      weight: '2.5kg'
    },
    tags: ['招财', '客厅']
  },
  {
    id: 11,
    name: '绿萝吊篮',
    price: 35.0,
    seckillPrice: 25.0,
    category: '客厅装饰植物',
    categoryId: 3,
    categoryName: '客厅装饰植物',
    image: 'https://img2.baidu.com/it/u=2608846041,1634589612&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422',
    images: ['https://img2.baidu.com/it/u=2608846041,1634589612&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422'],
    description: '绿萝吊篮，净化空气',
    details: '绿萝吊篮，生长旺盛，具有很好的空气净化能力，适合室内悬挂装饰。',
    stock: 60,
    sales: 120,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: '绿萝',
      package: '吊篮',
      delivery: '全国包邮',
      freshness: '鲜活植物',
      size: '25×40cm',
      weight: '1.2kg'
    },
    tags: ['净化空气', '悬挂']
  },
  { 
    id: 12,
    name: '龟背竹',
    price: 68.0,
    seckillPrice: 48.0,
    category: '客厅装饰植物',
    categoryId: 3,
    categoryName: '客厅装饰植物',
    image: 'https://img0.baidu.com/it/u=1188486278,4128432791&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653',
    images: ['https://img0.baidu.com/it/u=1188486278,4128432791&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653'],
    description: '龟背竹，叶片独特，净化空气',
    details: '龟背竹，叶片形状独特如龟背，具有很好的空气净化能力，适合客厅、书房摆放。',
    stock: 35,
    sales: 42,
    isSeckill: true,
    seckillStock: 6,
    isNew: true,
    discount: 0.7,
    specifications: {
      material: '龟背竹',
      package: '陶瓷盆',
      delivery: '全国包邮',
      freshness: '鲜活植物',
      size: '40×60cm',
      weight: '3.2kg'
    },
    tags: ['净化空气', '独特']
  },
  { 
    id: 13,
    name: '鹤望兰',
    price: 128.0,
    seckillPrice: 98.0,
    category: '客厅装饰植物',
    categoryId: 3,
    categoryName: '客厅装饰植物',
    image: 'https://img0.baidu.com/it/u=2529623698,4028653858&fm=253&fmt=auto&app=138&f=JPEG?w=558&h=500',
    images: ['https://img0.baidu.com/it/u=2529623698,4028653858&fm=253&fmt=auto&app=138&f=JPEG?w=558&h=500'],
    description: '鹤望兰，花形优雅，象征吉祥',
    details: '鹤望兰，花形优雅如仙鹤，象征吉祥如意，适合客厅、玄关摆放，提升家居品味。',
    stock: 20,
    sales: 28,
    isSeckill: false,
    isNew: true,
    discount: 0,
    specifications: {
      material: '鹤望兰',
      package: '陶瓷盆',
      delivery: '专业物流',
      freshness: '鲜活植物',
      size: '50×80cm',
      weight: '4.5kg'
    },
    tags: ['吉祥', '优雅']
  },
  // 花种数据 (categoryId: 4)
  { 
    id: 14,
    name: '玫瑰种子 (混合色)',
    price: 15.8,
    seckillPrice: 12.8,
    category: '花种',
    categoryId: 4,
    categoryName: '花种',
    image: 'https://img1.baidu.com/it/u=1709233206,2284207213&fm=253&fmt=auto&app=138&f=JPEG?w=608&h=456',
    images: ['https://img1.baidu.com/it/u=1709233206,2284207213&fm=253&fmt=auto&app=138&f=JPEG?w=608&h=456'],
    description: '混合色玫瑰种子，易于种植',
    details: '优质玫瑰种子，包含红、粉、白等多种颜色，发芽率高，适合家庭种植。',
    stock: 100,
    sales: 200,
    isSeckill: true,
    seckillStock: 20,
    isNew: true,
    discount: 0.8,
    specifications: {
      material: '玫瑰种子',
      package: '袋装',
      delivery: '全国包邮',
      freshness: '新鲜种子',
      size: '5g/袋',
      weight: '0.01kg'
    },
    tags: ['种子', '玫瑰']
  },
  { 
    id: 15,
    name: '向日葵种子',
    price: 12.5,
    seckillPrice: 9.9,
    category: '花种',
    categoryId: 4,
    categoryName: '花种',
    image: 'https://img0.baidu.com/it/u=3684692628,1876949830&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    images: ['https://img0.baidu.com/it/u=3684692628,1876949830&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'],
    description: '向日葵种子，阳光花卉',
    details: '高品质向日葵种子，生长快速，花朵大而鲜艳，适合庭院、阳台种植。',
    stock: 80,
    sales: 150,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: '向日葵种子',
      package: '袋装',
      delivery: '全国包邮',
      freshness: '新鲜种子',
      size: '10g/袋',
      weight: '0.02kg'
    },
    tags: ['种子', '向日葵']
  },
  {
    id: 16,
    name: '薰衣草种子',
    price: 18.0,
    seckillPrice: 12.9,
    category: '花种',
    categoryId: 4,
    categoryName: '花种',
    image: 'https://img1.baidu.com/it/u=4137805983,2662671440&fm=253&fmt=auto?w=609&h=500',
    images: ['https://img1.baidu.com/it/u=4137805983,2662671440&fm=253&fmt=auto?w=609&h=500'],
    description: '薰衣草种子 助眠清香',
    details: '法国真薰衣草，淡雅清香，可制作香包、助眠茶，耐寒耐旱，阳台庭院均可种。',
    stock: 150,
    sales: 460,
    isSeckill: true,
    seckillStock: 20,
    isNew: false,
    discount: 0.72,
    specifications: {
      material: '种子',
      package: '铝箔袋装',
      delivery: '全国包邮',
      freshness: '当季新采',
      size: '约 200 粒/袋',
      weight: '0.02kg'
    },
    tags: ['种子', '薰衣草']
  },
  {
    id: 17,
    name: '康乃馨种子',
    price: 14.9,
    seckillPrice: 9.9,
    category: '花种',
    categoryId: 4,
    categoryName: '花种',
    image: 'https://img2.baidu.com/it/u=388526009,1896561337&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889',
    images: ['https://img2.baidu.com/it/u=388526009,1896561337&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'],
    description: '康乃馨种子 母爱之花',
    details: '重瓣康乃馨，花色丰富，花期长，适合盆栽、切花，送母亲的最佳选择。',
    stock: 180,
    sales: 650,
    isSeckill: true,
    seckillStock: 25,
    isNew: true,
    discount: 0.66,
    specifications: {
      material: '种子',
      package: '铝箔袋装',
      delivery: '全国包邮',
      freshness: '当季新采',
      size: '约 30 粒/袋',
      weight: '0.02kg'
    },
    tags: ['种子', '康乃馨']
  },
  {
    id: 18,
    name: '百合花种子',
    price: 22.0,
    seckillPrice: 16.9,
    category: '花种',
    categoryId: 4,
    categoryName: '花种',
    image: 'https://img0.baidu.com/it/u=4146671325,3743949515&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    images: ['https://img0.baidu.com/it/u=4146671325,3743949515&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'],
    description: '百合花种子 芳香优雅',
    details: '东方百合系列，花大香浓，颜色多样，可盆栽或地栽，多年生，年年复花。',
    stock: 120,
    sales: 380,
    isSeckill: false,
    seckillStock: 15,
    isNew: false,
    discount: 0.77,
    specifications: {
      material: '种子',
      package: '铝箔袋装',
      delivery: '全国包邮',
      freshness: '当季新采',
      size: '约 20 粒/袋',
      weight: '0.02kg'
    },
    tags: ['种子', '百合']
  },
  {
    id: 19,
    name: '多肉植物种子套装',
    price: 35.0,
    seckillPrice: 25.0,
    category: '花种',
    categoryId: 4,
    categoryName: '花种',
    image: 'https://img0.baidu.com/it/u=2726697879,697018359&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    images: ['https://img0.baidu.com/it/u=2726697879,697018359&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'],
    description: '多肉种子套装 12 款混合',
    details: '12 款热门多肉混合装，包含景天、仙人掌、生石花等，体验"从种子到爆盆"的成就感。',
    stock: 80,
    sales: 210,
    isSeckill: true,
    seckillStock: 10,
    isNew: true,
    discount: 0.71,
    specifications: {
      material: '种子',
      package: '礼盒装',
      delivery: '全国包邮',
      freshness: '当季新采',
      size: '12 小包/礼盒',
      weight: '0.05kg'
    },
    tags: ['种子', '多肉', '套装']
  },
  // 画眉数据 (categoryId: 5)
  { 
    id: 22,
    name: '画眉鸟 (成年公鸟)',
    price: 280.0,
    seckillPrice: 220.0,
    category: '画眉',
    categoryId: 5,
    categoryName: '画眉',
    image: 'https://img1.baidu.com/it/u=2246288595,362603810&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=724',
    images: ['https://img1.baidu.com/it/u=2246288595,362603810&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=724'],
    description: '健康成年公画眉鸟',
    details: '健康活泼的成年公画眉鸟，鸣声悦耳，适合鸟类爱好者饲养。',
    stock: 8,
    sales: 25,
    isSeckill: true,
    seckillStock: 2,
    isNew: true,
    discount: 0.8,
    specifications: {
      material: '画眉鸟',
      package: '专业运输笼',
      delivery: '活体专送',
      freshness: '鲜活',
      size: '中小型',
      weight: '0.2kg'
    },
    tags: ['宠物鸟', '鸣禽']
  },
  { 
    id: 23,
    name: '画眉幼鸟',
    price: 150.0,
    seckillPrice: 120.0,
    category: '画眉',
    categoryId: 5,
    categoryName: '画眉',
    image: 'https://ci.xiaohongshu.com/998e6d06-fafc-5360-afc6-9d388e197ae8?imageView2/2/w/1080/format/jpg',
    images: ['https://ci.xiaohongshu.com/998e6d06-fafc-5360-afc6-9d388e197ae8?imageView2/2/w/1080/format/jpg'],
    description: '画眉幼鸟，易于驯养',
    details: '健康画眉幼鸟，易于驯养和训练，适合鸟类饲养初学者。',
    stock: 12,
    sales: 18,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: '画眉幼鸟',
      package: '专业运输笼',
      delivery: '活体专送',
      freshness: '鲜活',
      size: '幼鸟',
      weight: '0.1kg'
    },
    tags: ['幼鸟', '宠物']
  },
  {
    id: 24,
    name: "精品画眉笼",
    price: 120.0,
    seckillPrice: 95.0,
    category: "画眉",
    categoryId: 5,
    categoryName: "画眉",
    image: "https://img2.baidu.com/it/u=765474856,1580436770&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=754",
    images: ["https://img2.baidu.com/it/u=765474856,1580436770&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=754"],
    description: "精品画眉笼，坚固耐用",
    details: "专业设计画眉笼，采用优质材料制作，结构稳固，空间充足。",
    stock: 25,
    sales: 42,
    isSeckill: false,
    isNew: true,
    discount: 0,
    specifications: {
      material: "不锈钢",
      package: "纸箱包装",
      delivery: "快递运输",
      freshness: "长期保存",
      size: "中型",
      weight: "2.5kg"
    },
    tags: ["笼具", "配件"]
  },
  {
    id: 25,
    name: "画眉专用饲料",
    price: 35.0,
    seckillPrice: 28.0,
    category: "画眉",
    categoryId: 5,
    categoryName: "画眉",
    image: "https://img1.baidu.com/it/u=1730566312,2362996686&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667",
    images: ["https://img1.baidu.com/it/u=1730566312,2362996686&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667"],
    description: "画眉专用营养饲料",
    details: "富含多种营养成分的专业画眉饲料，促进鸟类健康成长。",
    stock: 150,
    sales: 320,
    isSeckill: true,
    seckillStock: 30,
    isNew: false,
    discount: 0.8,
    specifications: {
      material: "谷物混合物",
      package: "密封袋装",
      delivery: "快递运输",
      freshness: "12个月",
      size: "2kg装",
      weight: "2kg"
    },
    tags: ["饲料", "消耗品"]
  },
  {
    id: 26,
    name: "画眉洗澡笼",
    price: 65.0,
    seckillPrice: 52.0,
    category: "画眉",
    categoryId: 5,
    categoryName: "画眉",
    image: "https://t13.baidu.com/it/u=3280617109,2248975927&fm=224&app=112&f=JPEG?w=375&h=500",
    images: ["https://t13.baidu.com/it/u=3280617109,2248975927&fm=224&app=112&f=JPEG?w=375&h=500"],
    description: "画眉专用洗澡笼",
    details: "专为画眉设计的洗澡笼，便于鸟儿清洁羽毛，保持卫生。",
    stock: 38,
    sales: 67,
    isSeckill: false,
    isNew: false,
    discount: 0,
    specifications: {
      material: "塑料+不锈钢",
      package: "纸箱包装",
      delivery: "快递运输",
      freshness: "长期保存",
      size: "小型",
      weight: "1.2kg"
    },
    tags: ["清洁用品", "配件"]
  },
  {
    id: 33,
    name: "画眉保健砂",
    price: 18.0,
    seckillPrice: 14.0,
    category: "画眉",
    categoryId: 5,
    categoryName: "画眉",
    image: "https://t13.baidu.com/it/u=3475505169,3950624244&fm=224&app=112&f=JPEG?w=500&h=500",
    images: ["https://t13.baidu.com/it/u=3475505169,3950624244&fm=224&app=112&f=JPEG?w=500&h=500"],
    description: "画眉专用保健砂",
    details: "帮助画眉消化，补充矿物质，维持鸟类健康。",
    stock: 200,
    sales: 450,
    isSeckill: false,
    isNew: true,
    discount: 0,
    specifications: {
      material: "天然矿物砂",
      package: "塑料罐装",
      delivery: "快递运输",
      freshness: "24个月",
      size: "500g装",
      weight: "0.5kg"
    },
    tags: ["保健品", "消耗品"]
  },
  // 园艺工具数据 (categoryId: 6)
  { 
    id: 27,
    name: '园艺剪刀套装',
    price: 45.0,
    seckillPrice: 35.0,
    category: '园艺工具',
    categoryId: 6,
    categoryName: '园艺工具',
    image: 'https://img1.baidu.com/it/u=1709512703,905139419&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    images: ['https://img1.baidu.com/it/u=1709512703,905139419&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'],
    description: '专业园艺剪刀套装',
    details: '专业园艺剪刀套装，包含修枝剪、芽接刀等工具，适合家庭园艺使用。',
    stock: 30,
    sales: 75,
    isSeckill: true,
    seckillStock: 5,
    isNew: true,
    discount: 0.78,
    specifications: {
      material: '不锈钢',
      package: '盒装',
      delivery: '全国包邮',
      freshness: '新品',
      size: '套装',
      weight: '0.8kg'
    },
    tags: ['工具', '套装']
  },
  { 
    id: 28,
    name: '不锈钢小铲子',
    price: 28.0,
    seckillPrice: 18.0,
    category: '园艺工具',
    categoryId: 6,
    categoryName: '园艺工具',
    image: 'https://t13.baidu.com/it/u=1613253233,607855048&fm=224&app=112&f=JPEG?w=500&h=500',
    images: ['https://t13.baidu.com/it/u=1613253233,607855048&fm=224&app=112&f=JPEG?w=500&h=500'],
    description: '不锈钢小铲子',
    details: '不锈钢小铲子，手感舒适，适合移栽、松土等日常园艺操作。',
    stock: 50,
    sales: 120,
    isSeckill: true,
    seckillStock: 8,
    isNew: false,
    discount: 0.64,
    specifications: {
      material: '不锈钢',
      package: '袋装',
      delivery: '全国包邮',
      freshness: '现货',
      size: '全长 26 cm',
      weight: '0.18kg'
    },
    tags: ['工具', '铲子']
  },
  {
    id: 29,
    name: '浇水壶 (2L)',
    price: 35.0,
    seckillPrice: 25.0,
    category: '园艺工具',
    categoryId: 6,
    categoryName: '园艺工具',
    image: 'https://img1.baidu.com/it/u=3795178662,1030497591&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    images: ['https://img1.baidu.com/it/u=3795178662,1030497591&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'],
    description: '2L 容量浇水壶',
    details: '2L 容量，细长壶嘴设计，适合家庭绿植、阳台花卉精准浇水。',
    stock: 40,
    sales: 90,
    isSeckill: false,
    seckillStock: 6,
    isNew: true,
    discount: 0.71,
    specifications: {
      material: 'PP+不锈钢壶嘴',
      package: '袋装',
      delivery: '全国包邮',
      freshness: '新品',
      size: '2L',
      weight: '0.22kg'
    },
    tags: ['工具', '浇水']
  },
  {
    id: 30,
    name: '园艺手套 (加厚)',
    price: 15.0,
    seckillPrice: 9.9,
    category: '园艺工具',
    categoryId: 6,
    categoryName: '园艺工具',
    image: 'https://t15.baidu.com/it/u=2785683822,415327082&fm=224&app=112&f=JPEG?w=500&h=500',
    images: ['https://t15.baidu.com/it/u=2785683822,415327082&fm=224&app=112&f=JPEG?w=500&h=500'],
    description: '加厚园艺手套',
    details: '加厚涂层，防刺防水，贴合手型，修剪、种植更安心。',
    stock: 100,
    sales: 300,
    isSeckill: false,
    seckillStock: 15,
    isNew: false,
    discount: 0.66,
    specifications: {
      material: '涤纶+乳胶涂层',
      package: '袋装',
      delivery: '全国包邮',
      freshness: '现货',
      size: '均码',
      weight: '0.08kg'
    },
    tags: ['防护', '手套']
  },
  {
    id: 31,
    name: '植物修剪锯',
    price: 58.0,
    seckillPrice: 45.0,
    category: '园艺工具',
    categoryId: 6,
    categoryName: '园艺工具',
    image: 'https://img0.baidu.com/it/u=3229667949,3535090277&fm=253&fmt=auto&app=138&f=JPEG?w=514&h=500',
    images: ['https://img0.baidu.com/it/u=3229667949,3535090277&fm=253&fmt=auto&app=138&f=JPEG?w=514&h=500'],
    description: '折叠植物修剪锯',
    details: 'SK5 合金锯片，三面磨齿，折叠设计，安全锁定，轻松修剪粗枝。',
    stock: 25,
    sales: 60,
    isSeckill: false,
    seckillStock: 4,
    isNew: true,
    discount: 0.78,
    specifications: {
      material: 'SK5 合金锯片+铝合金手柄',
      package: '盒装',
      delivery: '全国包邮',
      freshness: '新品',
      size: '展开 40 cm',
      weight: '0.35kg'
    },
    tags: ['工具', '锯子']
  },
  {
    id: 32,
    name: '园艺工具套装 (8件套)',
    price: 128.0,
    seckillPrice: 99.0,
    category: '园艺工具',
    categoryId: 6,
    categoryName: '园艺工具',
    image: 'https://t14.baidu.com/it/u=93636103,1687264570&fm=224&app=112&f=JPEG?w=500&h=500',
    images: ['https://t14.baidu.com/it/u=93636103,1687264570&fm=224&app=112&f=JPEG?w=500&h=500'],
    description: '8 件套园艺工具套装',
    details: '8 件套：铲子、耙子、剪刀、测土器、卷尺、喷壶、手套、收纳包，一站式配齐。',
    stock: 20,
    sales: 45,
    isSeckill: true,
    seckillStock: 3,
    isNew: true,
    discount: 0.77,
    specifications: {
      material: '不锈钢+优质塑料',
      package: '牛津布收纳包',
      delivery: '全国包邮',
      freshness: '新品',
      size: '套装',
      weight: '1.5kg'
    },
    tags: ['工具', '套装']
  }
];

// 分类数据
export const mockCategories = [
  { id: 1, name: '迎宾花卉' },
  { id: 2, name: '景观植物' },
  { id: 3, name: '客厅装饰植物' },
  { id: 4, name: '花种' },
  { id: 5, name: '画眉' },
  { id: 6, name: '园艺工具' },
];

// 模拟 API 函数
export const mockGetCategories = () => {
  return {
    code: 200,
    data: mockCategories,
    message: 'success'
  };
};

export const mockSearchCommodities = (keyword) => {
  if (!keyword || keyword.trim() === '') {
    return {
      code: 200,
      data: [],
      message: '搜索关键词为空'
    };
  }
  
  const searchTerm = keyword.trim().toLowerCase();
  
  // 关键词分词（简单分词，按空格分割）
  const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0);
  
  // 改进的精确匹配逻辑
  const results = mockCommodities.filter(item => {
    const itemName = item.name.toLowerCase();
    const itemDescription = item.description.toLowerCase();
    const itemCategory = item.category.toLowerCase();
    const itemTags = item.tags && Array.isArray(item.tags) ? 
      item.tags.map(tag => tag.toLowerCase()) : [];
    
    // 如果只有一个关键词，使用精确匹配
    if (searchTerms.length === 1) {
      const term = searchTerms[0];
      
      // 名称精确匹配（最高优先级）
      const nameExactMatch = itemName === term || itemName.split(/\s+/).includes(term);
      const nameContainsMatch = itemName.includes(term);
      
      // 描述匹配（中等优先级）
      const descriptionMatch = itemDescription.includes(term);
      
      // 分类匹配（最低优先级）
      const categoryMatch = itemCategory.includes(term);
      
      // 标签精确匹配
      const tagsExactMatch = itemTags.some(tag => tag === term);
      const tagsContainsMatch = itemTags.some(tag => tag.includes(term));
      
      return nameExactMatch || nameContainsMatch || descriptionMatch || 
             categoryMatch || tagsExactMatch || tagsContainsMatch;
    } else {
      // 多个关键词，需要所有关键词都匹配
      return searchTerms.every(term => {
        const nameExactMatch = itemName === term || itemName.split(/\s+/).includes(term);
        const nameContainsMatch = itemName.includes(term);
        const descriptionMatch = itemDescription.includes(term);
        const categoryMatch = itemCategory.includes(term);
        const tagsExactMatch = itemTags.some(tag => tag === term);
        const tagsContainsMatch = itemTags.some(tag => tag.includes(term));
        
        return nameExactMatch || nameContainsMatch || descriptionMatch || 
               categoryMatch || tagsExactMatch || tagsContainsMatch;
      });
    }
  });
  
  // 对结果进行智能排序
  results.sort((a, b) => {
    // 计算匹配度分数
    const getMatchScore = (item) => {
      let score = 0;
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      
      searchTerms.forEach(term => {
        // 名称精确匹配得分最高
        if (name === term || name.split(/\s+/).includes(term)) score += 20;
        
        // 名称包含匹配得分较高
        if (name.includes(term)) score += 10;
        
        // 描述匹配得分中等
        if (description.includes(term)) score += 5;
        
        // 分类匹配得分较低
        if (item.category.toLowerCase().includes(term)) score += 3;
        
        // 标签精确匹配得分较高
        if (item.tags && Array.isArray(item.tags)) {
          if (item.tags.some(tag => tag.toLowerCase() === term)) score += 15;
          if (item.tags.some(tag => tag.toLowerCase().includes(term))) score += 5;
        }
      });
      
      return score;
    };
    
    const aScore = getMatchScore(a);
    const bScore = getMatchScore(b);
    
    // 按匹配度降序排列
    if (aScore !== bScore) {
      return bScore - aScore;
    }
    
    // 匹配度相同，按销量降序排列
    return b.sales - a.sales;
  });
  
  console.log(`搜索关键词: "${searchTerm}", 分词结果: [${searchTerms.join(', ')}], 匹配结果数量: ${results.length}`);
  
  return {
    code: 200,
    data: results,
    message: 'success'
  };
};

// 获取秒杀商品
export const mockGetSeckillCommodities = () => {
  const seckillCommodities = mockCommodities
    .filter(item => item.isSeckill === true)
    .map(item => ({
      comId: item.id,                    
      comName: item.name,                
      comPrice: item.price,              
      seckillPrice: item.seckillPrice || item.price * 0.8,
      comPicture: item.image,            
      stock: item.seckillStock || Math.floor(item.stock * 0.3),
      total: (item.seckillStock || Math.floor(item.stock * 0.3)) + 
             Math.floor(Math.random() * 20) + 10
    }));
  
  return {
    code: 200,
    data: seckillCommodities,
    message: 'success'
  };
};

// 随机获取商品（用于同城页面）
export const mockGetRandomCommodities = (count = 12) => {
  const shuffled = [...mockCommodities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 验证商品数据结构的函数
export const validateCommodityData = (commodities) => {
  const requiredFields = ['id', 'name', 'price', 'category', 'categoryId'];
  const missingFields = [];
  const duplicateIds = [];
  const seenIds = new Set();
  
  commodities.forEach((item, index) => {
    // 检查必填字段
    requiredFields.forEach(field => {
      // 使用安全的方式检查属性
      if (!Object.prototype.hasOwnProperty.call(item, field)) {
        missingFields.push(`商品索引${index}缺少字段: ${field}`);
      }
    });
    
    // 检查ID重复
    if (item.id) {
      if (seenIds.has(item.id)) {
        duplicateIds.push(`重复ID: ${item.id} (索引: ${index})`);
      } else {
        seenIds.add(item.id);
      }
    }
  });
  
  console.log('=== 商品数据验证结果 ===');
  if (missingFields.length > 0) {
    console.error('缺少字段:', missingFields);
  }
  if (duplicateIds.length > 0) {
    console.error('重复ID:', duplicateIds);
  }
  if (missingFields.length === 0 && duplicateIds.length === 0) {
    console.log('商品数据格式正确');
  }
  
  return {
    valid: missingFields.length === 0 && duplicateIds.length === 0,
    missingFields,
    duplicateIds
  };
};

// 验证当前数据
validateCommodityData(mockCommodities);