/* eslint-disable strict, no-console, object-shorthand */
/* eslint-disable import/no-extraneous-dependencies, import/newline-after-import */
'use strict';

const path = require('path');

const webpack = require('webpack');
const autoPrefixer = require('autoprefixer');
const combineLoaders = require('webpack-combine-loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').load({ path: '../.env', silent: true });

const PRODUCTION = process.env.NODE_ENV === 'production';
const EXTRACT = process.env.NODE_ENV === 'extract';

const PATHS = {
    SIMPLE_TRANSACTIONS: path.resolve(__dirname, '01_simple_transactions/simple_transactions.js'),
    ASSETS_UNSPENTS: path.resolve(__dirname, '02_assets_unspents/assets_unspents.js'),
    DIVISIBLE_TRANSACTIONS: path.resolve(__dirname, '03_divisible_transactions/divisible_transactions.js'),

    BUILD: path.resolve(__dirname, 'build'),
    DIST: path.resolve(__dirname, 'dist'),
    NODE_MODULES: path.resolve(__dirname, 'node_modules'),
};


/** ENTRY POINTS **/
const ENTRY = {
    // Use one entry per app
    simple_transactions: PATHS.SIMPLE_TRANSACTIONS,
    assets_unspents: PATHS.ASSETS_UNSPENTS,
    divisible_transactions: PATHS.DIVISIBLE_TRANSACTIONS
};

console.log('BDB_SERVER_URL:', process.env.BDB_SERVER_URL);
/** EXTERNAL DEFINITIONS INJECTED INTO APP **/
const DEFINITIONS = {
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        BDB_SERVER_URL: JSON.stringify(`${process.env.BDB_SERVER_URL || 'http://localhost:9984'}`),
    },
};


/** PLUGINS **/
const PLUGINS = [
    new webpack.DefinePlugin(DEFINITIONS),
    new webpack.NoErrorsPlugin(),
];

const PROD_PLUGINS = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        output: {
            comments: false
        },
        sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true
    }),
];

const EXTRACT_CSS_PLUGIN = new ExtractTextPlugin(
    PRODUCTION ? '[name]/styles.min.css' : '[name]/styles.css', {
        allChunks: true
    }
);


if (EXTRACT || PRODUCTION) {
    PLUGINS.push(EXTRACT_CSS_PLUGIN);
}

if (PRODUCTION) {
    PLUGINS.push(...PROD_PLUGINS);
}


/** LOADERS **/
const JS_LOADER = combineLoaders([
    {
        loader: 'babel',
        query: {
            cacheDirectory: true
        },
    },
]);

const CSS_LOADER = combineLoaders([
    {
        loader: 'css',
        query: {
            sourceMap: true
        }
    },
    { loader: 'postcss' },
    {
        loader: 'sass',
        query: {
            precision: '8', // See https://github.com/twbs/bootstrap-sass#sass-number-precision
            outputStyle: 'expanded',
            sourceMap: true
        }
    },
]);

const LOADERS = [
    {
        test: /\.jsx?$/,
        exclude: [PATHS.NODE_MODULES],
        loader: JS_LOADER,
    },
    {
        test: /\.json$/,
        loader: 'json'
    },
    {
        test: /\.s[ac]ss$/,
        exclude: [PATHS.NODE_MODULES],
        loader: PRODUCTION || EXTRACT ? ExtractTextPlugin.extract('style', CSS_LOADER)
                                      : `style!${CSS_LOADER}`,
    },
    {
        test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=100000'
    },
];


/** EXPORTED WEBPACK CONFIG **/
module.exports = {
    entry: ENTRY,

    output: {
        filename: PRODUCTION ? '[name]/bundle.min.js' : '[name]/bundle.js',
        path: PRODUCTION ? PATHS.DIST : PATHS.BUILD,
    },

    debug: !PRODUCTION,

    devtool: PRODUCTION ? '#source-map' : '#inline-source-map',

    resolve: {
        alias: {
            'babel-runtime': path.resolve(PATHS.NODE_MODULES, 'babel-runtime'),
            'core-js': path.resolve(PATHS.NODE_MODULES, 'core-js'),
        },
        extensions: ['', '.js', '.jsx'],
        modules: ['node_modules'], // Don't use absolute path here to allow recursive matching
    },

    plugins: PLUGINS,

    module: {
        loaders: LOADERS,
    },

    postcss: [autoPrefixer()],
};
