import { doGet } from '../utils/fetch'
import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '../store/constants'


const getPhotoWH = (dispatch: any, callback: any, dic = '') => {
  let action = 'getPhotoWH'
  if (dic) {
    action += `?dic=${dic}`
  }

  doGet(action)
      .then((res:any) => {
        // console.log('getPhotoWH_res', res)
        dispatch({
          type: GET_PHOTO_WIDTH_HEIGHT,
          data: res?.data
        })
        callback && callback()
      })
      .catch((e:any) => {
        console.log('getPhotoWH_e', e)
        callback && callback()
      })
}

const getPhotoMenu = (dispatch:any, callback:any) => {
  doGet('getPhotoMenu')
      .then((res:any) => {
        // console.log('getPhotoMenu_res', res)
        const { data } = res
        dispatch({
          type: GET_PHOTO_MENU,
          menu: data
        })

        callback && callback(data)
      })
      .catch((e:any) => {
        console.log('getPhotoMenu_e', e)
        callback && callback()
      })
}

const getData = (callback:any, dic:any) => {
  return (dispatch: any) => {

    if (dic) {
      getPhotoMenu(dispatch, () => {
        getPhotoWH(dispatch, callback, dic)
      })
    } else {
      getPhotoMenu(dispatch, (data:any) => {
        if (data && data.length > 0) {
          getPhotoWH(dispatch, callback, data[0])
        }
      })
    }
  }
}

export const loadData = (resolve: any = null, dic='') => {
  return getData(resolve, dic)
}