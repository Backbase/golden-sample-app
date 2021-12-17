import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const entitlements = [
    {
      "additions": {},
      "resource": "Payments",
      "function": "transfer",
      "permissions": {
        "view": true,
        "edit": true,
        "limitless": true,
      }
    },
    {
        "additions": {},
        "resource": "Payments",
        "function": "transactions",
        "permissions": {
          "edit": true,
          "view": true,
        }
      },
  ];


@Injectable()
export class EntitlementsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('client-api/v2/accessgroups/users/permissions/summary')) {
      return of(new HttpResponse({
        status: 200,
        body: entitlements,
      })).pipe(delay(300));
    }
    return next.handle(req);
  }
}

