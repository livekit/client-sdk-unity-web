const path = require('path');

module.exports = {
    entry: {

        // Used by Unity Templates
        'livekit-client': {
            import: 'livekit-client',
            filename: 'WebGLTemplates/ExampleTemplate/livekit-client.js'
        },

        // Used by emscripten
        //'livekit-wrapper': {
        //    import: './src/index.ts',
       //     filename: 'Plugins/livekit-wrappers.jslib',
            //dependOn: 'livekit-client', // NOTE 'dependOn' must be ignored to avoid build errors. Unity/Emscripten will strip livekit-client so we don't really care about that
       // }
    },
    mode: 'development',
    devtool: 'inline-source-map',
    target: ['web', 'es5'],
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
    output: {
        globalObject: 'this',
        filename: '[name]',
        path: path.resolve(__dirname, '../'),
        library: 'livekit'
    },
};