import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

/**
 * Extract the WWW-Authenticate header and return the error value, if present.
 */
function getAuthenticationError(headers: HttpHeaders): string | undefined {
  const value = headers.get('www-authenticate')?.trim();
  if (!value) {
    return;
  }

  const regex = /error="(\w+)"/;
  const matches = regex.exec(value);
  return matches?.[1];
}

/**
 * The 401 (Unauthorized) status code indicates that the request has not
 * been applied because it lacks valid authentication credentials for
 * the target resource. The server generating a 401 response MUST send
 * a WWW-Authenticate header field (https://datatracker.ietf.org/doc/html/rfc7235#section-4.1)
 * containing at least one challenge applicable to the target resource.
 * An 'invalid_token' error would signify that a user's access token needs to be refreshed.
 */
export function isInvalidToken401(error: HttpErrorResponse) {
  if (error.status !== 401) {
    return false;
  }

  return getAuthenticationError(error.headers) === 'invalid_token';
}
