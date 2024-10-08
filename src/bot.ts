// Relevant material:
// https://deviceandbrowserinfo.com/learning_zone/articles/detecting-headless-chrome-puppeteer-2024

import { isServerSide } from '@naturalcycles/js-lib'

/**
 * Service to detect bots and CDP (Chrome DevTools Protocol).
 *
 * @experimental
 */
class BotDetectionService {
  isBotOrCDP(): boolean {
    return this.isBot() || this.isCDP()
  }

  isBot(): boolean {
    // SSR - not a bot
    if (isServerSide() || !navigator) return false

    const { userAgent } = navigator
    if (!userAgent) return true

    if (/Headless/i.test(userAgent)) return true
    if (/Electron/i.test(userAgent)) return true
    if (/PhantomJS/i.test(userAgent)) return true
    if (/slimerjs/i.test(userAgent)) return true

    if (navigator.webdriver) {
      return true
    }

    if (navigator.plugins?.length === 0) {
      return true // Headless Chrome
    }

    if ((navigator.languages as any) === '') {
      return true // Headless Chrome
    }

    // isChrome is true if the browser is Chrome, Chromium or Opera
    // if(isChrome && !window.chrome) {
    //   return true // Headless Chrome
    // }

    return false
  }

  /**
   * CDP stands for Chrome DevTools Protocol.
   * This function tests if the current environment is a CDP environment.
   * If it's true - it's one of:
   *
   * 1. Bot, automated with CDP, e.g Puppeteer, Playwright or such.
   * 2. Developer with Chrome DevTools open.
   *
   * 2 is certainly not a bot, but unfortunately we can't distinguish between the two.
   * That's why this function is not part of `isBot()`, because it can give "false positive" with DevTools.
   *
   * Based on: https://deviceandbrowserinfo.com/learning_zone/articles/detecting-headless-chrome-puppeteer-2024
   */
  isCDP(): boolean {
    if (isServerSide()) return false
    let cdpCheck1 = false
    try {
      /* eslint-disable */
      // biome-ignore lint/suspicious/useErrorMessage: ok
      const e = new window.Error()
      window.Object.defineProperty(e, 'stack', {
        configurable: false,
        enumerable: false,
        // biome-ignore lint/complexity/useArrowFunction: ok
        get: function () {
          cdpCheck1 = true
          return ''
        },
      })
      // This is part of the detection and shouldn't be deleted
      window.console.debug(e)
      /* eslint-enable */
    } catch {}
    return cdpCheck1
  }
}

export const botDetectionService = new BotDetectionService()
