import React, { useEffect, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routers from '@/Routers'
import { Provider } from 'react-redux'
import getStore from '@/store'
import { isSEO } from '@/utils'
import Theme from '@components/Theme'
import { loadableReady } from '@loadable/component'

const App = () => {
  const [store, setStore] = useState(getStore())

  useEffect(() => {
    if (isSEO()) {
      setStore(getStore(window?.context?.state))
    }
  }, [])

  return (
    <Theme>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {routers.map((router) => (
              <Route key={router.key} path={router.path} element={router.element} />
            ))}
          </Routes>
        </BrowserRouter>
      </Provider>
    </Theme>
  )
}

loadableReady(() => {
  const root = hydrateRoot(document.getElementById('root')!, <App />)
})
