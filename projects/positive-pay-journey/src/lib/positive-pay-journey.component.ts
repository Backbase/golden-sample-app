import { Component, OnInit } from '@angular/core';
import {PositivePayJourneyConfigurationService} from './positive-pay-journey-configuration.service';

@Component({
  selector: 'bb-positive-pay-journey',
  template: `
    <router-outlet></router-outlet>
  `,
  providers: [ PositivePayJourneyConfigurationService ]
})
export class PositivePayJourneyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
