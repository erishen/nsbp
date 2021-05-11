const path = require('path') //node的path模块
const { merge } = require('webpack-merge')
const config = require('./webpack.base.js')

const server = false

const entry = {
  client: ['./src/client/index.tsx']
}

const clientConfig = {
  output: {
    //打包出口
    path: path.resolve(__dirname, 'public'),
    filename: ({ chunk }) => {
      const { name } = chunk
      console.log('name', name)
      return `js/[name].bundle.js`
    },
    clean: true
  }
}

module.exports = (_, { mode }) => {
  return merge(config({ mode, entry, server }), clientConfig)
}
