import type {
  AfterResponseHook,
  BeforeRequestHook,
  BeforeRetryHook,
  NormalizedOptions,
  RetryOptions,
} from 'ky'
import ky from 'ky'
import { loadGTag, loadHotjar } from './analytics/analytics'
import { getKy } from './http/getKy'
import { GetKyOptions } from './http/getKy.model'
import { loadScript } from './script/script.util'
import { topbar, TopBarOptions } from './vendor/topbar/topbar'

export {
  TopBarOptions,
  topbar,
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
}
