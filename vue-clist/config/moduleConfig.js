/*
  注意点：webpack 2.0 中使用loader方式，不能使用 use: 'style!css'

  如果需要添加选项，那么不能使用字符串，要用到对象方式，如下的 css-loader

  loader 几种使用方式：
  1. use: 'css-loader'
  2. use: ['style-loader', 'css-loader']
  3. use: ['style-loader', { loader: 'css-loader' options: { ... }}]

  loader 几种使用地方
  1. 如此处配置文件方式
  2. import时候，如：
  import styles from 'style-loader!css-loader?modules!./style.css';
  3. 命令行
  webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
*/

// let ExtractTextPlugin = require('extract-text-webpack-plugin');//
let vueLoader = require('./loaders/vueLoader');
let cssLoader = require('./loaders/cssLoader');
let sassLoader = require('./loaders/sassLoader');
let stylusLoader = require('./loaders/stylusLoader');
let lessLoader = require('./loaders/lessLoader');
let jsLoader = require('./loaders/jsLoader');
let otherLoader = require('./loaders/otherLoader');

module.exports = {
    rules: [
        vueLoader,
        cssLoader,
        sassLoader,
        stylusLoader,
        lessLoader,
        jsLoader,
        otherLoader.file,
        otherLoader.url,
        otherLoader.csv,
        otherLoader.xml
    ]
};
