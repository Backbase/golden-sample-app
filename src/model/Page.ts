import { PageConfig } from "@backbase/foundation-ang/web-sdk";
export interface PageConfigCx extends PageConfig {
  cx: {
    scope: string,
    authUrl: string,
    realm: string,
    clientId: string,
    loginPageUrl: string,
    landingPageUrl: string,
  }
}

export const localesCatalog: Record<string, { language: string, code: string }> = {
  'en-US': {
    language:  'English',
    code: 'en-US'
  },
  'nl-NL': {
    language: 'Nederlands',
    code: 'nl-NL'
  },
  'en': {
    language:  'English',
    code: 'en'
  },
  'nl': {
    language: 'Nederlands',
    code: 'nl'
  },
}
