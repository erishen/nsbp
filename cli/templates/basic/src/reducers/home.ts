import { GITHUB_ZEITNEXT_GET } from '@store/constants'

export const homeReducer = (state = { data: {} }, action: any) => {
  const { type, data } = action

  switch (type) {
    case GITHUB_ZEITNEXT_GET:
      return { ...state, data: data !== undefined ? data : state.data }
    default:
      return state
  }
}
