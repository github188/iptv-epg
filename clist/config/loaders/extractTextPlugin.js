/*
  extract-text-webpack-plugin template
*/

const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.export = (regex, type, fb, loaders) = > {
    return {
        test: regex,
        use: ExtractTextPlugin.extract({
            fallback: fb,
            use: loaders
        })
    };
};
