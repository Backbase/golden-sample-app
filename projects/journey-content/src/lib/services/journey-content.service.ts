// import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';;
import { Media } from '../interfaces/cms-media';
import { Post } from '../interfaces/cms-post';
import { DefaultHttpService } from 'wordpress-http-module-ang';

export interface JourneyContentConfiguration {
  cms: 'wordpress' | 'drupal';
}

// eslint-disable-next-line
export const JourneyContentConfigurationToken = new InjectionToken<
JourneyContentConfiguration
>('JourneyContentServiceConfiguration injection token');

const configDefaults: JourneyContentConfiguration = {
  cms: 'wordpress'
};

@Injectable()
export class JourneyContentService {
  private _config: JourneyContentConfiguration;

  constructor(
    @Optional() @Inject(JourneyContentConfigurationToken) config: JourneyContentConfiguration,
    private wordpressHttpService: DefaultHttpService,
  ) {
    config = config || {};
    this._config = { ...configDefaults, ...config };
  }

  get defaults(): JourneyContentConfiguration {
    return configDefaults;
  }

  getMediaContent(contentId: string): Observable<Media> {
    if(!contentId) {
      throw new Error('No contentId defined');
    }
    
    return this.wordpressHttpService
    .mediaIdGet({
      id: contentId,
    });
  }

  getContent(contentId: string): Observable<Post> {
    if(!contentId) {
      throw new Error('No contentId defined');
    }
    
    return this.wordpressHttpService
    .postsIdGet({
      id: contentId,
    });
  }

}