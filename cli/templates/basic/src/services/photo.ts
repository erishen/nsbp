import { doGet } from '@utils/fetch'
import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '@store/constants'

const getPhotoWH = (dispatch: any, callback: any, dic = '') => {
  let action = 'getPhotoWH'
  if (dic) {
    action += `?dic=${dic}`
  }

  doGet(action)
    .then((res: any) => {
      // console.log('getPhotoWH_res', res)
      // axios 响应格式是 { data: { data: [...] }, status: ... }，需要取 res.data.data
      dispatch({
        type: GET_PHOTO_WIDTH_HEIGHT,
        data: res?.data?.data || []
      })
      callback && callback()
    })
    .catch((_e: any) => {
      callback && callback()
    })
}

const getPhotoMenu = (dispatch: any, callback: any) => {
  doGet('getPhotoMenu')
    .then((res: any) => {
      // console.log('getPhotoMenu_res', res)
      // axios 响应格式是 { data: { data: [...] }, status: ... }，需要取 res.data.data
      const { data } = res?.data || {}
      dispatch({
        type: GET_PHOTO_MENU,
        menu: data
      })

      callback && callback(data)
    })
    .catch((_e: any) => {
      callback && callback()
    })
}

const getData = (callback: any, dic: any) => {
  return (dispatch: any) => {
    if (dic) {
      getPhotoMenu(dispatch, () => {
        getPhotoWH(dispatch, callback, dic)
      })
    } else {
      getPhotoMenu(dispatch, (data: any) => {
        if (data && data.length > 0) {
          // data[0] 是对象 {name, cover}，需要取 name
          getPhotoWH(dispatch, callback, data[0].name)
        }
      })
    }
  }
}

// 用于路由预取数据的 loadData 函数
export const loadData = (resolve: any = null, query: any = {}) => {
  // 从 URL 查询参数中获取 dic
  const { dic } = query
  return getData(resolve, dic || '')
}

// 用于容器内部调用的 loadData 函数（保持向后兼容）
export const loadDataForContainer = (resolve: any = null, dic = '') => {
  return getData(resolve, dic)
}
