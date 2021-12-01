import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ContentExampleService {

  constructor(private httpClient: HttpClient) { }

  simpleContentExample$ = this.getContent(1);

  private getContent(id: number | string): Observable<string> {
    return (
      this.httpClient
        .get<{ body: [{ value: string }]}>(`http://localhost:4200/content-from-drupal/node/${id}?_format=hal_json`)
        .pipe(
          map((response) => response.body[0].value as string),
        )
    );
  }
}
