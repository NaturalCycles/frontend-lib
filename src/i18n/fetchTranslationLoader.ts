import { StringMap } from '@naturalcycles/js-lib'
import { getKy, GetKyOptions, KyInstance } from '..'
import { TranslationLoader } from './translation.service'

/**
 * Use `prefixUrl` to prefix your language files.
 * Example URL structure:
 * ${prefixUrl}/${locale}.json
 */
export interface FetchTranslationLoaderCfg extends GetKyOptions {}

export class FetchTranslationLoader implements TranslationLoader {
  constructor(public cfg: FetchTranslationLoaderCfg = {}) {
    this.ky = getKy(cfg)
  }

  ky: KyInstance

  async load(locale: string): Promise<StringMap> {
    return await this.ky.get(`${locale}.json`).json()
  }
}
