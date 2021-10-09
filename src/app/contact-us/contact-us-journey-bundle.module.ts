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
      socialNetworks: [
        {
          name: 'Facebook',
          iconName: 'facebook',
          url: 'https://www.facebook.com/backbase/'
        },
        {
          name: 'Twitter',
          iconName: 'twitter',
          url: 'https://twitter.com/backbase',
        },
        {
          name: 'Instagram',
          iconName: 'instagram',
          url: 'https://www.instagram.com/life_at_backbase',
        }
      ]
    } as ContactUsJourneyConfiguration
  }],
})
export class ContactUsJourneyBundleModule {
}
