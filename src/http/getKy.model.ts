import { AppError } from '@naturalcycles/js-lib'
import type { Options } from 'ky-for-people'

/**
 * Extends ky.Options, so you can e.g set your hooks there and they will be run in the correct order.
 *
 * GetKy puts one BeforeRequest hook BEFORE your hooks (to enrich the request).
 * GetKy puts one AfterResponse hook AFTER your hooks (to handle errors).
 */
export interface GetKyOptions extends Options {
  /**
   * @default false
   */
  logStart?: boolean

  /**
   * Log when request is finished.
   *
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
  onError?: (err: AppError) => any

  /**
   * @default false
   * Set to true to show browser native alert() with formatted (stringified, with maxLen) error message.
   */
  alertOnError?: boolean
}
