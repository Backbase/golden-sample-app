import { USER_CONTEXT_KEY, UserContextService } from './user-context.service';
import { MemoryStorage } from 'angular-oauth2-oidc';

describe('UserContextService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('when both an explicit UserContextStorage and OAuthStorage are configured', () => {
    function configureService() {
      const userContextStore = new MemoryStorage();
      const oAuthStore = new MemoryStorage();
      const service = new UserContextService(userContextStore, oAuthStore);
      return { userContextStore, oAuthStore, service };
    }

    it('should return null when no service agreement ID has been set', () => {
      const { service } = configureService();
      expect(service.getServiceAgreementId()).toBeUndefined();
    });

    it('should store the SAID in the UserContextStorage', () => {
      const { userContextStore, service } = configureService();
      service.setServiceAgreementId('feedface');
      expect(userContextStore.getItem(USER_CONTEXT_KEY)).toStrictEqual(
        'feedface'
      );
    });

    it('should retrieve the stored value from the UserContextStorage', () => {
      const { userContextStore, service } = configureService();
      userContextStore.setItem(USER_CONTEXT_KEY, 'deadbeef');
      expect(service.getServiceAgreementId()).toStrictEqual('deadbeef');
    });

    it('should not store the SAID in the OAuthStorage', () => {
      const { oAuthStore, service } = configureService();
      service.setServiceAgreementId('feedface');
      expect(oAuthStore.getItem(USER_CONTEXT_KEY)).toBeUndefined();
    });

    it('should not retrieve the stored value from the OAuthStorage', () => {
      const { oAuthStore, service } = configureService();
      oAuthStore.setItem(USER_CONTEXT_KEY, 'deadbeef');
      expect(service.getServiceAgreementId()).toBeUndefined();
    });

    it('should not store the SAID in the SessionStorage', () => {
      const { service } = configureService();
      service.setServiceAgreementId('feedface');
      expect(sessionStorage.getItem(USER_CONTEXT_KEY)).toBeNull();
    });

    it('should not retrieve the stored value from the SessionStorage', () => {
      const { service } = configureService();
      sessionStorage.setItem(USER_CONTEXT_KEY, 'deadbeef');
      expect(service.getServiceAgreementId()).toBeUndefined();
    });
  });

  describe('when no explicit UserContextStorage is configured and an OAuthStorage is configured', () => {
    function configureService() {
      const oAuthStore = new MemoryStorage();
      const service = new UserContextService(undefined, oAuthStore);
      return { oAuthStore, service };
    }

    it('should return null when no service agreement ID has been set', () => {
      const { service } = configureService();
      expect(service.getServiceAgreementId()).toBeUndefined();
    });

    it('should store the SAID in the OAuthStorage', () => {
      const { oAuthStore, service } = configureService();
      service.setServiceAgreementId('cafed00d');
      expect(oAuthStore.getItem(USER_CONTEXT_KEY)).toStrictEqual('cafed00d');
    });

    it('should retrieve the stored value from the OAuthStorage', () => {
      const { oAuthStore, service } = configureService();
      oAuthStore.setItem(USER_CONTEXT_KEY, 'cafed00d');
      expect(service.getServiceAgreementId()).toStrictEqual('cafed00d');
    });

    it('should not store the SAID in the SessionStorage', () => {
      const { service } = configureService();
      service.setServiceAgreementId('feedface');
      expect(sessionStorage.getItem(USER_CONTEXT_KEY)).toBeNull();
    });

    it('should not retrieve the stored value from the SessionStorage', () => {
      const { service } = configureService();
      sessionStorage.setItem(USER_CONTEXT_KEY, 'deadbeef');
      expect(service.getServiceAgreementId()).toBeUndefined();
    });
  });

  describe('when no explicit UserContextStorage or OAuthStorage are configured', () => {
    function configureService() {
      const service = new UserContextService(undefined, undefined);
      return { service };
    }

    it('should return null when no service agreement ID has been set', () => {
      const { service } = configureService();
      expect(service.getServiceAgreementId()).toBeUndefined();
    });

    it('should store the SAID in the SessionStorage', () => {
      const { service } = configureService();
      service.setServiceAgreementId('deadbeef');
      expect(sessionStorage.getItem(USER_CONTEXT_KEY)).toStrictEqual(
        'deadbeef'
      );
    });

    it('should retrieve the stored value from the SessionStorage', () => {
      const { service } = configureService();
      sessionStorage.setItem(USER_CONTEXT_KEY, 'deadbeef');
      expect(service.getServiceAgreementId()).toStrictEqual('deadbeef');
    });
  });
});
