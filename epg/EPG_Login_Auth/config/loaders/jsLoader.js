/*
  js loader
*/

module.exports = { // babel loader
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['env'],
            // 打包后去掉注释
            comments: false
        }
    }
};
