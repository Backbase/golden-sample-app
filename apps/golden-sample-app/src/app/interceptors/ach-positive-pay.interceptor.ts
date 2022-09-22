import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AchPositivePayInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<{ method: string; url: string }>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      req.url.includes('api/ach-positive-pay/rule') &&
      req.method === 'POST'
    ) {
      return timer(400).pipe(
        map(
          () =>
            new HttpResponse({
              status: 200,
              body: {},
            })
        )
      );
    }

    return next.handle(req);
  }
}
