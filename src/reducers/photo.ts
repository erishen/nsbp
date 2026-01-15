import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '@store/constants'

interface PhotoState {
  data: [number, number, string][]
  menu:
    | Record<string, any>
    | Array<{ name: string; cover?: string; count?: number }>
}

export const photoReducer = (
  state: PhotoState = { data: [[0, 0, '']], menu: {} },
  action: any
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
