import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export type User = {
  id: string;
  name: string;
  balance: number;
};

/**
 * This is not the actual implementation of authentication service,
 * this is only example, be careful with reading all of the notes inside.
 */
@Injectable({
  providedIn: 'root',
})
export class AppAuthService {
  private isAuthenticated$$ = new BehaviorSubject<boolean>(false);

  private currentUser$$ = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser$$.asObservable();

  /**
   * In the production version of auth service it should be like
   * public isAuthenticated$ = this.authServiceFromFoundation.isAuthenticated;
   */
  public isAuthenticated$ = this.isAuthenticated$$.asObservable();

  /**
   * In the production version of app auth service there will be only one dependency
   * for authService from foundation-ang
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * In the production version only `redirectUri` is needed to be provided as an argument for
   * this.authServiceFromFoundation.login({ redirectUri }) method call
   */
  login({ login, redirectUri }: { login: string; redirectUri: string }): void {
    this.http
      .post('/api/auth/login', { login, redirectUri })
      .pipe(
        map((user) => this.currentUser$$.next(user as User)),
        map(() => this.isAuthenticated$$.next(true)),
      )
      .subscribe(() => this.redirectTo(redirectUri));
  }

  /**
   * In the production version only `redirectUri` is needed to be provided as an argument for
   * this.authServiceFromFoundation.logout({ redirectUri }) method call
   */
  logout(logoutOptions?: { redirectUri: string }): void {
    const redirectUri = logoutOptions?.redirectUri || 'login';
    this.http
      .post('/api/auth/logout', { redirectUri })
      .pipe(
        map(() => this.currentUser$$.next(null)),
        map(() => this.isAuthenticated$$.next(false)),
      )
      .subscribe(() => this.redirectTo(redirectUri));
  }

  private redirectTo(redirectUri: string): void {
    this.router.navigate([redirectUri]);
  }
}
