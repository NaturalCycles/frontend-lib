import type {
  AfterResponseHook,
  BeforeRequestHook,
  BeforeRetryHook,
  NormalizedOptions,
  RetryOptions,
} from 'ky-for-people'
import ky from 'ky-for-people'
export * from './admin/adminService'
export * from './analytics/analytics'
export * from './env'
export * from './http/getKy'
export * from './http/getKy.model'
export * from './i18n/fetchTranslationLoader'
export * from './i18n/translation.service'
export * from './image/fitImages'
export * from './script/script.util'
export * from './vendor/topbar/topbar'

// polyfill globalThis, otherwise `ky` breaks on iOS<12.3
if (typeof window !== 'undefined') {
  ;(window as any).globalThis = window
}

export type {
  BeforeRetryHook,
  AfterResponseHook,
  BeforeRequestHook,
  RetryOptions,
  NormalizedOptions,
}

export { ky }
