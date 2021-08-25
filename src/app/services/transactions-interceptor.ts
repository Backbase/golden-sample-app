import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import * as mocks from '../mock-data/transactions.json';
import { Transaction } from 'transactions-journey';
import { Observable, of } from 'rxjs';
@Injectable()
export class TransactionsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('api/transactions')) {
      const page = Number(req.params.get('page')) || 0;
      const pageSize = Number(req.params.get('pageSize')) || 0;

      return of(new HttpResponse({
        status: 200,
        body: mocks.data
          .sort((a: Transaction, b: Transaction) => b.dates.valueDate - a.dates.valueDate)
          .slice(page, pageSize)
      }));
    }

    return next.handle(req);
  }
}
