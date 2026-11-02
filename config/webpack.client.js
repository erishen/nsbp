const path = require('path') //node的path模块
const { merge } = require('webpack-merge')
const config = require('./webpack.base.js')
const { version } = require('../package.json')

const server = false

const entry = {
  client: ['./src/client/index.tsx']
}

const clientConfig = {
  output: {
    //打包出口
    path: path.resolve(__dirname, '../public'),
    // 必须带 contenthash：文件名不含内容指纹时，浏览器会一直用旧 bundle 去配对新的 chunk
    // 表（懒加载 chunk 的数字 id 每次构建都可能变），导致 loadable 同步加载失败、React #130
    filename: `js/[name].${version}.[contenthash:8].bundle.js`,
    chunkFilename: `js/[id].${version}.[contenthash:8].chunk.js`,
    // 显式固定，避免 auto 取到脚本所在目录后与 SSR 注入的 publicPath 不一致
    publicPath: '/'
  }
}

module.exports = (_, { mode }) => {
  return merge(config({ mode, entry, server }), clientConfig)
}
