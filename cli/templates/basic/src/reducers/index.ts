import { homeReducer } from './home'
import { photoReducer } from './photo'
import { REQUEST_QUERY } from '@store/constants'

interface QueryAction {
  type: string
  query?: Record<string, unknown>
}

const queryReducer = (state = {}, action: QueryAction) => {
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
