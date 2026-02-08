import { GITHUB_ZEITNEXT_GET } from '@store/constants'

interface HomeAction {
  type: string
  data?: unknown
}

export const homeReducer = (state = { data: {} }, action: HomeAction) => {
  const { type, data } = action

  switch (type) {
    case GITHUB_ZEITNEXT_GET:
      return { ...state, data: data !== undefined ? data : state.data }
    default:
      return state
  }
}
