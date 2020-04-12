import { HttpError } from '@naturalcycles/js-lib'

export interface GetKyOptions {
  /**
   * @default false
   */
  logStart?: boolean

  /**
   * Log when request is finished.
   * @default false
   */
  logFinished?: boolean

  /**
   * Log actual response object (no stringification).
   *
   * @default false
   */
  logResponse?: boolean

  /**
   * @default false
   * Set to true to show Topbar loader during loading.
   */
  topbar?: boolean

  /**
   * Receive a callback onError.
   * Providing a callback doesn't cancel any other options, such as throwOnError or alertOnError.
   */
  onError?: (err: HttpError) => any

  /**
   * @default true
   */
  throwOnError?: boolean

  /**
   * @default false
   * Set to true to show browser native alert() with formatted (stringified, with maxLen) error message.
   */
  alertOnError?: boolean
}
