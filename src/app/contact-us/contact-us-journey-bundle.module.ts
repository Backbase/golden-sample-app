import { NgModule } from '@angular/core';
import { ContactUsJourneyConfiguration, ContactUsJourneyModule } from 'projects/contact-us-journey/src/public-api';

@NgModule({
  imports: [ContactUsJourneyModule.forRoot()],
  providers: [{
    provide: ContactUsJourneyConfiguration,
    useValue: {
      companyAddress: 'Jacob Bontiusplaats 9',
      // contactUsContentId: '1',
      // businessInfoContentId: '1',
      // stayConnectedContentId: '1',
      socialNetworks: ['transactions', 'fingerprint', 'flare']
    } as ContactUsJourneyConfiguration
  }],
})
export class ContactUsJourneyBundleModule {
}
