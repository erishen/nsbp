const path = require('path')    //node的path模块
const nodeExternals = require('webpack-node-externals')
const { merge } = require('webpack-merge')
const config = require('./webpack.base.js')

const server = true

const entry = {
    server: ['./src/server/index.ts']
}

const serverConfig = {
    target: 'node',
    output: {                      //打包出口
        filename: 'bundle.js',     //打包后的文件名
        path: path.resolve(__dirname, 'build'),    //存放到根目录的build文件夹
        clean: true
    },
    externals: [nodeExternals()]  //保持node中require的引用方式
}

module.exports = (_, { mode }) => { 
    return merge(config({ mode, entry, server }), serverConfig)
}