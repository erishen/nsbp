import axios from 'axios'

const prefix = 'http://localhost:3001'

export const doGet = (action:any) => {
  return new Promise((resolve, reject) => {

    let url = action
    if (action.indexOf('http') === -1) {
      if (action.substring(0, 1) !== '/') {
        url = prefix + '/' + action
      } else {
        url = prefix + action
      }
    }

    axios
      .get(url)
      .then(resolve)
      .catch(reject)
  })
}