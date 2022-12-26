/**
 * Use it to detect SSR/Node environment.
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined'
}

/**
 * Use it to detect Browser (not SSR/Node) environment.
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}
