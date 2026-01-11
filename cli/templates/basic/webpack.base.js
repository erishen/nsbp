const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const createStyledComponentsTransformer =
  require('typescript-plugin-styled-components').default
const TerserPlugin = require('terser-webpack-plugin')
const { version } = require('./package.json')
const LoadablePlugin = require('@loadable/webpack-plugin')
const { loadableTransformer } = require('loadable-ts-transformer')
const { createLoadableComponentsTransformer } = require('typescript-loadable-components-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const sass = require('sass')

const styledComponentsTransformer = createStyledComponentsTransformer()

module.exports = ({ mode, entry, server, init }) => {
  const config = {
    mode,
    entry,
    devtool: 'source-map',
    stats: {
      colors: true,
      modules: false,
      chunks: false,
      warningsFilter: warning => {
        return !(
          warning.includes('DeprecationWarning') ||
          warning.includes('createParameterDeclaration') ||
          warning.includes('createMethodDeclaration') ||
          warning.includes('Decorators have been combined with modifiers') ||
          warning.includes('The legacy JS API is deprecated')
        )
      }
    },
    ignoreWarnings: [
      /DeprecationWarning/,
      /createParameterDeclaration/,
      /createMethodDeclaration/,
      /Decorators have been combined with modifiers/
    ],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
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
                  ['@babel/plugin-proposal-class-properties'],
                  ['@babel/plugin-proposal-optional-chaining'],
                  ["@babel/plugin-syntax-dynamic-import"],
                  ['babel-plugin-styled-components'],
                  ["@loadable/babel-plugin"]
                ]
              }
            },
            {
              loader: 'ts-loader',
              options: {
                logInfoToStdOut: false,
                logLevel: 'error',
                transpileOnly: true,
                silent: true,
                configFile: path.resolve(__dirname, './tsconfig.json'),
                compilerOptions: {
                  preserveConstEnums: true
                },
                getCustomTransformers: (program) => {
                  // console.log('getCustomTransformers', program)

                  return {
                    before: [
                      //createLoadableComponentsTransformer(program, {}),
                      styledComponentsTransformer,
                      createLoadableComponentsTransformer(program, {
                        setComponentId: true,
                        setDisplayName: true,
                        minify: true,
                      }),
                      //loadableTransformer
                    ]
                  }
                }
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                }
              }
            },
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
                importLoaders: 1,
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
                api: 'modern-compiler'
              }
            }
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
                importLoaders: 1,
              }
            },
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
    plugins: [
      new LoadablePlugin({
        writeToDisk: true
      })
    ],
    optimization: {
      minimize: mode === 'production' || server ? true : false,
      minimizer: [`...`, new CssMinimizerPlugin()]
    }
  }

  if(init){
    config.cache = false
  } else if(mode === 'development'){
    config.cache = {
      type: 'memory',
      // cacheUnaffected: true,
    }
  } else {
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    }
  }

  // Browsersync disabled to avoid extra port
  // if(mode === 'development' && !server){
  //   config.plugins.push(
  //     new BrowserSyncPlugin(
  //       {
  //         host: 'localhost',
  //         port: 3000,
  //         proxy: 'http://localhost:3001/'
  //       }
  //     )
  //   )
  // }

  if(mode === 'production' || server){
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
      config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_debugger: true,
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
              return (
                /[\\/]node_modules[\\/](.*)/.exec(module.identifier()) &&
                /[\\/]node_modules[\\/](.*)/.exec(module.identifier()).length &&
                /[\\/]node_modules[\\/](.*)/.exec(module.identifier())[1].replace(/\/|\\/g, '_')
              )
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
