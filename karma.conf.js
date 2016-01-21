var webpackConfig = require('./webpack.config.js');

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
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    });
};