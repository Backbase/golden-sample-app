import { TestBed } from '@angular/core/testing';
import { OAuthStorage } from 'angular-oauth2-oidc';
import {
  SharedUserContextService,
  USER_CONTEXT_KEY,
  UserContextStorage,
} from './shared-user-context.service';

describe('SharedUserContextService', () => {
  describe('with UserContextStorage', () => {
    let service: SharedUserContextService;
    let userContextStore: UserContextStorage;

    beforeEach(() => {
      userContextStore = {
        getItem: jest.fn(),
        setItem: jest.fn(),
      };

      TestBed.configureTestingModule({
        providers: [
          SharedUserContextService,
          { provide: UserContextStorage, useValue: userContextStore },
        ],
      });
      service = TestBed.inject(SharedUserContextService);
    });

    it('should get service agreement id from user context storage', () => {
      const serviceAgreementId = 'test-service-agreement-id';
      (userContextStore.getItem as jest.Mock).mockReturnValue(
        serviceAgreementId
      );

      expect(service.getServiceAgreementId()).toBe(serviceAgreementId);
      expect(userContextStore.getItem).toHaveBeenCalledWith(USER_CONTEXT_KEY);
    });

    it('should set service agreement id in user context storage', () => {
      const serviceAgreementId = 'test-service-agreement-id';

      service.setServiceAgreementId(serviceAgreementId);

      expect(userContextStore.setItem).toHaveBeenCalledWith(
        USER_CONTEXT_KEY,
        serviceAgreementId
      );
    });

    it('should return undefined when service agreement id is not set', () => {
      (userContextStore.getItem as jest.Mock).mockReturnValue(null);

      expect(service.getServiceAgreementId()).toBeUndefined();
    });
  });

  describe('with OAuthStorage', () => {
    let service: SharedUserContextService;
    let oAuthStore: OAuthStorage;

    beforeEach(() => {
      oAuthStore = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };

      TestBed.configureTestingModule({
        providers: [
          SharedUserContextService,
          { provide: OAuthStorage, useValue: oAuthStore },
        ],
      });
      service = TestBed.inject(SharedUserContextService);
    });

    it('should get service agreement id from oauth storage', () => {
      const serviceAgreementId = 'test-service-agreement-id';
      (oAuthStore.getItem as jest.Mock).mockReturnValue(serviceAgreementId);

      expect(service.getServiceAgreementId()).toBe(serviceAgreementId);
      expect(oAuthStore.getItem).toHaveBeenCalledWith(USER_CONTEXT_KEY);
    });

    it('should set service agreement id in oauth storage', () => {
      const serviceAgreementId = 'test-service-agreement-id';

      service.setServiceAgreementId(serviceAgreementId);

      expect(oAuthStore.setItem).toHaveBeenCalledWith(
        USER_CONTEXT_KEY,
        serviceAgreementId
      );
    });

    it('should return undefined when service agreement id is not set', () => {
      (oAuthStore.getItem as jest.Mock).mockReturnValue(null);

      expect(service.getServiceAgreementId()).toBeUndefined();
    });
  });

  describe('without UserContextStorage or OAuthStorage', () => {
    let service: SharedUserContextService;
    let originalSessionStorage: Storage;

    beforeEach(() => {
      // Mock sessionStorage at the global level
      originalSessionStorage = global.sessionStorage;
      const mockSessionStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn(),
      };
      Object.defineProperty(global, 'sessionStorage', {
        value: mockSessionStorage,
        writable: true,
      });

      TestBed.configureTestingModule({
        providers: [SharedUserContextService],
      });
      service = TestBed.inject(SharedUserContextService);
    });

    afterEach(() => {
      Object.defineProperty(global, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true,
      });
    });

    it('should use sessionStorage as fallback', () => {
      const serviceAgreementId = 'test-service-agreement-id';
      (global.sessionStorage.getItem as jest.Mock).mockReturnValue(
        serviceAgreementId
      );

      expect(service.getServiceAgreementId()).toBe(serviceAgreementId);
      expect(global.sessionStorage.getItem).toHaveBeenCalledWith(
        USER_CONTEXT_KEY
      );

      service.setServiceAgreementId(serviceAgreementId);
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
        USER_CONTEXT_KEY,
        serviceAgreementId
      );
    });
  });
});
