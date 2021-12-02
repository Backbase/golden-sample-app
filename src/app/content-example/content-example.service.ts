import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { DrupalResponse } from './models';

@Injectable()
export class ContentExampleService {
  private isContentFetchingFailed$$ = new BehaviorSubject(false);
  isContentFetchingFailed$ = this.isContentFetchingFailed$$.asObservable();

  constructor(private httpClient: HttpClient) { }

  simpleContentExample$ = this.getContent(1).pipe(
    map((response: DrupalResponse | null) => {
      if (response && response.body) {
        return response.body[0].value as string
      }

      return response;
    }),
  );

  private getContent(id: number | string): Observable<DrupalResponse | null> {
    return (
      this.httpClient
        .get<DrupalResponse>(`http://localhost:4200/content-from-drupal/node/${id}?_format=hal_json`)
        .pipe(
          delay(5000),
          catchError(() => {
            this.isContentFetchingFailed$$.next(true);
            return of(null);
          })
        )
    );
  }
}
