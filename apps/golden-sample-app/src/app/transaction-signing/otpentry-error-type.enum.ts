/**
 * Enum for OTP Entry error types during transaction signing.
 *
 * These error types represent the various error conditions that can occur
 * during One-Time Password (OTP) entry for transaction signing.
 */
export enum OtpEntryErrorType {
  /**
   * Error when the OTP is invalid
   */
  INVALID_OTP = 'INVALID_OTP',

  /**
   * Error when the OTP has expired
   */
  EXPIRED_OTP = 'EXPIRED_OTP',

  /**
   * Error when there are too many failed attempts
   */
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',

  /**
   * Error when the transaction signing process has timed out
   */
  TIMEOUT = 'TIMEOUT',

  /**
   * Generic error for any other unexpected issues
   */
  GENERIC_ERROR = 'GENERIC_ERROR',
}
