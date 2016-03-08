var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            {pattern: 'dist/obj/**/*.json', included: false, served: true},
            'node_modules/karma-read-json/karma-read-json.js',
            'test/**/*.js'
        ],
        preprocessors: {
            'test/**/*.js': ['webpack', 'sourcemap']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                preLoaders: [
                    {test: /\.js$/, exclude: /(test|node_modules)/, loader: 'isparta'}
                ],
                loaders: [
                    {test: /\.js$/, exclude: /(node_modules)/, loader: 'babel'},
                    {test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024'},
                    {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
                    {test: /\.json/, loader: 'json'}
                ]
            },
            resolve: webpackConfig.resolve
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