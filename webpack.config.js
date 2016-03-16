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
        filename: 'lib3d.js',
        libraryTarget: 'umd',
        library: 'lib3d'
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /(node_modules)/, loader: 'babel!jshint'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024&context=./src&name=[path][name].[ext]'}, 
            {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
            {test: /\.json/, loader: 'json'}
        ]
    },
    plugins: [],
    resolve: {
        root: path.join(__dirname, 'src')
    },
    externals: {
        'three': 'THREE',
        'lodash': 'lodash'
    }
};

if (isProd) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    config.devtool = 'source-map';
} else {
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
}

module.exports = config;