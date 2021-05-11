import { GITHUB_ZEITNEXT_GET } from '../store/constants'

export const homeReducer = (state = { data: {} }, action:any)=>{
    const { type, data } = action
    let newState = null

    switch(type){
        case GITHUB_ZEITNEXT_GET:
            // console.log('state', type, state)
            newState = Object.assign({}, state)

            if(data)
                newState.data = data

            console.log('newState', newState)
            return newState
        default:
            return state
    }
}