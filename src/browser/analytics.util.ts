import { isServerSide } from '@naturalcycles/js-lib'
import { loadScript } from './script.util.js'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

/* eslint-disable unicorn/prefer-global-this */

/**
 * Pass enabled = false to only init window.gtag, but not load actual gtag script (e.g in dev mode).
 */
export async function loadGTag(gtagId: string, enabled = true): Promise<void> {
  if (isServerSide()) return

  window.dataLayer ||= []
  window.gtag ||= function gtag() {
    // biome-ignore lint/complexity/useArrowFunction: ok
    // biome-ignore lint/style/noArguments: ok
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', gtagId)

  if (!enabled) return

  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${gtagId}`)
}

export async function loadGTM(gtmId: string, enabled = true): Promise<void> {
  if (isServerSide()) return

  window.dataLayer ||= []
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
  })

  if (!enabled) return

  await loadScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`)
}

export function loadHotjar(hjid: number): void {
  if (isServerSide()) return

  /* eslint-disable */
  // prettier-ignore
  ;
  ;((h: any, o, t, j, a?: any, r?: any) => {
    h.hj =
      h.hj ||
      function hj() {
        // biome-ignore lint/style/noArguments: ok
        ;(h.hj.q = h.hj.q || []).push(arguments)
      }
    h._hjSettings = { hjid, hjsv: 6 }
    a = o.querySelectorAll('head')[0]
    r = o.createElement('script')
    r.async = 1
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
    a.append(r)
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
  /* eslint-enable */
}
