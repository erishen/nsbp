const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = (_, { mode }) => {
    console.log('mode', mode)

    const config = {
        entry: {
            app: ['./src/App.ts']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: ({ chunk }) => {
                const { name } = chunk
                console.log('name', name)
                return `js/[name].bundle.js`
            },
            clean: true
        },
        devtool: "source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "awesome-typescript-loader"
                },
                {
                    test: /\.less$/,
                    use: [
                        (mode === 'production') ? MiniCssExtractPlugin.loader : 'style-loader', 
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.s(a|c)ss$/,
                    use: [
                        (mode === 'production') ? MiniCssExtractPlugin.loader : 'style-loader', 
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test:/\.css$/,
                    use: [
                        (mode === 'production') ? MiniCssExtractPlugin.loader : 'style-loader', 
                        'css-loader', 
                        'postcss-loader'
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html"
            }),
            new MiniCssExtractPlugin()
        ],
        optimization: {
            minimize: (mode === 'production') ? true : false,
            minimizer: [
                `...`,
                new CssMinimizerPlugin()
            ]
        }
    }

    if(mode === 'development'){
        config.entry['vendor'] = ['react', 'react-dom']
    } else if(mode === 'production'){
        config.optimization['splitChunks'] = {
            cacheGroups: {
                default: false,
                vendors: false, 
                framework: {
                  // 将react和react-dom打入framework当中
                  name: 'framework',
                  chunks: 'all',
                  test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, //匹配库当中的react和react-dom
                  priority: 40 //权重为40 最大权重
                },
                lib: {
                  test(module) {
                    // 匹配包大于160000的
                    return module.size() > 160000
                  },
                  name(module) {
                    // 名字就是包当中的名字
                    return (
                      /node_modules\/(.*)/.exec(module.identifier()) &&
                      /node_modules\/(.*)/.exec(module.identifier()).length &&
                      /node_modules\/(.*)/
                        .exec(module.identifier())[1]
                        .replace(/\/|\\/g, '_')
                    )
                  },
                  priority: 30, //权重为30
                  minChunks: 1, //最小共用次数为1时就使用
                  reuseExistingChunk: true
                },
                commons: {
                  name: 'commons',
                  chunks: 'all',
                  minChunks: 20,
                  priority: 20
                },
                shared: {
                  priority: 10,
                  minChunks: 2,
                  reuseExistingChunk: true
                }
            }
        }

        config.optimization['runtimeChunk'] = {
            name: 'runtime'
        }
    }

    return config
}
