import {
  ErrorObject,
  HttpErrorData,
  _anyToErrorMessage,
  _anyToErrorObject,
  _errorObjectToHttpError,
  _filterNullishValues,
  _jsonParseIfPossible,
  _since,
} from '@naturalcycles/js-lib'
import ky from 'ky'
import type { RetryOptions } from 'ky'
import { topbar } from '../vendor/topbar/topbar'
import type { GetKyOptions } from './getKy.model'

export type KyInstance = typeof ky

declare global {
  interface Request {
    /**
     * Set in Ky hook to Date.now()
     */
    started?: number

    tryCount?: number
  }
}

export function getKy(opt: GetKyOptions = {}): KyInstance {
  return ky.create({
    timeout: 60_000, // default to 60 seconds, not 10
    ...opt,
    hooks: {
      ...opt.hooks,
      beforeRequest: [
        (req, options) => {
          // console.log('before', opt, req)

          if (opt.topbar) {
            topbar.show()
          }

          req.started = Date.now()
          req.tryCount = (req.tryCount || 0) + 1

          if (opt.logStart) {
            const { limit } = options.retry as RetryOptions
            const shortUrl = getShortUrl(req.url, options.prefixUrl)

            console.log(
              [' >>', req.method, shortUrl, req.tryCount > 1 && `try#${req.tryCount}/${limit}`]
                .filter(Boolean)
                .join(' '),
            )
          }
        },
        // User hooks go AFTER
        ...(opt.hooks?.beforeRequest || []),
      ],
      afterResponse: [
        ...(opt.hooks?.afterResponse || []),
        // User hooks go BEFORE ^^^
        async (req, options, res) => {
          if (opt.topbar) {
            topbar.hide()
          }

          if (opt.logFinished || !res.ok) {
            const { limit } = options.retry as RetryOptions
            const shortUrl = getShortUrl(req.url, options.prefixUrl)

            const firstToken = [
              ' <<',
              res.status,
              req.method,
              shortUrl,
              // Don't include these tokens in Error message to allow proper Sentry error grouping
              res.ok && req.tryCount && req.tryCount > 1 && `try#${req.tryCount}/${limit}`,
              res.ok && req.started && _since(req.started),
            ]
              .filter(Boolean)
              .join(' ')

            const tokens: any[] = [firstToken]

            if (opt.logResponse || !res.ok) {
              const body = _jsonParseIfPossible(await res.text())

              if (!res.ok) {
                const errMsgWithBody = _anyToErrorMessage(body, true)
                tokens.push(errMsgWithBody)

                // console.log(options, req, res)

                const errObj = _anyToErrorObject(body) as ErrorObject<HttpErrorData>
                const originalMessage = errObj.message
                errObj.message = [firstToken, errObj.message].join('\n')
                Object.assign(
                  errObj.data,
                  _filterNullishValues({
                    originalMessage,
                    httpStatusCode: res.status,
                    // These properties are provided to be used in e.g custom Sentry error grouping
                    // Actually, disabled now, to avoid unnecessary error printing when both msg and data are printed
                    // Enabled, cause `data` is not printed by default when error is HttpError
                    // method: req.method,
                    url: req.url,
                    // tryCount: req.tryCount,
                  }),
                )
                const httpError = _errorObjectToHttpError(errObj)

                // alert only if it's the last retry
                if (
                  !options.retry ||
                  req.tryCount === options.retry ||
                  req.tryCount === (options.retry as RetryOptions).limit
                ) {
                  if (opt.alertOnError) {
                    const errMsg = [firstToken, _anyToErrorMessage(body, true)].join('\n')
                    alert(errMsg)
                  }

                  opt.onError?.(httpError)
                }

                console.log(...tokens)

                // Propage the error as HttpError, not the stock ky.HTTPError
                throw httpError
              } else {
                // logResponse == true
                tokens.push(body)
              }
            }

            console.log(...tokens)
          }
          // console.log('after', req, _options, res)
        },
      ],
    },
  })
}

function getShortUrl(url: string, prefixUrl?: string | URL): string {
  const prefix = prefixUrl && String(prefixUrl)

  let shortUrl = url.split('?')[0]!

  if (prefix && shortUrl.startsWith(prefix)) {
    shortUrl = shortUrl.substr(prefix.length)
  }

  return shortUrl
}
