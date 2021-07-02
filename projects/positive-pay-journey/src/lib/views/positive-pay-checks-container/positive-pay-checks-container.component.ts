import { Component, OnInit } from '@angular/core';
import { Tab } from '../../models/tab.model';
import { ActivatedRoute, Route } from '@angular/router';
import { createTabObject } from '../../helpers/tab.helper';

@Component({
  selector: 'bb-positive-pay-checks-container',
  templateUrl: './positive-pay-checks-container.component.html',
})
export class PositivePayChecksContainerComponent implements OnInit {
  /**
   * Collection of Tabs to be rendered according to the journey layout and routing.
   */
  public tabs: Tab[] = [];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeConfig = this.route.routeConfig;
    if (routeConfig && routeConfig.children) {
      this.createTabs(routeConfig);
    }
  }

  private createTabs(routeConfig: Route) {
    this.tabs = (routeConfig.children || [])
      .filter((routeItem) => routeItem.path)
      .map((routeItem, index) => createTabObject(routeItem.data?.title, routeItem.path, index));
  }
}
