var webpack = require('webpack');
var path = require('path');

var NODE_MODULES = __dirname + '/node_modules/';

var isProd = process.env.NODE_ENV === 'production';

var config = {
    watch: false,
    entry: {
        app: [path.resolve(__dirname, './src/index.js')]
    },
    output: {
        pathinfo: true,
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library: 'lib3d'
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /(node_modules)/, loader: 'babel!jshint'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024&context=./src&name=[path][name].[ext]'}, 
            {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
            {test: /\.json/, loader: 'json'}
        ],
        noParse: [],
    },
    plugins: [],
    resolve: {
        root: path.join(__dirname, 'src'),
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
    config.externals = {
        'three': 'three',
        'lodash': 'lodash'
    };
} else {
    config.entry.vendors = [];
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin('vendors', '/vendors.js'));
    config.entry.app.unshift('webpack/hot/dev-server');
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