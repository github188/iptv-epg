/*
  less loader
*/
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader'
            },
            {
                loader: 'less-loader'
            }
        ]
    })
};
