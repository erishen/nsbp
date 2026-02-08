import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, Route, matchPath } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import routers from '@/Routers'
import { Provider } from 'react-redux'
import getStore from '@store'
import serialize from 'serialize-javascript'
import { REQUEST_QUERY } from '@store/constants'
import { Helmet } from 'react-helmet'
import { ServerStyleSheet } from 'styled-components'
import Theme from '@components/Theme'
import path from 'path'
import { ChunkExtractor } from '@loadable/server'

interface Request {
  path: string
  query: Record<string, string | undefined>
}

interface Response {
  send: (html: string) => void
  status: (code: number) => { send: (msg: string) => void }
}

export const render = (req: Request, res: Response) => {
  const store = getStore()
  const { path: reqPath, query } = req
  const matchRoutes: {
    loadData?: (
      resolve: (data?: unknown) => void,
      query: Request['query']
    ) => unknown
  }[] = []
  const promises = []

  let { nsbp } = query

  if (nsbp !== undefined && nsbp !== '') {
    nsbp = parseInt(nsbp, 10)
  }

  routers.some((route) => {
    matchPath(reqPath, route.path) ? matchRoutes.push(route) : ''
  })

  matchRoutes.forEach((item) => {
    if (item?.loadData) {
      const promise = new Promise((resolve, reject) => {
        try {
          // 将 query 参数传递给 loadData，确保能正确预取数据
          store.dispatch(item?.loadData(resolve, query))
        } catch {
          reject()
        }
      })

      promises.push(promise)
    }
  })

  const queryDispatch = (callback: (() => void) | null) => {
    return (
      dispatch: (action: { type: string; query: Request['query'] }) => void
    ) => {
      // 直接同步执行，避免 setTimeout 导致的竞态条件
      dispatch({ type: REQUEST_QUERY, query })
      callback && callback()
    }
  }

  const queryPromise = new Promise((resolve, reject) => {
    try {
      store.dispatch(queryDispatch(() => resolve()))
    } catch {
      reject()
    }
  })

  promises.push(queryPromise)

  Promise.all(promises)
    .then(() => {
      const nodeEnv = process.env.NODE_ENV
      const sheet = new ServerStyleSheet()
      const serverState = store.getState()

      const helmet = Helmet.renderStatic()

      const webStats = path.resolve(__dirname, '../public/loadable-stats.json')

      try {
        let webEntryPoints = ['client', 'vendor']

        if (nodeEnv === 'production') {
          webEntryPoints = ['client']
        }

        const webExtractor = new ChunkExtractor({
          statsFile: webStats,
          entrypoints: webEntryPoints,
          publicPath: '/'
        })

        const jsx = webExtractor.collectChunks(
          sheet.collectStyles(
            <Theme>
              <Provider store={store}>
                <StaticRouter location={reqPath}>
                  <Routes>
                    {routers.map((router) => (
                      <Route
                        key={router.key}
                        path={router.path}
                        element={router.element}
                      />
                    ))}
                  </Routes>
                </StaticRouter>
              </Provider>
            </Theme>
          )
        )

        const content = renderToString(jsx)
        const styleTags = sheet.getStyleTags()

        const html = `
              <!DOCTYPE html>
              <html>
                  <head>
                      <meta charset="utf-8">
                      <link rel="icon" type="image/x-icon" href="/favicon.ico">
                      <link rel="icon" type="image/svg+xml" href="/favicon.svg">
                      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
                      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
                      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
                      <link rel="manifest" href="/site.webmanifest">
                      <meta name="theme-color" content="#2563eb">
                      ${helmet?.title?.toString()}
                      ${helmet?.meta?.toString()}
                      ${styleTags}
                      ${webExtractor.getLinkTags()}
                      ${webExtractor.getStyleTags()}
                  </head>
                  <body>
                      <div id="root">${content}</div>
                      <script type="text/javascript">
                          window.context = { state: ${serialize(serverState)} }
                          window.query = ${serialize(query)}
                      </script>
                      ${webExtractor.getScriptTags()}
                  </body>
              </html>
          `

        res.send(html)
      } catch (e: Error) {
        console.error('SSR rendering error:', e.message)
        sheet.seal()
        res.status(500).send('Internal Server Error')
      }
    })
    .catch((e: Error) => {
      console.error('Data loading error:', e.message)
      res.status(500).send('Data loading failed')
    })
}
