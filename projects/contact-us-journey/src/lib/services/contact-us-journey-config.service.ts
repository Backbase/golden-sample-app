import { Injectable, InjectionToken } from '@angular/core';

export interface ContactUsJourneyConfigurationI {
    companyAddress?: string;
    contactUsContentId?: string;
    businessInfoContentId?: string;
    stayConnectedContentId?: string;
    socialNetworks?: Array<string>;
}

// eslint-disable-next-line
export const ContactUsJourneyConfigurationToken = new InjectionToken<
ContactUsJourneyConfiguration
>('ContactUsJourneyConfiguration injection token');

@Injectable()
export class ContactUsJourneyConfiguration implements ContactUsJourneyConfigurationI {
    companyAddress = 'Jacob Bontiusplaats 9';
    socialNetworks = ['facebook'];
    contactUsContentId = '';
    businessInfoContentId = '';
    stayConnectedContentId = '';
}
