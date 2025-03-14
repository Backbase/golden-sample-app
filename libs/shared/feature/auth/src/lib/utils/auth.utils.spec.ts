import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { isInvalidToken401 } from './auth.utils';

describe('Auth Utils', () => {
  describe('isInvalidToken401', () => {
    it('should return false if error.status !== 401', () => {
      const httpError = new HttpErrorResponse({ status: 404 });
      expect(isInvalidToken401(httpError)).toBe(false);
    });
    it('should return false if error description is not invalid_token', () => {
      const tokenRefreshErrorHeader = new HttpHeaders().set(
        'www-authenticate',
        'Bearer error="token_refresh_error"'
      );
      const httpError = new HttpErrorResponse({
        status: 401,
        headers: tokenRefreshErrorHeader,
      });
      expect(isInvalidToken401(httpError)).toBe(false);
    });
    it('should return true if error.status === 401 && error description is invalid_token', () => {
      const invalidTokenHeader = new HttpHeaders().set(
        'www-authenticate',
        'Bearer error="invalid_token"'
      );
      const httpError = new HttpErrorResponse({
        status: 401,
        headers: invalidTokenHeader,
      });
      expect(isInvalidToken401(httpError)).toBe(true);
    });
    it('should return true if www-authenticate header contains multiple attributes, including an error', () => {
      const headerWithMultipleAttributes = new HttpHeaders().set(
        'www-authenticate',
        'Bearer error="invalid_token", some="value", other="value"'
      );
      const httpError = new HttpErrorResponse({
        status: 401,
        headers: headerWithMultipleAttributes,
      });
      expect(isInvalidToken401(httpError)).toBe(true);
    });
    it('should return true if www-authenticate header contains multiple attributes, including an error (not first in list)', () => {
      const headerWithMultipleAttributes = new HttpHeaders().set(
        'www-authenticate',
        'Bearer some="value", error="invalid_token", other="value"'
      );
      const httpError = new HttpErrorResponse({
        status: 401,
        headers: headerWithMultipleAttributes,
      });
      expect(isInvalidToken401(httpError)).toBe(true);
    });
  });
});
