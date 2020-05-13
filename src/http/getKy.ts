import {
  ErrorObject,
  HttpErrorData,
  _anyToErrorMessage,
  _anyToErrorObject,
  _errorObjectToHttpError,
  _jsonParseIfPossible,
  _since,
} from '@naturalcycles/js-lib'
import ky from 'ky'
import type { RetryOptions } from 'ky'
import { topbar } from '../vendor/topbar/topbar'
import type { GetKyOptions } from './getKy.model'

declare global {
  interface Request {
    /**
     * Set in Ky hook to Date.now()
     */
    started?: number

    tryCount?: number
  }
}

export function getKy(opt: GetKyOptions = {}): typeof ky {
  return ky.create({
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

            console.log(
              [' >>', req.method, req.url, req.tryCount > 1 && `try#${req.tryCount}/${limit}`]
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
            const firstToken = [
              ' <<',
              res.status,
              req.method,
              req.url,
              req.started && _since(req.started),
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
                errObj.message = [firstToken, errObj.message].join('\n')
                errObj.data.httpStatusCode = res.status
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
