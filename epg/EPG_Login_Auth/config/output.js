/*
  输出文件
  1. 固定名称，如：bundle.js
  2. 使用入口文件的名称，如：[name].js，这里的[name]指向的就是entry里面的入口文件名
  3. 多个入口时，使用[name].js来输出多个对应的文件
  4. 加上hash值标识唯一文件：[name]_[hash].js
  5. 给hash值加上截取个数：[name]_[hash:5].js
*/

var path = require('path');
module.exports =  {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]_[hash:5].js'
};
