/*
    // 1. single entry
    entry: './src/main.js',
    // 上面单个文件是下面写法的简写
    entry: {
        main: './src/main.js'
    },
    // 2. 多个入口，通过 [name].js 输出多个文件
    entry: {
    app: './src/app.js',
        vendor: './src/vendor.js'
    },
 */
module.exports =  {
    index: './src/index.js'
};


