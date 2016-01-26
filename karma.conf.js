var webpackConfig = require('./webpack.config.js');
var path = require('path');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            {pattern: 'dist/obj/**/*.json', included: false, served: true},
            'node_modules/karma-read-json/karma-read-json.js',
            'src/index.js',
            'test/**/*.js'
        ],
        preprocessors: {
            'src/index.js': ['webpack', 'sourcemap'],
            'test/**/*.js': ['webpack', 'sourcemap']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                preLoaders: [
                    {test: /\.js/, exclude: /(node_modules)/, loader: 'babel'},
                    {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
                    {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
                    {test: /\.js/, include: path.resolve('src/'), loader: 'isparta'}
                ]
            },
            resolve: webpackConfig.resolve,
            isparta: {
                embedSource: true,
                noAutoWrap: true,
                babel: {
                    presets: ['es2015']
                }
            }
        },
        reporters: ['progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    });
};