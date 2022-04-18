const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

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
    devtool: 'inline-source-map',
    target: ["web", "es5"],
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