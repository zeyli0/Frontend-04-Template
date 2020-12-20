

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    entry: {
      app: './src/main.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ],
}