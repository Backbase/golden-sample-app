import { Inject, Injectable, InjectionToken, LOCALE_ID } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
export const LOCALES_LIST = new InjectionToken<Array<string>>('List of locales available');

@Injectable()
export class LocalesService {
  setLocaleCookie(value: string) {
    this.cookie.set('bb-locale', value);
  }

  get currentLocale() {
    return this.locale;
  }

  constructor(private cookie: CookieService,
    @Inject(LOCALE_ID) private locale: string,
  ) {}
}
