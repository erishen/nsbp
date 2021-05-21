import express from 'express'
import { render } from './utils'

const app = express()
app.use(express.static('public'))
//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹

app.get('*', (req, res) => {
  console.log('req.url', req.url, req.headers)
  render(req, res)
})

app.listen(3001, () => console.log('NSBP listening on port 3001!'))
