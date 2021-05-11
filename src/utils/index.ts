export const getLocationParams = (param:any) => {
    let result = ''
    if (param !== '') {
      const href = window?.location?.href
      if (href && href.indexOf('?') !== -1) {
        const query = href.split('?')[1]
        const queryArr = query.split('&')
  
        queryArr.forEach(item => {
          const itemArr = item.split('=')
  
          if (param.toLowerCase() === itemArr[0].toLowerCase()) {
            result = itemArr[1]
            return false
          }
        })
      }
    }
    return result
}

export const isSEO = ()=>{
    if(typeof window !== 'undefined'){
        let seo:any = getLocationParams('seo')
        if(seo !== ''){
            seo = parseInt(seo, 10)
        }
        return seo
    }
    return 0
}