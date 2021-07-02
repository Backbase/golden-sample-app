import { Component, OnInit } from '@angular/core';
import { PositivePayJourneyConfigurationService } from './positive-pay-journey-configuration.service';
import { PositivePayStateModelService } from './state/positive-pay-state-model.service';

@Component({
  selector: 'bb-positive-pay-journey',
  template: ` <router-outlet></router-outlet> `,
  providers: [PositivePayJourneyConfigurationService, PositivePayStateModelService],
})
export class PositivePayJourneyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
