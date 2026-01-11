import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { thunk } from 'redux-thunk'
import reducers from '../reducers'

const combineReducer = combineReducers({ ...reducers })

const getStore = (stateParam = {}) => {
  // console.log('getStore_stateParam', stateParam)

  return createStore(
    (state: any, action: any) => combineReducer(state || stateParam, action),
    composeWithDevTools(applyMiddleware(thunk))
  )
}

export default getStore
