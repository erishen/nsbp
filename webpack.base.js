const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const { version } = require('./package.json')

const styledComponentsTransformer = createStyledComponentsTransformer()

module.exports = ({ mode, entry, server }) => {
  const config = {
    mode,
    entry,
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  '@babel/preset-react',
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        browsers: ['last 2 versions'] //对主流浏览器最近两个版本进行兼容
                      }
                    }
                  ]
                ],
                plugins: [
                  //["styled-components", { "ssr": true }],
                  ['@babel/plugin-proposal-class-properties'],
                  ['@babel/plugin-proposal-optional-chaining'],
                  ['babel-plugin-styled-components']
                ]
              }
            },
            {
              loader: "awesome-typescript-loader",
              options: {
                configFileName: path.resolve(__dirname, "./tsconfig.json"),
                getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jp?g|webp|gif)$/i,
          use: ["file-loader", "webp-loader?{quality: 100}"]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"]
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin()],
    optimization: {
      minimize: mode === 'production' || server ? true : false,
      minimizer: [`...`, new CssMinimizerPlugin()]
    }
  }

  config.plugins.map(plugin => {
    if ('MiniCssExtractPlugin' == plugin.constructor.name) {
      plugin.options = {
        filename: `[name].${version}.css`
      }
    }
  })

  if (!server) {
    if (mode === 'development') {
      config.entry['vendor'] = ['react', 'react-dom']
    } else if (mode === 'production') {
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
              // console.log('test_module', module.identifier(), module.size())
              return module.size() > 160000
            },
            name(module) {
              // 名字就是包当中的名字
              console.log('name_module', module.identifier(), module.size())
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
  }

  return config
}
