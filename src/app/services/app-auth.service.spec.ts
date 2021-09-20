import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AppAuthService } from './app-auth.service';

describe('AuthService', () => {
  let service: AppAuthService;

  let httpClientStub: jasmine.SpyObj<HttpClient>;
  let routerStub: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpClientStub = jasmine.createSpyObj<HttpClient>(['post']);
    routerStub = jasmine.createSpyObj<Router>(['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientStub,
        },
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    });
    service = TestBed.inject(AppAuthService);
  });

  it('isAuthenticated should be false by default', (done: DoneFn) => {
    service.isAuthenticated$.subscribe((received) => {
      expect(received).toBeFalse();
      done();
    });
  });

  describe('when login is succesfull', () => {
    const redirectUriMock = 'redirect-uri-mock';

    beforeEach(() => {
      httpClientStub.post.and.returnValue(of({}));
      service.login({ login: 'login', redirectUri: redirectUriMock });
    });

    it('isAuthenticated should be true', (done: DoneFn) => {
      service.isAuthenticated$.subscribe((received) => {
        expect(received).toBeTrue();
        done();
      });
    });

    it('should redirect to a redirectUri', () => {
      expect(routerStub.navigate).toHaveBeenCalledWith([redirectUriMock]);
    });
  });

  describe('when logout is succesfull', () => {
    beforeEach(() => {
      httpClientStub.post.and.returnValue(of({}));
      service.logout();
    });

    it('isAuthenticated should be false', (done: DoneFn) => {
      service.isAuthenticated$.subscribe((received) => {
        expect(received).toBeFalse();
        done();
      });
    });

    it('should redirect to a login by default', () => {
      expect(routerStub.navigate).toHaveBeenCalledWith(['login']);
    });
  });
});
