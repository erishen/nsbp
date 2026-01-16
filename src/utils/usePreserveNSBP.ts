import { useMemo } from 'react'
import { appendNSBPParam } from './index'

/**
 * React Hook 用于在路由跳转时保留 nsbp 参数
 * @returns 包含三个方法的对象
 *
 * @example
 * const { withNSBP, withNSBPValue, withoutNSBP } = usePreserveNSBP()
 *
 * // 保留当前的 nsbp 参数
 * <Link to={withNSBP('/photo?dic=test')}>
 *
 * // 指定 nsbp 值
 * <Link to={withNSBPValue('/photo?dic=test', '0')}>
 *
 * // 移除 nsbp 参数
 * <Link to={withoutNSBP('/photo?dic=test&nsbp=0')}>
 */
export const usePreserveNSBP = () => {
  return useMemo(
    () => ({
      /**
       * 保留当前 URL 中的 nsbp 参数
       * @param url - 原始 URL
       * @returns 保留了 nsbp 参数的 URL
       */
      withNSBP: (url: string) => appendNSBPParam(url),

      /**
       * 指定 nsbp 参数值
       * @param url - 原始 URL
       * @param value - nsbp 参数值
       * @returns 添加了指定 nsbp 值的 URL
       */
      withNSBPValue: (url: string, value: string) =>
        appendNSBPParam(url, value),

      /**
       * 移除 URL 中的 nsbp 参数
       * @param url - 原始 URL
       * @returns 移除了 nsbp 参数的 URL
       */
      withoutNSBP: (url: string) => {
        if (typeof window === 'undefined') return url

        try {
          const urlObj = new URL(url, window.location.origin)
          urlObj.searchParams.delete('nsbp')
          return urlObj.pathname + urlObj.search
        } catch {
          return url
        }
      }
    }),
    []
  )
}
