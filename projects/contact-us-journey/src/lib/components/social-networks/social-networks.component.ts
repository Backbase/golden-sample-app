import { Component } from "@angular/core";
import { ContactUsJourneyConfiguration } from "projects/contact-us-journey/src/public-api";

@Component({
    selector: 'bb-social-networks',
    templateUrl: 'social-networks.component.html',
    styleUrls: ['social-networks.component.scss'],
})
export class SocialNetworksComponent {
    constructor(public readonly config: ContactUsJourneyConfiguration) {}
}