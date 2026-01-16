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
    const nsbp = getLocationParams('nsbp')
    if (nsbp !== '') {
      return parseInt(nsbp, 10)
    }
    return 1
  }
  return 1
}

/**
 * 获取当前的 nsbp 参数值
 * @returns nsbp 参数值，如果没有则返回空字符串
 */
export const getNSBPParam = () => {
  return getLocationParams('nsbp')
}

/**
 * 在 URL 中保留/添加 nsbp 参数
 * @param url - 原始 URL
 * @param nsbpValue - 可选的 nsbp 值，如果不提供则使用当前 URL 中的值
 * @returns 保留了 nsbp 参数的 URL
 *
 * @example
 * appendNSBPParam('/photo?dic=test')
 * // 如果当前 URL 是 /?nsbp=0，返回 '/photo?dic=test&nsbp=0'
 *
 * @example
 * appendNSBPParam('/photo?dic=test', '0')
 * // 返回 '/photo?dic=test&nsbp=0'
 */
export const appendNSBPParam = (url: string, nsbpValue?: string): string => {
  // 如果指定了 nsbpValue 则使用它，否则使用当前 URL 中的值
  const nsbp = nsbpValue !== undefined ? nsbpValue : getNSBPParam()

  // 如果没有 nsbp 值，直接返回原 URL
  if (!nsbp) {
    return url
  }

  // 判断 URL 中是否已有查询参数
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}nsbp=${nsbp}`
}

/**
 * 从 URL 中移除 nsbp 参数
 * @param url - 原始 URL
 * @returns 移除了 nsbp 参数的 URL
 *
 * @example
 * removeNSBPParam('/photo?dic=test&nsbp=0')
 * // 返回 '/photo?dic=test'
 */
export const removeNSBPParam = (url: string): string => {
  const urlObj = new URL(
    url,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  )
  urlObj.searchParams.delete('nsbp')
  return urlObj.pathname + urlObj.search
}

/**
 * 保留 handleLink 作为向后兼容的函数
 * @deprecated 使用 appendNSBPParam 替代
 */
export const handleLink = (link: string) => {
  let result = link

  if (isSEO()) {
    if (link.indexOf('?') !== -1) {
      result += '&'
    } else {
      result += '?'
    }
    result += 'nsbp=1'
  }
  return result
}

export { usePreserveNSBP } from './usePreserveNSBP'
