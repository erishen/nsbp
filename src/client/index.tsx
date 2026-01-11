import React, { useEffect, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'
import routers from '../Routers'
import { Provider } from 'react-redux'
import getStore from '../store'
import { isSEO } from '../utils'
import Theme from '../component/Theme'
import { loadableReady } from '@loadable/component'

const App = () => {
  const [store, setStore] = useState(getStore())
  console.log('client_state: ', store.getState())

  useEffect(() => {
    if (isSEO()) {
      setStore(getStore(window?.context?.state))
    }
  }, [])

  return (
    <Theme>
      <Provider store={store}>
        <BrowserRouter>
          <div>
            {routers.map((router) => (
              <Route {...router} />
            ))}
          </div>
        </BrowserRouter>
      </Provider>
    </Theme>
  )
}

loadableReady(() => {
  const root = hydrateRoot(document.getElementById('root')!, <App />)
})
