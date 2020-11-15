import type {
  AfterResponseHook,
  BeforeRequestHook,
  BeforeRetryHook,
  NormalizedOptions,
  RetryOptions,
} from 'ky'
import ky from 'ky'
import { loadGTag, loadHotjar } from './analytics/analytics'
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

export {
  TopBarOptions,
  topbar,
  KyInstance,
  getKy,
  GetKyOptions,
  loadScript,
  ky,
  BeforeRetryHook,
  AfterResponseHook,
  BeforeRequestHook,
  RetryOptions,
  NormalizedOptions,
  loadGTag,
  loadHotjar,
  TranslationServiceCfg,
  TranslationService,
  TranslationLoader,
  MissingTranslationHandler,
  FetchTranslationLoaderCfg,
  FetchTranslationLoader,
}
