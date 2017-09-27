const path = require('path');
const entry = require('./config/entry');
const output = require('./config/output');
const moduleConfig = require('./config/moduleConfig');
const plugins = require('./config/plugins');

if (!process.env.NODE_ENV) {
    // process.env.NODE_ENV = 'development';
    process.env.NODE_ENV = 'production';
}

const env = process.env.NODE_ENV;

module.exports = {

    entry: entry,
    output: output,
    resolve: {
        alias: {
            assets: path.resolve(__dirname, 'assets/'),
            src: path.resolve(__dirname, 'src/'),
            components: path.resolve(__dirname, 'src/components/'),
            tools: path.resolve(__dirname, 'src/tools'),
            config: path.resolve(__dirname, 'src/config'),
            vue: 'vue/dist/vue.js'
        },

        extensions: ['.js', '.jsx', '.styl', '.stylus', '.vue']
    },
    /*
      inline-source-map
      开发环境中使用，可以将错误定位到打包前的文件
      比如错误发生在print.js中，
      如果不加这个控制台错误只会到打包后的文件，
      如果有这个选项，那错误会精确定位到 print.js
    */
    devtool: 'inline-source-map',

    // webpack 服务监听dist目录变化，自动刷新浏览器
    // 热替换文档：https://doc.webpack-china.org/guides/hot-module-replacement/
    devServer: {
        contentBase: './dist'
    },
    module: moduleConfig,

    plugins: plugins
};
