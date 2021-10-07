import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactUsJourneyConfiguration } from 'projects/contact-us-journey/src/public-api';

@Component({
  templateUrl: 'contact-options-view.component.html',
})
export class ContactOptionsViewComponent {
  title = this.route.snapshot.data.title;
  contactUsSectionTitle = this.route.snapshot.data.contactUsSectionTitle;
  businessInfoSectionTitle = this.route.snapshot.data.businessInfoSectionTitle;
  stayConnectedSectionTitle = this.route.snapshot.data.stayConnectedSectionTitle;

  @Input() contactUsSectionContentId!: number;
  @Input() businessInfoSectionContentId!: number;
  @Input() stayConnectedSectionContentId!: number;
  
  address: string = this.config.companyAddress;
  
  submitMessage(): void {
    this.router.navigate(['../message-sent'], { relativeTo: this.route });
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly config: ContactUsJourneyConfiguration,
  ) {}
}
