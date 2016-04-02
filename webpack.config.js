var webpack = require('webpack');
var path = require('path');

var NODE_MODULES = __dirname + '/node_modules/';

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
            {test: /\.(png|jpg)$/, loader: 'url'}, 
            {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
            {test: /\.json/, loader: 'json'}
        ]
    },
    glsl: {
        chunkPath: path.join(NODE_MODULES, 'three/src/renderers/shaders/ShaderChunk')
    },
    plugins: [],
    resolve: {
        root: path.join(__dirname, 'src')
    },
    externals: {
        'THREE': 'three'
    }
};

if (process.env.NODE_ENV === 'production') {
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