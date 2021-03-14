import type {
  AfterResponseHook,
  BeforeRequestHook,
  BeforeRetryHook,
  NormalizedOptions,
  RetryOptions,
} from 'ky-for-people'
import ky from 'ky-for-people'
import { AdminModeCfg, AdminService } from './admin/adminService'
import { loadGTag, loadHotjar } from './analytics/analytics'
import { isBrowser, isNode } from './env'
import { getKy, KyInstance } from './http/getKy'
import { GetKyOptions } from './http/getKy.model'
import { FetchTranslationLoader, FetchTranslationLoaderCfg } from './i18n/fetchTranslationLoader'
import {
  MissingTranslationHandler,
  TranslationLoader,
  TranslationService,
  TranslationServiceCfg,
} from './i18n/translation.service'
import { loadScript } from './script/script.util'
import { topbar, TopBarOptions } from './vendor/topbar/topbar'

// polyfill globalThis, otherwise `ky` breaks on iOS<12.3
if (typeof window !== 'undefined') {
  ;(window as any).globalThis = window
}

export type {
  TopBarOptions,
  KyInstance,
  GetKyOptions,
  BeforeRetryHook,
  AfterResponseHook,
  BeforeRequestHook,
  RetryOptions,
  NormalizedOptions,
  TranslationServiceCfg,
  TranslationLoader,
  MissingTranslationHandler,
  FetchTranslationLoaderCfg,
  AdminModeCfg,
}

export {
  topbar,
  getKy,
  loadScript,
  ky,
  loadGTag,
  loadHotjar,
  TranslationService,
  FetchTranslationLoader,
  isNode,
  isBrowser,
  AdminService,
}
