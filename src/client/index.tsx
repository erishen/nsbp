import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import routers from'../Routers'
import { Provider } from 'react-redux'
import getStore from '../store'
import { isSEO } from '../utils'

const App = () => {
    const [store, setStore] = useState(getStore())
    console.log('client_state: ', store.getState())

    useEffect(() => {
        if(isSEO()){
            setStore(getStore(window?.context?.state))
        }
    }, [])

    return (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    {routers.map(router => (
                        <Route {...router}/>
                    ))}
               </div>
            </BrowserRouter>
        </Provider>
    )
}

ReactDom.hydrate(<App/>, document.getElementById('root'))