import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, Route, matchPath } from 'react-router-dom'
// @ts-ignore - Routes is available in react-router-dom v7 but not in types
import { Routes } from 'react-router-dom'
import routers from '../Routers'
// @ts-ignore
import { Provider } from 'react-redux'
// @ts-ignore
import getStore from '../store'
import serialize from 'serialize-javascript'
// @ts-ignore
import { REQUEST_QUERY } from '../store/constants'
import { Helmet } from 'react-helmet'
import { ServerStyleSheet } from 'styled-components'
import Theme from '../component/Theme'
import path from 'path'
import { ChunkExtractor } from '@loadable/server'

export const render = (req: any, res: any) => {
  const store = getStore()
  const { path:reqPath, query } = req
  const matchRoutes: any = []
  const promises = []

  let { seo } = query

  if (seo !== undefined && seo !== '') {
    seo = parseInt(seo, 10)
  }

  routers.some((route) => {
    matchPath(reqPath, route.path) ? matchRoutes.push(route) : ''
  })

  matchRoutes.forEach((item: any) => {
    if (item?.loadData) {
      const promise = new Promise((resolve, reject) => {
        try {
          store.dispatch(item?.loadData(resolve))
        } catch (e) {
          reject()
        }
      })

      promises.push(promise)
    }
  })

  const queryDispatch = (callback: any) => {
    return (dispatch: any) => {
      setTimeout(() => {
        dispatch({ type: REQUEST_QUERY, query })

        callback && callback()
      }, 0)
    }
  }

  const queryPromise = new Promise((resolve, reject) => {
    try {
      store.dispatch(queryDispatch(resolve))
    } catch (e) {
      reject()
    }
  })

  promises.push(queryPromise)

  Promise.all(promises)
    .then(() => {
      const nodeEnv = process.env.NODE_ENV
      const sheet = new ServerStyleSheet()
      const serverState = store.getState()

      const helmet: any = Helmet.renderStatic()

      const webStats = path.resolve(
        __dirname,
        '../public/loadable-stats.json',
      )

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

        const jsx = webExtractor.collectChunks(sheet.collectStyles(
            <Theme>
              <Provider store={store}>
                <StaticRouter location={reqPath}>
                  <Routes>
                    {routers.map((router) => (
                      <Route key={router.key} path={router.path} element={router.element} />
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
      } catch (e: any) {
        console.error('SSR rendering error:', e)
        sheet.seal()
        res.status(500).send('Internal Server Error')
      }
    })
    .catch((e: any) => {
      console.error('Data loading error:', e)
      res.status(500).send('Data loading failed')
    })
}
