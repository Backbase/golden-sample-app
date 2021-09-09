import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthInterceptor } from '@backbase/foundation-ang/auth';

@Injectable()
export class AppAuthInterceptor extends AuthInterceptor {
  private endpointsConfig = [
    {
      predicate: this.isLogin,
      resolver: this.handleLogin.bind(this),
    },
    {
      predicate: this.isLogout,
      resolver: this.handleLogout.bind(this),
    },
  ];

  public intercept(request: HttpRequest<{ login: string }>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const endpointConfig = this.endpointsConfig.find((config) => config.predicate(request));

    if (endpointConfig) {
      return endpointConfig.resolver(request, next);
    }

    return next.handle(request);
  }

  private isLogin({ url, method }: HttpRequest<unknown>): boolean {
    return url.includes('/api/auth/login') && method === 'POST';
  }

  private handleLogin(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { body } = req;

    switch (body && body.login) {
      case 'john':
        return of(
          new HttpResponse({
            status: 200,
            body: {
              id: '00001',
              name: 'john doe',
              amount: 5690.76,
            },
          }),
        );

      case 'michael':
        return of(
          new HttpResponse({
            status: 200,
            body: {
              id: '00002',
              name: 'michael knight',
              amount: 5690.76,
            },
          }),
        );

      case 'jacques':
        return of(
          new HttpResponse({
            status: 200,
            body: {
              id: '00003',
              name: 'jacques cousteau',
              amount: 5690.76,
            },
          }),
        );
      default:
        return of(
          new HttpResponse({
            status: 401,
          }),
        );
    }
  }

  private isLogout({ url, method }: HttpRequest<unknown>): boolean {
    return url.includes('/api/auth/logout') && method === 'POST';
  }

  private handleLogout(): Observable<HttpEvent<unknown>> {
    return of(
      new HttpResponse({
        status: 200,
      }),
    );
  }
}
