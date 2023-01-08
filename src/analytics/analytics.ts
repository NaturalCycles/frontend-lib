import { isServerSide } from '@naturalcycles/js-lib'
import { loadScript } from '..'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

/**
 * Pass enabled = false to only init window.gtag, but not load actual gtag script (e.g in dev mode).
 */
export async function loadGTag(gtagId: string, enabled = true): Promise<void> {
  if (isServerSide()) return

  window.dataLayer ||= []
  window.gtag = function () {
    window.dataLayer.push(arguments) // eslint-disable-line prefer-rest-params
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
  console.log('gtm loaded')
}

export function loadHotjar(hjid: number): void {
  if (isServerSide()) return

  /* eslint-disable */
  // prettier-ignore
  ;
  ;(function (h: any, o, t, j, a?: any, r?: any) {
    h.hj =
      h.hj ||
      function () {
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
