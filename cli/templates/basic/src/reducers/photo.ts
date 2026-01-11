import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '../store/constants'

export const photoReducer = (state = { data: [[0, 0]], menu: {} }, action: any) => {
  const { type, data, menu } = action
  let newState = null

  switch (type) {
    case GET_PHOTO_MENU:
      newState = Object.assign({}, state)

      if (menu) newState.menu = menu

      return newState
    case GET_PHOTO_WIDTH_HEIGHT:
      newState = Object.assign({}, state)

      if (data) newState.data = data

      return newState
    default:
      return state
  }
}
