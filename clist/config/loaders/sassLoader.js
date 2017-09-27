/*
  scss loader

  install:

  nis sass-loader node-sass
*/


const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader'
            },
            {
                loader: 'sass-loader'
            }
        ]
    })
};
