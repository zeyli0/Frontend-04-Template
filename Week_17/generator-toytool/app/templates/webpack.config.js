

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
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [ 'css-loader', 'vue-style-loader' ]
            },
            {
                test: /\.js$/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        // new HtmlWebpackPlugin({template: './src/index.html'})
        new CopyPlugin({
            patterns: [
                {from: 'src/*.html', to: '[name].[ext]'}
            ]
        })
    ],
}