import { doGet } from '../utils/fetch'
import { GITHUB_ZEITNEXT_GET } from '../store/constants'

const getData = (callback: any) => {
  console.log('getData')

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
  return getData(resolve)
}