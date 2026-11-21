const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
// The Unity package, not the Bridge npm package, so the reported version matches the SDK users install
const unityPackage = require('../package.json');

module.exports = {
    entry: {
        'livekit': {
            import: ['livekit-client'],
            filename: 'Runtime/Plugins/livekit-client.jspre'
        },

        'lkbridge': {
            import: './src/index.ts',
            filename: 'Runtime/Plugins/livekit-jsbridge.jspre',
            dependOn: 'livekit'
        },
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            __LK_UNITY_SDK_VERSION__: JSON.stringify(unityPackage.version),
        }),
    ],
    devtool: 'inline-source-map',
    target: ["web"],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                test: /\.jspre(\?.*)?$/i,
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                },
            }),
        ],
    },
    output: {
        globalObject: 'this',
        filename: '[name]',
        path: path.resolve(__dirname, '../'),
        library: {
            name: '[name]',
            type: 'window',
        }
    },
};