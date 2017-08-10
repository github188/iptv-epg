/*
  other loader:

  file-loader
  url-loader
  csv-loader
  xml-loader
*/

module.exports = {
    file: { // file loader
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/i,
        use: [
            'file-loader'
        ]
    },

    url: {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 1000000
                }
            }
        ]
    },

    csv: { // json(node 默认自带) csv, tvs文件
        test: /\.(csv|tvs)$/,
        use: [
            'csv-loader'
        ]
    },

    xml: { // xml loader
        test: /\.xml$/,
        use: [
            'xml-loader'
        ]
    }
};
