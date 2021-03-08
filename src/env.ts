/**
 * Use it to detect SSR/Node environment.
 */
export function isNode(): boolean {
  return typeof window === 'undefined'
}

/**
 * Use it to detect Browser (not SSR/Node) environment.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}
