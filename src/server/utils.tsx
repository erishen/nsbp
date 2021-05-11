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
      const serverState = store.getState()
      console.log('server_state: ', serverState)

      const helmet: any = Helmet.renderStatic()

      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={path} context={{}}>
            <div>
              {routers.map((router) => (
                <Route {...router} />
              ))}
            </div>
          </StaticRouter>
        </Provider>
      )

      // console.log('content', content)

      const nodeEnv = process.env.NODE_ENV

      let cssArr = []
      let scriptBundleArr = []

      if (nodeEnv === 'development') {
        scriptBundleArr.push(
          '<script src="/js/vendor.bundle.js" type="text/javascript"></script>'
        )
      } else if (nodeEnv === 'production') {
        scriptBundleArr.push(
          '<script src="/js/framework.bundle.js" type="text/javascript"></script>'
        )
        scriptBundleArr.push(
          '<script src="/js/runtime.bundle.js" type="text/javascript"></script>'
        )
        cssArr.push('<link href="/client.css" rel="stylesheet">')
      }

      const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    ${helmet?.title?.toString()}
                    ${helmet?.meta?.toString()}
                    ${cssArr.join('\n')}
                </head>
                <body>
                    <div id="root">${content}</div>
                    ${scriptBundleArr.join('\n')}
                    <script src="/js/client.bundle.js" type="text/javascript"></script>
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
            minifyCSS: true,
            minifyJS: true
          })
        )
      }
    })
    .catch((e) => {
      console.log('promises_exception', e)
    })
}
