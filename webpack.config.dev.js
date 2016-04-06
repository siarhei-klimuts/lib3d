var webpack = require('webpack');
var config = require('./webpack.config.js');

config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.entry.app.unshift('webpack/hot/dev-server');
config.devtool = 'eval';
config.devServer = {
    contentBase: '',
    publicPath: '/',
    historyApiFallback: false,
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only',
    host: 'localhost',
    port: '8081'
};

module.exports = config;