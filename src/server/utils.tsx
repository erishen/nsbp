import React from 'react' //引入React以支持JSX的语法
import { renderToString } from 'react-dom/server' //引入renderToString方法
import { StaticRouter, Route, matchPath } from 'react-router-dom'
import routers from '../Routers'
import { Provider } from 'react-redux'
import getStore from '../store'
import serialize from 'serialize-javascript'
import { REQUEST_QUERY } from '../store/constants'
import { Helmet } from 'react-helmet'
import { minify } from 'html-minifier'
import { ServerStyleSheet } from 'styled-components'
import Theme from '../component/Theme'

const removeCommentsAndSpacing = (str = '') =>
  str.replace(/\/\*.*\*\//g, ' ').replace(/\s+/g, ' ')

const removeSpacing = (str = '') => str.replace(/\s+/g, ' ')

export const render = (req: any, res: any) => {
  const store = getStore()
  const { path, query } = req
  const matchRoutes: any = []
  const promises = []

  console.log('query', query)
  let { seo } = query

  if (seo !== undefined && seo !== '') {
    seo = parseInt(seo, 10)
  }

  routers.some((route) => {
    matchPath(path, route) ? matchRoutes.push(route) : ''
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
      const sheet = new ServerStyleSheet()
      const serverState = store.getState()
      console.log('server_state: ', serverState)

      const helmet: any = Helmet.renderStatic()

      try {
        const content = renderToString(
          sheet.collectStyles(
            <Theme>
              <Provider store={store}>
                <StaticRouter location={path} context={{}}>
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

        let styleTags = sheet.getStyleTags()

        // console.log('content', content)
        // console.log('styleTags', styleTags)

        const nodeEnv = process.env.NODE_ENV
        const { version } = require('../../package.json')

        let cssArr = []
        let scriptBundleArr = []

        if (nodeEnv === 'production') {
          scriptBundleArr.push(
            `<script src="/js/framework.${version}.bundle.js" type="text/javascript"></script>`
          )
          scriptBundleArr.push(
            `<script src="/js/runtime.${version}.bundle.js" type="text/javascript"></script>`
          )
          scriptBundleArr.push(
            `<script src="/js/lib.${version}.bundle.js" type="text/javascript"></script>`
          )
          cssArr.push(
            `<link href="/css/client.${version}.css" rel="stylesheet">`
          )
        }

        const html = `
              <!DOCTYPE html>
              <html>
                  <head>
                      <meta charset="utf-8">
                      ${helmet?.title?.toString()}
                      ${helmet?.meta?.toString()}
                      ${cssArr.join('\n')}
                      ${styleTags}
                  </head>
                  <body>
                      <div id="root">${content}</div>
                      ${scriptBundleArr.join('\n')}
                      <script src="/js/vendor.${version}.bundle.js" type="text/javascript"></script>
                      <script src="/js/client.${version}.bundle.js" type="text/javascript"></script>
                      <script type="text/javascript">
                          window.context = { state: ${serialize(serverState)} }
                          window.query = ${serialize(query)}
                      </script>
                  </body>
              </html>
          `

        if (nodeEnv === 'development') {
          res.send(html)
        } else if (nodeEnv === 'production') {
          res.send(
            minify(html, {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              minifyCSS: false, // 因为 styled-components 不能使用 minifyCSS
              minifyJS: true
            })
          )
        }
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
