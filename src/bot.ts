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
    return !!this.isBot() || this.isCDP()
  }

  /**
   * Returns undefined if it's not a Bot,
   * otherwise a truthy BotReason.
   */
  isBot(): BotReason | undefined {
    // SSR - not a bot
    if (isServerSide()) return
    const { navigator } = globalThis
    if (!navigator) return BotReason.NoNavigator
    const { userAgent } = navigator
    if (!userAgent) return BotReason.NoUserAgent

    if (/headless/i.test(userAgent)) return BotReason.UserAgent
    if (/electron/i.test(userAgent)) return BotReason.UserAgent
    if (/phantom/i.test(userAgent)) return BotReason.UserAgent
    if (/slimer/i.test(userAgent)) return BotReason.UserAgent

    if (navigator.webdriver) {
      return BotReason.WebDriver
    }

    // Kirill: commented out, as it's no longer seems reliable,
    // e.g generates false positives with latest Android clients (e.g. Chrome 129)
    // if (navigator.plugins?.length === 0) {
    //   return BotReason.ZeroPlugins // Headless Chrome
    // }

    if ((navigator.languages as any) === '') {
      return BotReason.EmptyLanguages // Headless Chrome
    }

    // isChrome is true if the browser is Chrome, Chromium or Opera
    // this is "the chrome test" from https://intoli.com/blog/not-possible-to-block-chrome-headless/
    // this property is for some reason not present by default in headless chrome
    if (userAgent.includes('Chrome') && !(globalThis as any).chrome) {
      return BotReason.ChromeWithoutChrome // Headless Chrome
    }
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

export enum BotReason {
  NoNavigator = 1,
  NoUserAgent = 2,
  UserAgent = 3,
  WebDriver = 4,
  ZeroPlugins = 5,
  EmptyLanguages = 6,
  ChromeWithoutChrome = 7,
}
