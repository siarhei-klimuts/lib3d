var webpack = require('webpack');

var NODE_MODULES = __dirname + '/node_modules/';

var isProd = false;

var config = {
    watch: false,
    entry: {
        app: ['./src/index.js'],
        vendors: []
    },
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
            {test: /\.(glsl|vs|fs)$/, loader: 'shader'}
        ],
        noParse: [],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', '/vendors.js')
    ],
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
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    config.devtool = 'source-map';
} else {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.entry.app.unshift(
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server');
    config.devtool = 'eval';
    config.devServer = {
        contentBase: 'dist/',
        publicPath: '/',
        historyApiFallback: false,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: 'localhost',
        port: '8080'
    };
}

config.addVendor('babel-polyfill');
config.addVendor('lodash');
config.addVendor('three');

module.exports = config;