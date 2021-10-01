// import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultHttpService as WordpressHttpService } from 'wordpress-http-module-ang';
import { CMSConfiguration, NodeHttpService as DrupalHttpService} from 'drupal-http-module-ang';
import { Media } from '../interfaces/cms-media';
import { Post } from '../interfaces/cms-post';
import { DrupalToWordpress } from '../utils/drupal-to-wordpress';

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
    private wordpressHttpService: WordpressHttpService,
    /*private drupalHttpService: DrupalHttpService*/
  ) {
    config = config || {};
    this._config = { ...configDefaults, ...config };
    
    // this.drupalHttpService.configuration = new CMSConfiguration({
    //   apiKeys: {},
    //   basePath: '',
    //   password: 'test',
    //   username: 'test'
    // });
  }

  get defaults(): JourneyContentConfiguration {
    return configDefaults;
  }

  getMediaContent(contentId: string): Observable<Media> {
    if(!contentId) {
      throw new Error('No contentId defined');
    }
    
    // return DrupalToWordpress.nodeToMedia(this.drupalHttpService
    //   .entityNodeGET({
    //     node: contentId,
    //     format: 'json',
    //   })
    // );
    
    return this.wordpressHttpService
    .mediaIdGet({
      id: contentId,
    });
  }

  getContent(contentId: string): Observable<Post> {
    if(!contentId) {
      throw new Error('No contentId defined');
    }

    // return DrupalToWordpress.nodeToPost(this.drupalHttpService
    //   .entityNodeGET({
    //     node: contentId,
    //     format: 'json',
    //   })
    // );
    
    return this.wordpressHttpService
    .postsIdGet({
      id: contentId,
    });
  }

}