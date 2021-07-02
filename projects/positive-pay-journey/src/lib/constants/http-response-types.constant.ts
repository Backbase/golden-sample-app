/**
 * Enum of response types for HttpClient
 *
 * @internal
 */
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line no-shadow
export enum HttpResponseType {
  /** Return raw body. */
  BODY = 'body',
  /** Return Response object. */
  RESPONSE = 'response',
  /** Return Event object. */
  EVENT = 'event',
}
/* eslint-enable @typescript-eslint/naming-convention */
