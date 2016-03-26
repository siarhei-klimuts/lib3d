var path = require('path');
var reporters = ['progress', 'coverage'];
var coverageReporter = {
    type: 'lcov',
    dir: 'coverage'
};
var browsers = [];

if (process.env.NODE_ENV === 'production') {
    reporters.push('coveralls');
    browsers.push('Firefox');
} else {
    browsers.push('Chrome');
}

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
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
                    {test: /\.(png|jpg)$/, loader: 'url'},
                    {test: /\.(glsl|vs|fs)$/, loader: 'shader'},
                    {test: /\.json/, loader: 'json'}
                ]
            },
            resolve: {
                root: path.join(__dirname, 'src'),
                alias: {
                    lib3d: 'index.js'
                }
            }
        },
        reporters: reporters,
        coverageReporter: coverageReporter,
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: browsers,
        singleRun: false
    });
};