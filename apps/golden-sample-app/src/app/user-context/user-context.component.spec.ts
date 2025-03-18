import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserContextComponent } from './user-context.component';
import { UserContextGuard } from './user-context.guard';
import { UserContextService } from './user-context.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('UserContextComponent', () => {
  let component: UserContextComponent;
  let fixture: ComponentFixture<UserContextComponent>;
  let router: Router;
  let userContextGuard: UserContextGuard;
  let oauthService: OAuthService;
  let userContextService: UserContextService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    const userContextGuardMock = {
      getTargetUrl: jest.fn().mockReturnValue('/target'),
    };

    const oauthServiceMock = {
      logOut: jest.fn(),
    };

    const userContextServiceMock = {
      setServiceAgreementId: jest.fn(),
    };

    const mockActivatedRoute = {
      snapshot: {
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [UserContextComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserContextGuard, useValue: userContextGuardMock },
        { provide: OAuthService, useValue: oauthServiceMock },
        { provide: UserContextService, useValue: userContextServiceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserContextComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userContextGuard = TestBed.inject(UserContextGuard);
    oauthService = TestBed.inject(OAuthService);
    userContextService = TestBed.inject(UserContextService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Handle the service agreements request
    const req = httpMock.expectOne(
      '/access-control/client-api/v3/accessgroups/user-context/service-agreements?from=0&size=7'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      size: 7,
      totalElements: 1,
      items: [
        {
          id: '123',
          name: 'Test Agreement',
          isDefault: true,
        },
      ],
    });
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remember service agreement', () => {
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(userContextService.setServiceAgreementId).toHaveBeenCalledWith(
      '123'
    );
  });

  it('should redirect to root', () => {
    (userContextGuard.getTargetUrl as jest.Mock).mockReturnValue(undefined);
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should redirect to target url when targetUrl provided by UserContextGuard', () => {
    (userContextGuard.getTargetUrl as jest.Mock).mockReturnValue('/origin-url');
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(router.navigate).toHaveBeenCalledWith(['/origin-url']);
  });
});
