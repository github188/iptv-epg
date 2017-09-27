/*
  css loader
*/

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cssLoader = [
    // 'style-loader',
    {
        loader: 'css-loader',
        options: {
            // modules: true, // 为true会将类名打包成hash值
            importLoaders: 1 // 前面有几个loader 值就是多少
        }
    },
    {
        // 使用postcss时候必须要有选项，并且选项中必须有内容
        // 否则会报错：No Postcss config found.
        // 具体配置和选项参考：https://github.com/michael-ciniawsky/postcss-load-config
        loader: 'postcss-loader',
        // 配置也可以通过 postcss.config.js 指定
        options: {
            plugins: (loader) => [
                require('autoprefixer')()
            ]
        }
    }
];

module.exports = { // css loader
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssLoader
    })
};
