import { GET_PHOTO_WIDTH_HEIGHT } from '../store/constants'

export const photoReducer = (state = { data: [[0, 0]] }, action: any) => {
  const { type, data } = action
  let newState = null

  switch (type) {
    case GET_PHOTO_WIDTH_HEIGHT:
      // console.log('state', type, state)
      newState = Object.assign({}, state)

      if (data) newState.data = data

      console.log('newState', newState)
      return newState
    default:
      return state
  }
}
