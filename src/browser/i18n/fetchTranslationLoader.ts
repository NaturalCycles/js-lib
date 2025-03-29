import type { Fetcher } from '../../http/fetcher'
import type { StringMap } from '../../types'
import type { TranslationLoader } from './translation.service'

/**
 * Use `baseUrl` to prefix your language files.
 * Example URL structure:
 * ${baseUrl}/${locale}.json
 */
export class FetchTranslationLoader implements TranslationLoader {
  constructor(public fetcher: Fetcher) {}

  async load(locale: string): Promise<StringMap> {
    return await this.fetcher.get(`${locale}.json`)
  }
}
