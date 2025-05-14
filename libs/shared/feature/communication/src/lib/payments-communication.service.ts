import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  InitiatePaymentJourneyCommunicationService,
  InitiatePaymentJourneyComponentApi,
  TriggerInitiatePaymentPayload,
} from '@backbase/initiate-payment-journey-ang';

@Injectable({
  providedIn: 'root',
})
export class PaymentsCommunicationService implements InitiatePaymentJourneyCommunicationService
{
  isEditMode?: boolean;
  private paymentData?: TriggerInitiatePaymentPayload;

  constructor(private readonly router: Router) {}

  init(api: InitiatePaymentJourneyComponentApi): void {
    api.setupData(this.paymentData);
  }

  reset() {
    this.isEditMode = false;
    this.paymentData = undefined;
  }


  async closeEvent() {
    if (this.activatedFromPockets()) {
      await this.navigateToPockets();
    } else {
      await this.navigateToScheduledTransfers();
    }
  }

  async afterSuccess?(): Promise<void> {
    if (this.activatedFromPockets()) {
      await this.navigateToPockets();
    }
  }

  private async navigateToScheduledTransfers(): Promise<void> {
    await this.router.navigate(['transfers', 'activity']);
  }

  private async navigateToPockets(): Promise<void> {
    await this.router.navigate(['pockets']);
  }

  private activatedFromPockets(): boolean {
    const url = this.router.url;

    return url.includes('pocket-transfer');
  }
}
