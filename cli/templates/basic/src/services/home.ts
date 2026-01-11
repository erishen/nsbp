import { doGet } from '../utils/fetch'
import { GITHUB_ZEITNEXT_GET, GET_PHOTO_MENU } from '../store/constants'

const getData = (callback: any) => {

  return (dispatch: any) => {
    doGet('https://api.apiopen.top/getJoke?page=1&count=2&type=video')
      .then((res:any) => {
        // console.log('res', res)
        dispatch({
          type: GITHUB_ZEITNEXT_GET,
          data: res?.data
        })

        callback && callback()
      })
      .catch((e:any) => {
        // console.log('e', e.response)
        dispatch({
          type: GITHUB_ZEITNEXT_GET,
          data: e?.response?.data
        })

        callback && callback()
      })
  }
}

export const loadData = (resolve: any = null) => {
  return (dispatch: any) => {
    // 预取图片菜单数据
    doGet('/getPhotoMenu')
      .then((res: any) => {
        // axios 响应结构: { data, status, statusText, headers, config, request }
        if (res.status >= 200 && res.status < 300) {
          // 请求成功，data 已经是解析后的 JSON 对象
          dispatch({
            type: GET_PHOTO_MENU,
            menu: res.data?.data || []
          })
          resolve && resolve(res.data)
        } else {
          throw new Error(`Status ${res.status}`)
        }
      })
      .catch((err: any) => {
        console.error('Failed to preload photos:', err)
        // 预取失败但不影响主流程
        resolve && resolve()
      })
  }
}