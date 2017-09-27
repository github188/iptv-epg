/*
  stylus loader(*.styl)

  nis poststylus

  stylus: https://github.com/shama/stylus-loader
  poststylus: https://github.com/seaneking/poststylus
  autoprefixer: https://github.com/jescalan/autoprefixer-stylus
*/

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const poststylus = require('poststylus');

const stylLoader = [
    'css-loader',
    {
        loader: 'stylus-loader',
        options: {
            use: [
                poststylus(['autoprefixer', 'rucksack-css'])
            ]
        }
    }
];

module.exports = {
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
        use: stylLoader,
        fallback: 'style-loader'
    })
};

