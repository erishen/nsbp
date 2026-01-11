import { configureStore, combineReducers } from '@reduxjs/toolkit'
import reducers from '../reducers'

const combineReducer = combineReducers({ ...reducers })

const getStore = (stateParam = {}) => {
  return configureStore({
    reducer: (state: any, action: any) => combineReducer(state || stateParam, action),
    preloadedState: stateParam || {},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  })
}

export default getStore
