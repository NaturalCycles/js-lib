import { isServerSide } from '@naturalcycles/js-lib'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
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
