import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class AccountsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('api/accounts/current')) {
      return of(
        new HttpResponse({
          status: 200,
          body: {
            id: '00001',
            name: 'my account name',
            amount: 5690.76,
          },
        }),
      ).pipe(delay(300));
    } else if (req.url.endsWith('api/accounts')) {
      return of(
        new HttpResponse({
          status: 200,
          body: [
            {
              id: '00001',
              name: 'My first accounts',
              number: '••••••••••••••••2244', // eslint-disable-line id-blacklist
              balance: 5690.76,
              currency: 'USD',
            },
            {
              id: '00002',
              name: 'My second account',
              number: '•••6670',  // eslint-disable-line id-blacklist
              balance: 15420.47,
              currency: 'USD',
            },
          ],
        }),
      ).pipe(delay(300));
    }

    return next.handle(req);
  }
}
