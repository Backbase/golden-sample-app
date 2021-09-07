import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable()
export class AccountsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('api/accounts/current')) {
      return of(new HttpResponse({
        status: 200,
        body: {
            id: '00001',
            name: 'my account name',
            amount: 5690.76,
          }
      })).pipe(delay(300));
    }
    return next.handle(req);
  }
}
