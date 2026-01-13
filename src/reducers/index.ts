import { homeReducer } from './home'
import { photoReducer } from './photo'
import { REQUEST_QUERY } from '../store/constants'

const queryReducer = (state = {}, action: any) => {
  const { type, query } = action

  switch (type) {
    case REQUEST_QUERY:
      return { ...query }
    default:
      return state
  }
}

export default {
  name: (state = 'Erishen Sun') => state,
  query: queryReducer,
  home: homeReducer,
  photo: photoReducer
}
