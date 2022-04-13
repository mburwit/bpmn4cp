const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index_bundle.js",
        library: "bpmn4cp",
        libraryTarget: "umd",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/assets/font',
                    to: 'assets/font'
                },
                {
                    from: 'node_modules/bpmn-js-properties-panel/styles',
                    to: 'assets/vendor/bpmn-js-properties-panel'
                },
                {
                    from: 'node_modules/bpmn-js/dist/assets',
                    to: 'assets/vendor/bpmn-js'
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    mode: "development",
}