import express from 'express'
import { render } from './utils'
import { getPhotoWH, getPhotoMenu } from './photo'
import { useCurrentFlag, outPhotoDicPath } from '../utils/config'

const app = express()

app.use(express.static('public', { dotfiles: 'allow' }))
!useCurrentFlag && app.use(express.static(outPhotoDicPath, { dotfiles: 'allow' }))

//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹

app.get('/getPhotoWH', (req, res) => {
  getPhotoWH(req, res)
})

app.get('/getPhotoMenu', (req, res) => {
  getPhotoMenu(req, res)
})

// Catch-all middleware for SSR
app.use((req, res) => {
  // console.log('req.url', req.url, req.headers)
  render(req, res)
})

app.listen(3001, () => {
  // Server started successfully
})
