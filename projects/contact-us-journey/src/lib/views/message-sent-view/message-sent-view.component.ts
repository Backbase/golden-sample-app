import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactUsJourneyConfiguration } from 'projects/contact-us-journey/src/public-api';

@Component({
  templateUrl: 'message-sent-view.component.html',
})
export class MessageSentViewComponent {
    title = this.route.snapshot.data.title;

    constructor(
        private readonly route: ActivatedRoute,
        public readonly config: ContactUsJourneyConfiguration,
      ) {}
}