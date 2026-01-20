import React, { useMemo } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routers from '@/Routers'
import { Provider } from 'react-redux'
import getStore from '@/store'
import { isSEO } from '@/utils'
import Theme from '@components/Theme'
import { loadableReady } from '@loadable/component'

const App = () => {
  // 使用 useMemo 确保 store 只创建一次，避免每次渲染都创建新 store
  const store = useMemo(() => {
    if (isSEO() && window?.context?.state) {
      return getStore(window.context.state)
    }
    return getStore()
  }, []) // 空依赖数组，只执行一次

  return (
    <Theme>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {routers.map((router) => (
              <Route
                key={router.key}
                path={router.path}
                element={router.element}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </Provider>
    </Theme>
  )
}

loadableReady(() => {
  hydrateRoot(document.getElementById('root')!, <App />)
})
