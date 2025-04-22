import { NgModule } from '@angular/core';
import { TransactionSigningService } from '../transaction-signing';
import { FactoryProvider } from '@angular/core';

// Recreate the missing OtpEntryErrorTypeEnum
export enum OtpEntryErrorTypeEnum {
  ERROR = 'error',
  WARNING = 'warning',
}

@NgModule({
  providers: [
    // Fix for missing OtpEntryErrorTypeEnum in @backbase/identity-auth/internal
    {
      provide: '@backbase/identity-auth/internal#OtpEntryErrorTypeEnum',
      useValue: OtpEntryErrorTypeEnum,
    },
    // Fix for missing TransactionSigningService in @backbase/identity-auth/transaction-signing
    {
      provide:
        '@backbase/identity-auth/transaction-signing#TransactionSigningService',
      useExisting: TransactionSigningService,
    },
  ],
})
export class BackbaseCompatibilityModule {}
