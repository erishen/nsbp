import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '@store/constants'

interface PhotoState {
  data: [number, number, string][]
  menu:
    | Record<string, unknown>
    | Array<{ name: string; cover?: string; count?: number }>
}

interface PhotoAction {
  type: string
  data?: [number, number, string][]
  menu?: PhotoState['menu']
}

export const photoReducer = (
  state: PhotoState = { data: [], menu: {} },
  action: PhotoAction
) => {
  const { type, data, menu } = action

  switch (type) {
    case GET_PHOTO_MENU:
      return { ...state, menu: menu !== undefined ? menu : state.menu }
    case GET_PHOTO_WIDTH_HEIGHT:
      return { ...state, data: data !== undefined ? data : state.data }
    default:
      return state
  }
}
