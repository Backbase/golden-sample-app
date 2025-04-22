import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionSigningService } from './transaction-signing.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    // Expose our implementation of TransactionSigningService
    TransactionSigningService,
  ],
  exports: [
    // No exports needed
  ],
})
export class TransactionSigningModule {}
