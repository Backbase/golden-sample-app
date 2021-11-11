import { PageConfig } from "@backbase/foundation-ang/web-sdk";
import '@angular/localize/init';

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
    language:  $localize`:page english language|page english language@@page.language.en.text:English`,
    code: 'en-US'
  },
  'nl-NL': {
    language: $localize`:page dutch language|page dutch language@@page.language.nl.text:Nederlands`,
    code: 'nl-NL'
  }
}