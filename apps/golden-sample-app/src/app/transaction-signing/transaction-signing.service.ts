import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Implementation of TransactionSigningService that provides a stub for the transaction signing API.
 *
 * This implementation always returns success, enabling development to proceed without
 * the actual authentication backend.
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionSigningService {
  constructor() {
    console.log(
      'Using simplified TransactionSigningService stub implementation'
    );
  }

  /**
   * Method to sign a transaction
   * This stub implementation always returns success
   */
  signTransaction(transactionId: string): Observable<boolean> {
    console.log('Transaction signing requested for:', transactionId);
    return of(true);
  }

  /**
   * Method to check if transaction signing is available
   * This stub implementation always returns true
   */
  checkSigning(): Observable<boolean> {
    return of(true);
  }

  /**
   * Method to cancel transaction signing
   * This stub implementation always returns success
   */
  cancelSigning(): Observable<boolean> {
    return of(true);
  }
}
