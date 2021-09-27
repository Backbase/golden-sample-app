import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';

import { AppAuthService } from './app-auth.service';

describe('AuthService', () => {
  let service: AppAuthService;

  let httpClientStub: jasmine.SpyObj<HttpClient>;
  let routerStub: jasmine.SpyObj<Router>;
  let oauthStub: Pick<OAuthService, 
    |'events' 
    | 'hasValidAccessToken'
    | 'setupAutomaticSilentRefresh'
    | 'loadDiscoveryDocument'
    | 'tryLogin'
    | 'silentRefresh'
    | 'state'
    | 'initLoginFlow'
    | 'logOut'
  >;

  beforeEach(() => {
    httpClientStub = jasmine.createSpyObj<HttpClient>(['post']);
    routerStub = jasmine.createSpyObj<Router>(['navigate']);

    oauthStub = {
      events: of({
        type: 'discovery_document_loaded'
      }),
      hasValidAccessToken: jasmine.createSpy().and.returnValues(true),
      initLoginFlow: jasmine.createSpy(),
      loadDiscoveryDocument: jasmine.createSpy().and.returnValue(Promise.resolve({
        type: 'discovery_document_loaded',
        info: 'test',
      })),
      logOut: jasmine.createSpy(),
      setupAutomaticSilentRefresh: jasmine.createSpy(),
      silentRefresh: jasmine.createSpy().and.returnValue(Promise.resolve({
        type: 'discovery_document_loaded',
      })),
      tryLogin: jasmine.createSpy().and.returnValue(Promise.resolve(true)),
      state: '/test',
    }

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
        {
          provide: OAuthService,
          useValue: oauthStub,
        }
      ],
    });
    service = TestBed.inject(AppAuthService);
  });

  describe('when login is succesfull', () => {
    beforeEach(() => {
      httpClientStub.post.and.returnValue(of({}));
      service.login();
    });

    it('should call the initLoginFlow method', () => {
      expect(oauthStub.initLoginFlow).toHaveBeenCalled();
    })
  });

  describe('when logout is succesfull', () => {
    beforeEach(() => {
      httpClientStub.post.and.returnValue(of({}));
      service.logout();
    });

    it('should call the initLoginFlow method', () => {
      expect(oauthStub.logOut).toHaveBeenCalled();
    });
  });
});
