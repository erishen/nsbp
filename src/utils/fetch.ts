import axios from 'axios'

let prefix = 'http://localhost:3001'

export const doGet = (action: string) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      prefix = window.location.origin
    }

    let url = action
    if (action.indexOf('http') === -1) {
      if (action.substring(0, 1) !== '/') {
        url = prefix + '/' + action
      } else {
        url = prefix + action
      }
    }

    axios.get(url).then(resolve).catch(reject)
  })
}
