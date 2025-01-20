import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable()
export class ApiSandboxInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiSandboxKey = environment.apiSandboxKey;

    if (!req.url.includes(environment.apiRoot) || !apiSandboxKey) {
      return next.handle(req);
    }

    const newReq = req.clone({
      setHeaders: {
        'X-SDBXAZ-API-KEY': apiSandboxKey,
      },
    });

    return next.handle(newReq);
  }
}
