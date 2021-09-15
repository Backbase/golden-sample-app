import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AppAuthService } from '../services/app-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AppAuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter((isDone) => isDone),
      switchMap((_) => this.authService.isAuthenticated$),
      tap((isAuthenticated) => isAuthenticated || this.authService.login()),
    );
  }
}
