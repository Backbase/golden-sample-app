import { Component, Inject, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactUsJourneyConfiguration, ContactUsJourneyConfigurationToken } from 'projects/contact-us-journey/src/public-api';
import { SocialNetwork } from '../../model/SocialNetwork';

@Component({
  templateUrl: 'contact-options-view.component.html',
})
export class ContactOptionsViewComponent {
  title = this.route.snapshot.data.title;
  contactUsSectionTitle = this.route.snapshot.data.contactUsSectionTitle;
  businessInfoSectionTitle = this.route.snapshot.data.businessInfoSectionTitle;
  stayConnectedSectionTitle = this.route.snapshot.data.stayConnectedSectionTitle;
  socialNetworks: Array<SocialNetwork> = this.config.socialNetworks;

  @Input() contactUsSectionContentId!: number;
  @Input() businessInfoSectionContentId!: number;
  @Input() stayConnectedSectionContentId!: number;
  
  address: string = this.config.companyAddress;
  
  submitMessage(): void {
    this.router.navigate(['../message-sent'], { relativeTo: this.route });
  }

  constructor(
    public config: ContactUsJourneyConfiguration,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}
}
