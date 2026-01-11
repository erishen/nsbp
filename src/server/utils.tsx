import React from 'react' //引入React以支持JSX的语法
import { renderToString } from 'react-dom/server' //引入renderToString方法
import { StaticRouter, Route, matchPath } from 'react-router-dom'
import routers from '../Routers'
import { Provider } from 'react-redux'
import getStore from '../store'
import serialize from 'serialize-javascript'
import { REQUEST_QUERY } from '../store/constants'
import { Helmet } from 'react-helmet'
import { ServerStyleSheet } from 'styled-components'
import Theme from '../component/Theme'
import path from 'path'
import { ChunkExtractor } from '@loadable/server'

const removeCommentsAndSpacing = (str = '') =>
  str.replace(/\/\*.*\*\//g, ' ').replace(/\s+/g, ' ')

const removeSpacing = (str = '') => str.replace(/\s+/g, ' ')

export const render = (req: any, res: any) => {
  const store = getStore()
  const { path:reqPath, query, url } = req
  const matchRoutes: any = []
  const promises = []

  console.log('path_query_url', reqPath, query, url)
  let { seo } = query

  if (seo !== undefined && seo !== '') {
    seo = parseInt(seo, 10)
  }

  routers.some((route) => {
    matchPath(reqPath, route) ? matchRoutes.push(route) : ''
  })

  // console.log('matchRoutes', matchRoutes)

  matchRoutes.forEach((item: any) => {
    if (item?.loadData && seo) {
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

  // console.log('promises', promises)

  Promise.all(promises)
    .then(() => {
      const nodeEnv = process.env.NODE_ENV
      const sheet = new ServerStyleSheet()
      const serverState = store.getState()
      console.log('server_state: ', serverState)

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
                <StaticRouter location={reqPath} context={{}}>
                  <div>
                    {routers.map((router) => (
                      <Route {...router} />
                    ))}
                  </div>
                </StaticRouter>
              </Provider>
            </Theme>
          )
        )

        const content = renderToString(jsx)
        const styleTags = sheet.getStyleTags()

        // console.log('content', content)
        // console.log('styleTags', styleTags)

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
      } catch (e) {
        console.log(e)
      } finally {
        sheet.seal()
      }
    })
    .catch((e) => {
      console.log('promises_exception', e)
    })
}
