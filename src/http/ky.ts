import {
  anyToErrorMessage,
  anyToErrorObject,
  ErrorObject,
  errorObjectToHttpError,
  HttpErrorData,
  jsonParseIfPossible,
} from '@naturalcycles/js-lib'
import { since } from '@naturalcycles/time-lib'
import ky from 'ky'
import { topbar } from '..'
import { GetKyOptions } from './ky.model'

declare global {
  interface Request {
    /**
     * Set in Ky hook to Date.now()
     */
    started?: number
  }
}

export function getKy(opt: GetKyOptions = {}): typeof ky {
  return ky.create({
    throwHttpErrors: opt.throwOnError !== false, // default to true
    hooks: {
      beforeRequest: [
        (req, _options) => {
          // console.log('before', opt, req)

          if (opt.topbar) {
            topbar.show()
          }

          if (opt.logStart) {
            console.log(` >> ${req.method} ${req.url}`)
          }

          req.started = Date.now()
        },
      ],
      afterResponse: [
        async (req, _options, res) => {
          if (opt.topbar) {
            topbar.hide()
          }

          if (opt.logFinished || !res.ok) {
            const firstToken = [
              ' <<',
              res.status,
              req.method,
              req.url,
              req.started && since(req.started),
            ]
              .filter(Boolean)
              .join(' ')

            const tokens: any[] = [firstToken]

            if (opt.logResponse || !res.ok) {
              try {
                const body = jsonParseIfPossible(await res.text())

                if (!res.ok) {
                  const errMsgWithBody = anyToErrorMessage(body, true)
                  tokens.push(errMsgWithBody)

                  if (opt.onError) {
                    const errObj = anyToErrorObject(body) as ErrorObject<HttpErrorData>
                    errObj.message = [firstToken, errObj.message].join('\n')
                    errObj.data.httpStatusCode = res.status
                    opt.onError(errorObjectToHttpError(errObj))
                  }

                  // currently alerts on each retry, we probably don't want that
                  if (opt.alertOnError) {
                    const errMsg = [firstToken, anyToErrorMessage(body, true)].join('\n')
                    alert(errMsg)
                  }
                } else {
                  tokens.push(body)
                }
              } catch {}
            }

            console.log(...tokens)
          }
          console.log('after', req, _options, res)
        },
      ],
    },
  })
}
