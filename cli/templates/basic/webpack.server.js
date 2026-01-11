const path = require('path') //node的path模块
const nodeExternals = require('webpack-node-externals')
const { merge } = require('webpack-merge')
const config = require('./webpack.base.js')
const { version } = require('./package.json')

const init = process.env.INIT || 0
const server = true

console.log('init', init)

const entry = {
  server: ['./src/server/index.ts']
}

const serverConfig = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    //打包出口
    filename: `bundle.${version}.js`, //打包后的文件名
    path: path.resolve(__dirname, 'build'), //存放到根目录的build文件夹
    clean: true,
    libraryTarget: 'commonjs2',
    chunkFilename: `chunk-[name].${version}.js`
  },
  optimization: {
    splitChunks: false, // 禁用 server 端 chunk 分割，避免加载问题
    runtimeChunk: false
  },
  externals: [
    '@loadable/component',
    nodeExternals()
  ] //保持node中require的引用方式
}

module.exports = (_, { mode }) => {
  return merge(config({ mode, entry, server, init }), serverConfig)
}
