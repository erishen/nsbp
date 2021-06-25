const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const createStyledComponentsTransformer =
  require('typescript-plugin-styled-components').default
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
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
              loader: 'babel-loader',
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
                  ["@babel/plugin-syntax-dynamic-import"],
                  ['babel-plugin-styled-components']
                ]
              }
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, './tsconfig.json'),
                getCustomTransformers: () => ({
                  before: [styledComponentsTransformer]
                })
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
          use: ['file-loader', 'webp-loader?{quality: 100}']
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader']
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin()],
    optimization: {
      minimize: mode === 'production' || server ? true : false,
      minimizer: [`...`, new CssMinimizerPlugin()]
    }
  }

  config.plugins.map((plugin) => {
    if ('MiniCssExtractPlugin' == plugin.constructor.name) {
      plugin.options = {
        filename: `css/[name].${version}.css`
      }
    }
  })

  if (!server) {
    if (mode === 'development') {
      config.entry['vendor'] = ['react', 'react-dom']
    } else if (mode === 'production') {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              //drop_console: true,
              pure_funcs: ['console.log']
            }
          }
        })
      )

      config.optimization['splitChunks'] = {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        name: false,
        cacheGroups: {
          framework: {
            // 将react和react-dom打入framework当中
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, //匹配库当中的react和react-dom
            priority: 40, //权重为40 最大权重
            reuseExistingChunk: true
          },
          lib: {
            test: (module) => {
              // 匹配包大于160000的
              if (module.size() > 20000) {
                console.log('test_module', module.identifier(), module.size())
              }
              return module.size() > 20000
            },
            name: 'lib',
            minChunks: 1, //最小共用次数为1时就使用
            priority: 30, //权重为30
            reuseExistingChunk: true
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            reuseExistingChunk: true
          },
          default: {
            name: 'default',
            minChunks: 2,
            priority: 10,
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
