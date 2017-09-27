/*
  vue loader
*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extract = (loader) => {
    let loaders = [ 'css-loader' ];
    if (loader && loaders.indexOf(loader) === -1) {
        loaders.push(loader);
    }
    return ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: loaders
    });
};

module.exports = {
    test: /\.vue$/,
    use: [
        {
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: extract([
                        'css-loader'
                    ]),
                    stylus: extract([
                        'stylus-loader'
                    ]),
                    scss: extract([
                        'sass-loader'
                    ]),
                    sass: extract([
                        {
                            loader: 'sass-loader',
                            query: {
                                indentedSyntax: true
                            }
                        }
                    ]),

                    template: 'vue-html-loader',

                    js: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['env'],
                                comments: false
                            }
                        }
                    ]
                },

                // 会在默认的Loaders 之后执行
                // postLoaders: {
                //     html: 'babel-loader'
                // }
            }
        }
    ]
};
