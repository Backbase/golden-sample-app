/**
 * This file provides compatibility mappings to fix issues with Backbase library versions
 * It provides the missing exports that are causing build errors
 */

import { OtpEntryErrorTypeEnum } from './backbase-compatibility.module';

// Export enum so it can be used in Angular templates as well
export { OtpEntryErrorTypeEnum };

// Create a dummy TransactionSigningService class with the expected API
export class BackbaseTransactionSigningService {
  signTransaction(transactionId: string): any {
    console.warn(
      'Using compatibility stub for Backbase TransactionSigningService'
    );
    return null;
  }
}
