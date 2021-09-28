import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';

export interface JourneyContentConfiguration {
  /**
   * Content server URI
   */
  contentRootUrl: string;
  /**
   * API server URI
   */
  rootUrl: string;
  /**
   * master API key for API server URI
   */
  masterKey: string;
}

// eslint-disable-next-line
export const JourneyContentConfigurationToken = new InjectionToken<
JourneyContentConfiguration
>('JourneyContentServiceConfiguration injection token');

const configDefaults: JourneyContentConfiguration = {
  contentRootUrl: 'https://demo.dotcms.com',
  rootUrl: 'https://api.jsonbin.io/v3',
  masterKey: '$2b$10$SQMF8MmWsCRbSb4en/efWOvaGDtP0ZMLFIS/yeezk6Oy3nWUPyyAa'
};

@Injectable()
export class JourneyContentService {
  private _config: JourneyContentConfiguration;

  constructor(
    @Optional() @Inject(JourneyContentConfigurationToken) config: JourneyContentConfiguration,
    private http: HttpClient
  ) {
    config = config || {};
    this._config = { ...configDefaults, ...config };
  }

  get defaults(): JourneyContentConfiguration {
    return configDefaults;
  }

  get contentRootUrl(): string {
    return this._config.contentRootUrl;
  }

  getContent(contentId: string) {
    if(!contentId) {
      throw new Error('No contentId defined');
    }

    return this.http.get<any>(`${this._config.rootUrl}/b/${contentId}/latest`, {
      headers: {
        'X-Master-Key': configDefaults.masterKey
      }
    });
  }

}