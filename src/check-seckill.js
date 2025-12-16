// 检查秒杀商品数量的简单脚本
// 使用ES模块语法，需要用Node.js 14+并添加 "type": "module" 到package.json

import { mockCommodities } from './mock/data/commodityModel.js';

console.log('总商品数量:', mockCommodities.length);

const seckillCommodities = mockCommodities.filter(item => item.isSeckill === true);
console.log('秒杀商品数量:', seckillCommodities.length);
console.log('秒杀商品详情:', seckillCommodities);
