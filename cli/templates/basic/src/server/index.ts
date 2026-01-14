import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { render } from './utils'
import { getPhotoWH, getPhotoMenu } from './photo'
import { useCurrentFlag, outPhotoDicPath } from '../utils/config'

const app = express()

// 1. Security headers (helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow inline scripts for SSR
  crossOriginOpenerPolicy: false, // Allow window.open for development
}))

// 2. Hide X-Powered-By header
app.disable('x-powered-by')

// 3. Rate limiting (optional, controlled by environment variable)
if (process.env.ENABLE_RATE_LIMIT === '1') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
  app.use('/api', limiter)
  console.log('🛡️ Rate limiting enabled for /api routes')
}

// 4. Static file serving (disable dotfiles access)
app.use(express.static('public', { 
  dotfiles: 'ignore',
  setHeaders: (res, filePath) => {
    // Cache static assets for 1 year
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
  }
}))
!useCurrentFlag && app.use(express.static(outPhotoDicPath, { dotfiles: 'ignore' }))

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
  // console.log('req.url', req.url, req.headers)
  render(req, res)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  console.log(`🔒 Security headers enabled`)
  if (process.env.ENABLE_RATE_LIMIT === '1') {
    console.log(`🚦 Rate limiting active`)
  }
})
