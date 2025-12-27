// 测试搜索功能修复效果
const { mockSearchCommodities } = require('./src/mock/data/commodityModel.js');

console.log('=== 搜索功能测试 ===\n');

// 测试1: 搜索"玫瑰"
console.log('测试1: 搜索关键词 "玫瑰"');
const result1 = mockSearchCommodities('玫瑰');
console.log(`匹配结果数量: ${result1.data.length}`);
console.log('匹配的商品名称:');
result1.data.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.name} (分类: ${item.category})`);
});
console.log('');

// 测试2: 搜索"红玫瑰"
console.log('测试2: 搜索关键词 "红玫瑰"');
const result2 = mockSearchCommodities('红玫瑰');
console.log(`匹配结果数量: ${result2.data.length}`);
console.log('匹配的商品名称:');
result2.data.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.name} (分类: ${item.category})`);
});
console.log('');

// 测试3: 搜索"种子"
console.log('测试3: 搜索关键词 "种子"');
const result3 = mockSearchCommodities('种子');
console.log(`匹配结果数量: ${result3.data.length}`);
console.log('匹配的商品名称:');
result3.data.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.name} (分类: ${item.category})`);
});
console.log('');

// 测试4: 搜索"工具"
console.log('测试4: 搜索关键词 "工具"');
const result4 = mockSearchCommodities('工具');
console.log(`匹配结果数量: ${result4.data.length}`);
console.log('匹配的商品名称:');
result4.data.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.name} (分类: ${item.category})`);
});

console.log('\n=== 测试完成 ===');