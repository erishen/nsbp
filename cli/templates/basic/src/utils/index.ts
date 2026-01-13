export const getLocationParams = (param: string) => {
  if (typeof window === 'undefined') return ''

  try {
    const url = new URL(window.location.href)
    const value = url.searchParams.get(param)
    return value || ''
  } catch (e) {
    console.error('Failed to parse URL:', e)
    return ''
  }
}

export const isSEO = () => {
  if (typeof window !== 'undefined') {
    const seo = getLocationParams('seo')
    if (seo !== '') {
      return parseInt(seo, 10)
    }
    return 0
  }
  return 0
}

export const handleLink = (link: string) => {
  let result = link

  if (isSEO()) {
    if (link.indexOf('?') !== -1) {
      result += '&'
    } else {
      result += '?'
    }
    result += 'seo=1'
  }
  return result
}