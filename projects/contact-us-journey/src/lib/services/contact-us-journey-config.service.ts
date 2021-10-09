import { Injectable, InjectionToken } from '@angular/core';
import { SocialNetworks } from '../model/SocialNetwork';

export interface ContactUsJourneyConfigurationI {
    companyAddress?: string;
    contactUsContentId?: string;
    businessInfoContentId?: string;
    stayConnectedContentId?: string;
    socialNetworks?: SocialNetworks;
}

// eslint-disable-next-line
export const ContactUsJourneyConfigurationToken = new InjectionToken<
ContactUsJourneyConfiguration
>('ContactUsJourneyConfiguration injection token');

@Injectable()
export class ContactUsJourneyConfiguration implements ContactUsJourneyConfigurationI {
    companyAddress = 'Jacob Bontiusplaats 9';
    contactUsContentId = '';
    businessInfoContentId = '';
    stayConnectedContentId = '';
    socialNetworks = [];
}
