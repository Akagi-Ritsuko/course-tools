const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const home = __dirname + '/src';

// MV3 迁移:cxmooc-tools 与 zsgl-tools 为同源双分发目录,
// 采用多编译器配置保证两目录产物始终一致(此前 zsgl-tools 仅手工拷贝,曾出现旧产物加载报错)
const makeConfig = (distName) => ({
    entry: {
        mooc: home + '/mooc.ts',
        start: home + '/start.ts',
        background: home + '/background.ts',
        popup: home + '/views/popup.ts'
    },
    output: {
        path: __dirname + '/build/' + distName + '/src',
        filename: '[name].js',
        clean: false
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            filename: __dirname + '/build/' + distName + '/src/popup.html',
            template: home + '/views/popup.html',
            inject: 'head',
            title: '弹出页面',
            minify: {
                removeComments: true
            },
            chunks: ['popup']
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            }, {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            "@App": path.resolve(__dirname, 'src/'),
            "@": path.resolve(__dirname, 'src/'),
            'vue': 'vue/dist/vue.esm-bundler.js'
        },
        fullySpecified: false
    },
    performance: {
        hints: false
    }
});

module.exports = [makeConfig('cxmooc-tools'), makeConfig('zsgl-tools')];
