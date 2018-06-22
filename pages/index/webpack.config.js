const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
    entry: path.join(APP_DIR, 'index.tsx'),
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                include: APP_DIR,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
        ]
    }
};

module.exports = config;
