import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionSigningService } from './transaction-signing.service';
import { TransactionSigningBridgeService } from './transaction-signing-bridge.service';

/**
 * Service module for transaction signing.
 *
 * This module provides the transaction signing service and bridge service
 * for use in the application.
 */
@NgModule({
  imports: [CommonModule],
  providers: [TransactionSigningService, TransactionSigningBridgeService],
})
export class TransactionSigningServiceModule {}
