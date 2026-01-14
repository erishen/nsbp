import { doGet } from '@utils/fetch'
import { GET_PHOTO_MENU } from '@store/constants'

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