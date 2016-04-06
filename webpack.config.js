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
        'three': {
            root: 'THREE',
            commonjs2: "three",
            commonjs: "three",
            amd: "three"
        }
    }
};

module.exports = config;