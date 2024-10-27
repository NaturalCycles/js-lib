import { isServerSide } from '../env'
import { _objectAssign } from '../types'

export type LoadScriptOptions = Partial<HTMLScriptElement>
export type LoadCSSOptions = Partial<HTMLLinkElement>

/**
 * opt.async defaults to `true`.
 * No other options are set by default.
 */
export async function loadScript(src: string, opt?: LoadScriptOptions): Promise<void> {
  if (isServerSide()) return

  return await new Promise<void>((resolve, reject) => {
    const s = _objectAssign(document.createElement('script'), {
      src,
      async: true,
      ...opt,
      onload: resolve as any,
      onerror: (_event, _source, _lineno, _colno, err) => {
        reject(err || new Error(`loadScript failed: ${src}`))
      },
    })
    document.head.append(s)
  })
}

/**
 * Default options:
 * rel: 'stylesheet'
 *
 * No other options are set by default.
 */
export async function loadCSS(href: string, opt?: LoadCSSOptions): Promise<void> {
  if (isServerSide()) return

  return await new Promise<void>((resolve, reject) => {
    const link = _objectAssign(document.createElement('link'), {
      href,
      rel: 'stylesheet',
      // type seems to be unnecessary: https://stackoverflow.com/a/5409146/4919972
      // type: 'text/css',
      ...opt,
      onload: resolve as any,
      onerror: (_event, _source, _lineno, _colno, err) => {
        reject(err || new Error(`loadCSS failed: ${href}`))
      },
    })

    document.head.append(link)
  })
}
