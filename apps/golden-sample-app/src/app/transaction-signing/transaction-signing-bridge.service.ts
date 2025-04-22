import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionSigningService } from './transaction-signing.service';

/**
 * TransactionSigningBridgeService acts as a bridge between the application's
 * transaction signing interface and the stub implementation.
 *
 * This service adapts the TransactionSigningService to be used in different contexts
 * where transaction signing is required.
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionSigningBridgeService {
  constructor(private transactionSigningService: TransactionSigningService) {}

  /**
   * Signs a transaction with the given ID
   * Delegates to the underlying TransactionSigningService
   */
  signTransaction(transactionId: string): Observable<boolean> {
    return this.transactionSigningService.signTransaction(transactionId);
  }

  /**
   * Checks if transaction signing is available
   * Delegates to the underlying TransactionSigningService
   */
  checkSigning(): Observable<boolean> {
    return this.transactionSigningService.checkSigning();
  }

  /**
   * Cancels an ongoing transaction signing process
   * Delegates to the underlying TransactionSigningService
   */
  cancelSigning(): Observable<boolean> {
    return this.transactionSigningService.cancelSigning();
  }
}
