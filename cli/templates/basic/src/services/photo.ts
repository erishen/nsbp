import { doGet } from '@utils/fetch'
import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '@store/constants'

type DispatchFunction = (action: {
  type: string
  data?: unknown
  menu?: unknown
}) => void

type CallbackFunction = (data?: unknown) => void

const getPhotoWH = (
  dispatch: DispatchFunction,
  callback: CallbackFunction,
  dic = ''
) => {
  let action = 'getPhotoWH'
  if (dic) {
    action += `?dic=${dic}`
  }

  doGet(action)
    .then((res: { data?: { data?: unknown } }) => {
      // console.log('getPhotoWH_res', res)
      // axios 响应格式是 { data: { data: [...] }, status: ... }，需要取 res.data.data
      dispatch({
        type: GET_PHOTO_WIDTH_HEIGHT,
        data: res?.data?.data || []
      })
      callback && callback()
    })
    .catch(() => {
      callback && callback()
    })
}

const getPhotoMenu = (
  dispatch: DispatchFunction,
  callback: CallbackFunction
) => {
  doGet('getPhotoMenu')
    .then((res: { data?: { data?: unknown } }) => {
      // console.log('getPhotoMenu_res', res)
      // axios 响应格式是 { data: { data: [...] }, status: ... }，需要取 res.data.data
      const { data } = res?.data || {}
      dispatch({
        type: GET_PHOTO_MENU,
        menu: data
      })

      callback && callback(data)
    })
    .catch(() => {
      callback && callback()
    })
}

interface MenuItem {
  name: string
  cover?: string
}

const getData = (callback: CallbackFunction, dic: string) => {
  return (dispatch: DispatchFunction) => {
    if (dic) {
      getPhotoMenu(dispatch, () => {
        getPhotoWH(dispatch, callback, dic)
      })
    } else {
      getPhotoMenu(dispatch, (data) => {
        const menuData = data as MenuItem[] | undefined
        if (menuData && menuData.length > 0) {
          // data[0] 是对象 {name, cover}，需要取 name
          getPhotoWH(dispatch, callback, menuData[0].name)
        }
      })
    }
  }
}

// 用于路由预取数据的 loadData 函数
export const loadData = (
  resolve: CallbackFunction | null = null,
  query: { dic?: string } = {}
) => {
  // 从 URL 查询参数中获取 dic
  const { dic } = query
  return getData(resolve, dic || '')
}

// 用于容器内部调用的 loadData 函数（保持向后兼容）
export const loadDataForContainer = (
  resolve: CallbackFunction | null = null,
  dic = ''
) => {
  return getData(resolve, dic)
}
