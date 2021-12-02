import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { DrupalResponse, StructuredContent, StructuredContentResponse, FieldValue } from './models';

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

  structuredContentExample$ = this.getContent(2).pipe(
    map((response) => {
      if (response && this.isBusinessInfo(response)) {
        return {
          addressLine: this.getValue(response.field_address_line),
          email: this.getValue(response.field_email),
          public: this.getValue(response.field_public),
          title: this.getValue(response.title),
        } as StructuredContent
      }

      return null;
    })
  );

  private getContent(id: number | string): Observable<DrupalResponse | StructuredContentResponse | null> {
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

  private isBusinessInfo(response: DrupalResponse): response is StructuredContentResponse {
    return response.type[0].target_id === 'business_info';
  } 

  private getValue(fieldValue: FieldValue): string | boolean {
    return fieldValue[0].value;
  }
}
