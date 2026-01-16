import { configureStore, combineReducers } from '@reduxjs/toolkit'
import reducers from '@reducers'

const combineReducer = combineReducers({ ...reducers })

const getStore = (stateParam = {}) => {
  return configureStore({
    reducer: combineReducer,
    preloadedState: stateParam || {},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  })
}

export default getStore
