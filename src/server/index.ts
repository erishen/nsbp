import path from 'path'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { render } from '@server/utils'
import { getPhotoWH, getPhotoMenu } from '@server/photo'
import { useCurrentFlag, outPhotoDicPath } from '@utils/config'

const app = express()

// 0. Trust proxy - Important for HTTPS reverse proxy (nginx)
app.set('trust proxy', true)

// 1. Security headers (helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false, // Allow inline scripts for SSR
    crossOriginOpenerPolicy: false // Allow window.open for development
  })
)

// 2. Hide X-Powered-By header
app.disable('x-powered-by')

// 3. Rate limiting (optional, controlled by environment variable)
if (process.env.ENABLE_RATE_LIMIT === '1') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
  })
  app.use('/api', limiter)
}

// 4. Static file serving (disable dotfiles access)
app.use(
  express.static('public', {
    dotfiles: 'ignore',
    setHeaders: (res, filePath) => {
      // 开发环境使用较短的缓存时间，避免代码更新后浏览器使用旧缓存
      // 生产环境只有文件名带 contenthash 的资源才能长缓存，其余必须回源校验
      const isDev = process.env.NODE_ENV !== 'production'
      const isHashed = /\.[0-9a-f]{8}\.(bundle|chunk)\.(js|css)$/.test(filePath)

      if (
        filePath.match(
          /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/
        )
      ) {
        if (isDev) {
          // 开发环境：缓存 1 小时，便于开发调试
          res.setHeader('Cache-Control', 'public, max-age=3600')
        } else if (isHashed) {
          // 生产环境：带 contenthash 的资源可以永久缓存
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        } else {
          // 无指纹的资源（图片、旧命名产物）每次都要校验，避免拿到过期内容
          res.setHeader('Cache-Control', 'no-cache')
        }
      }
    }
  })
)
!useCurrentFlag &&
  app.use(express.static(outPhotoDicPath, { dotfiles: 'ignore' }))

// 5. Body parsing with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹

app.get('/getPhotoWH', (req, res) => {
  getPhotoWH(req, res)
})

app.get('/getPhotoMenu', (req, res) => {
  getPhotoMenu(req, res)
})

// Catch-all middleware for SSR
app.use((req, res) => {
  // 带扩展名的路径是静态资源请求，未命中就该 404。
  // 否则会返回 200 + HTML，浏览器把 HTML 当 JS 执行，问题被完全掩盖
  if (path.extname(req.path)) {
    res.status(404).type('text/plain').send('Not Found')
    return
  }

  // SSR 页面不能被缓存：缓存住的 HTML 会引用已经不存在的 chunk
  res.set('Cache-Control', 'no-store')
  render(req, res)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  if (process.env.ENABLE_RATE_LIMIT === '1') {
    // Rate limiting active
  }
})
