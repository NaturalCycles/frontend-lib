/* eslint-disable unicorn/prefer-add-event-listener */

export async function loadScript(src: string, async = true): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/return-await
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve as any
    s.onerror = (_event, _source, _lineno, _colno, error) => {
      reject(error || new Error(`loadScript failed: ${src}`))
    }
    if (async) s.async = true
    document.head.append(s)
  })
}
