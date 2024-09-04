const path = require('path');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'searchHubClient',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
        ],
    },
    devtool: 'source-map', // For easier debugging
    mode: 'development', // Change to 'production' for optimized builds
};
