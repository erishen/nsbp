import { GITHUB_ZEITNEXT_GET } from '../store/constants'

export const homeReducer = (state = { data: {} }, action: any) => {
  const { type, data } = action
  let newState = null

  switch (type) {
    case GITHUB_ZEITNEXT_GET:
      newState = Object.assign({}, state)

      if (data) newState.data = data

      return newState
    default:
      return state
  }
}
