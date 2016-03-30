var path = require('path');
var reporters = ['progress', 'coverage'];
var coverageReporter = {
    type: 'lcov',
    dir: 'coverage'
};
var browsers = [];

if (process.env.NODE_ENV === 'test') {
    reporters.push('coveralls');
    browsers.push('Firefox', 'Chrome');
} else {
    browsers.push('PhantomJS');
}

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/babel-polyfill/dist/polyfill.js',
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