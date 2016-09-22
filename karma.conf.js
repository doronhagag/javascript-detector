// noinspection CodeAssistanceForCoreModules
var webpack = require('webpack');
var path = require('path');

module.exports = function (config) {
    config.set({
        color: true,
        singleRun: true,
        captureTimeout: 5000,
        reportSlowerThan: 500,
        reporters: ['mocha', 'coverage'],
        browsers: ['PhantomJS2'],
        junitReporter: {
            outputDir: 'junitResults',
            outputFile: 'test-results.xml'
        },
        client: {
            captureConsole: true, // prevents console.log output, should remain FALSE. Only TRUE when debugging an issue.
            mocha: {
                ignoreLeaks: true,
                reporter: 'html',

                bail: false // quit test after first failed. Should be TRUE when dev more stable.
            }
        },

        frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon', 'sinon-chai'],

        files: [
            'tests.webpack.js'
        ],

        plugins: [
            'karma-phantomjs2-launcher',
            'karma-chai',
            'karma-coverage',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-mocha-reporter',
            'karma-sinon',
            'karma-chai-as-promised',
            'karma-sinon-chai',
            'karma-junit-reporter'
        ],

        preprocessors: {
            'tests.webpack.js': 'webpack'
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        webpack: {
            devtool: 'inline-source-map',

            resolve: {
                root: [path.join(__dirname, 'node_modules')],
                modulesDirectories: ['src', 'node_modules'],
                alias: {}
            },
            babel: {
                presets: ['es2015', 'stage-0']
            },
            isparta: {
                embedSource: true,
                noAutoWrap: true,
                // these babel options will be passed only to isparta and not to babel-loader
                babel: {
                    presets: ['es2015', 'stage-0']
                }
            },
            module: {
                preLoaders: [
                    {test: /\.js$/, exclude: [/node_modules/, /src/], loader: 'babel'},
                    {test: /\.js$/, include: /src/, loader: 'babel'}
                ]
            },
            plugins: [
                new webpack.IgnorePlugin(/^jsdom$/)
            ]
        },
        webpackMiddleware: {
            // webpack dev middleware settings
            noInfo: true
        }
    });
};