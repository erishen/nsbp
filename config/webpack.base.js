const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { version } = require('../package.json')
const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = ({ mode, entry, server, init }) => {
  const config = {
    mode,
    entry,
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/component'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        '@services': path.resolve(__dirname, '../src/services'),
        '@styled': path.resolve(__dirname, '../src/styled'),
        '@store': path.resolve(__dirname, '../src/store'),
        '@reducers': path.resolve(__dirname, '../src/reducers'),
        '@containers': path.resolve(__dirname, '../src/containers'),
        '@server': path.resolve(__dirname, '../src/server'),
        '@client': path.resolve(__dirname, '../src/client'),
        '@css': path.resolve(__dirname, '../src/css'),
        '@externals': path.resolve(__dirname, '../src/externals')
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.less$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true
                }
              }
            }
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jp?g|webp|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new LoadablePlugin({
        writeToDisk: true
      })
    ],
    optimization: {
      minimize: mode === 'production' || server ? true : false,
      minimizer: [`...`, new CssMinimizerPlugin()]
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 500000,
      maxEntrypointSize: 500000
    }
  }

  if (init) {
    config.cache = false
  } else {
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.temp_cache')
      // type: 'memory',
      // cacheUnaffected: true,
    }
  }

  if (mode === 'development' && !server) {
    config.plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:3001/'
      })
    )
  }

  if (mode === 'production' || server) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: `css/[name].${version}.css`
      })
    )
  }

  if (!server) {
    if (mode === 'development') {
      config.entry['vendor'] = ['react', 'react-dom']
    } else if (mode === 'production') {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
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
            name(module) {
              //名字就是包当中的名字
              const match = /[\\/]node_modules[\\/](.*)/.exec(
                module.identifier()
              )
              if (match && match.length) {
                // 移除开头的点号，避免生成隐藏文件
                return match[1].replace(/\/|\\/g, '_').replace(/^\./, '')
              }
              return false
            },
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
