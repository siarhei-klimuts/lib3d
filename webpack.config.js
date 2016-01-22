var webpack = require('webpack');

var NODE_MODULES = __dirname + '/node_modules/';

var isProd = process.env.NODE_ENV === 'production';

var config = {
    watch: false,
    output: {
        pathinfo: true,
        path: __dirname + '/dist',
        publicPath: '/dist',
        filename: '/bundle.js',
        libraryTarget: 'umd',
        library: 'lib3d'
    },
    module: {
        loaders: [
            {test: /\.js/, exclude: /(node_modules)/, loader: 'babel!jshint'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}, 
            {test: /\.(glsl|vs|fs)$/, loader: 'shader'}
        ],
        noParse: [],
    },
    plugins: [],
    resolve: {
        root: __dirname + '/src',
        alias: {}
    },

    addVendor: function (name, path) {
        if (path) {
            this.resolve.alias[name] = path;
        }

        this.module.noParse.push(new RegExp('^' + name + '$'));
        this.entry.vendors.push(name);
    }
};

if (isProd) {
    config.entry = './src/index.js';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    config.devtool = 'source-map';
    config.externals = {
        'three': 'three'
    };
} else {
    config.entry = {
        app: ['./src/index.js'],
        vendors: []
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin('vendors', '/vendors.js'));
    config.entry.app.unshift(
        'webpack-dev-server/client?http://localhost:8081',
        'webpack/hot/only-dev-server');
    config.devtool = 'eval';
    config.devServer = {
        contentBase: 'example/',
        publicPath: '/',
        historyApiFallback: false,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: 'localhost',
        port: '8081'
    };
    config.addVendor('babel-polyfill');
    config.addVendor('lodash');
    config.addVendor('three');
}

module.exports = config;