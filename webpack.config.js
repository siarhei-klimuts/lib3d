var webpack = require('webpack');
var path = require('path');

var NODE_MODULES = __dirname + '/node_modules/';

var isProd = process.env.NODE_ENV === 'production';

var objConfig = function(entry, output, name) {
    return {
        entry: path.resolve(__dirname, entry),
        output: {
            path: path.resolve(__dirname, output),
            filename: name + '.js',
            libraryTarget: 'umd'
        },
        module: {
            loaders: [
                {test: /\.js$/, exclude: /(node_modules)/, loader: 'babel!jshint'},
                {test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024&name=[name].[ext]'}, 
                {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
                {test: /\.json/, loader: 'json'}
            ]
        },
        externals: {
            'lib3d': 'lib3d'
        }
    };
};

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

module.exports = [
    config, 
    objConfig(
        './src/objects/books/book_0001',
        'dist/objects/books/book_0001',
        'book_0001'
    ), 
    objConfig(
        './src/objects/books/book_0002',
        'dist/objects/books/book_0002',
        'book_0002'
    ), 
    objConfig(
        './src/objects/books/book_0003',
        'dist/objects/books/book_0003',
        'book_0003'
    ), 
    objConfig(
        './src/objects/sections/bookshelf_0001',
        'dist/objects/sections/bookshelf_0001',
        'bookshelf_0001'
    ), 
    objConfig(
        './src/objects/libraries/library_0001',
        'dist/objects/libraries/library_0001',
        'library_0001'
    ), 
    objConfig(
        './src/objects/libraries/library_0002',
        'dist/objects/libraries/library_0002',
        'library_0002'
    )
];